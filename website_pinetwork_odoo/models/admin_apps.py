# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models
from odoo import tools, _
from odoo.exceptions import ValidationError
import requests
import json

import time

import odoo

import logging
_logger = logging.getLogger(__name__)

from datetime import datetime, timedelta

from dateutil.relativedelta import relativedelta, MO

import ast

from . import pi_python

class pi_transactions(models.Model):
    _name = "pi.transactions"
    _description = "Pi Transactions"

    name = fields.Char('Name')
    app_id = fields.Many2one('admin.apps', required=True, ondelete='restrict')
    app = fields.Char(related="app_id.app")
    action = fields.Selection([('approve', 'Approve'), ('complete', 'Complete'), ('cancelled', 'Cancelled')], 'Action', required=True)
    action_type = fields.Selection([('receive', 'Receive'), ('send', 'Send')], 'Action type', default="receive")
    counted_to_pay = fields.Selection([('counted', 'Counted'), ('not_counted', 'Not counted')], 'Counted to pay', default="not_counted")
    payment_id = fields.Char('PaymentId', required=True)
    txid = fields.Text('TXID')
    txid_url = fields.Text('TXID URL', compute="_compute_txid_url")
    pi_user_id = fields.Char('Pi User ID')
    pi_user = fields.Many2one('pi.users', ondelete='restrict')
    amount = fields.Float('Amount', digits=(50,7))
    memo = fields.Char('Memo')
    from_address = fields.Char('From address', compute="_compute_json_values", store=True)
    to_address = fields.Char('To address')
    developer_approved = fields.Boolean('developer_approved')
    transaction_verified = fields.Boolean('transaction_verified')
    developer_completed = fields.Boolean('developer_completed')
    cancelled = fields.Boolean('cancelled')
    user_cancelled = fields.Boolean('user_cancelled')
    json_result = fields.Text('JSON Result', required=True)
    
    @api.depends("json_result")
    def _compute_json_values(self):
        for pit in self:
            if pit.json_result:
                json_result = ast.literal_eval(pit.json_result)
                if "from_address" in json_result:
                    pit.from_address = json_result["from_address"]
                else:
                    pit.from_address = ""
            else:
                pit.from_address = ""
    
    def _compute_txid_url(self):
        for pit in self:
            if pit.txid:
                pit.txid_url = "https://minepi.com/blockexplorer/tx/" + pit.txid
            else:
                pit.txid_url = ""
    
    def check_transactions(self):
        for pit in self:
            try:
                
                if pit.action == "cancelled" and pit.action_type == "receive" and (pit.cancelled or pit.user_cancelled) and \
                    (datetime.now() - pit.create_date).seconds >= 39600: #11 horas
                    pit.unlink()
                elif pit.action == "approve" and pit.action_type == "receive" and pit.developer_approved and \
                    pit.transaction_verified and not pit.developer_completed and \
                    not (pit.cancelled or pit.user_cancelled):
                    self.env["admin.apps"].pi_api({'action': "complete", 'txid': pit.txid, 
                                                        'app_client': pit.app, 'paymentId': pit.payment_id})
                elif pit.action == "approve" and pit.action_type == "receive" and pit.developer_approved and \
                    not pit.transaction_verified and \
                    not (pit.cancelled or pit.user_cancelled) and \
                    (datetime.now() - pit.create_date).seconds >= 39600: #11 horas
                    pit.unlink()
                
                self.env.cr.commit()
            except:
                _logger.info(str("ERROR TRANSACTIONS"))
    
    def check_transactions_one_user(self):
        for pit in self:
            url = 'https://api.minepi.com/v2/payments/' + pit.payment_id
            
            re = requests.get(url,headers={'Authorization': "Key " + pit.app_id.admin_key})
            
            try:
                result = re.json()
                
                result_dict = json.loads(str(json.dumps(result)))
                
                if (result_dict['status']['cancelled'] or result_dict['status']['user_cancelled']) and pit.action!="cancelled" and pit.action_type == "receive":
                    pit.write({'action': 'cancelled'})
                elif result_dict['status']['developer_approved'] and not (result_dict['status']['cancelled'] or result_dict['status']['user_cancelled']) and pit.action!="approve" and pit.action_type == "receive":
                    pit.write({'action': 'approve'})
                if result_dict["status"]["transaction_verified"] and result_dict['status']['developer_completed'] and pit.action!="complete" and pit.action_type == "receive":
                    pit.write({'name': "complete. PaymentId: " + pit.payment_id,
                                'action': 'complete',
                                'payment_id': pit.payment_id,
                                'txid': result_dict["transaction"]["txid"],
                                'pi_user_id': result_dict["user_uid"],
                                'amount': result_dict["amount"],
                                'memo': result_dict["memo"],
                                'to_address': result_dict["to_address"]})
                    
                pit.write({'developer_approved': result_dict["status"]["developer_approved"], 
                        'transaction_verified': result_dict["status"]["transaction_verified"], 
                        'developer_completed': result_dict["status"]["developer_completed"], 
                        'cancelled': result_dict["status"]["cancelled"], 
                        'user_cancelled': result_dict["status"]["user_cancelled"],
                        'json_result': str(result_dict)})
                
                if pit.action == "cancelled" and pit.action_type == "receive" and \
                    (result_dict['status']['cancelled'] or result_dict['status']['user_cancelled']) and \
                    (datetime.now() - pit.create_date).seconds >= 39600: #11 horas
                    pit.unlink()
                elif pit.action == "approve" and pit.action_type == "receive" and result_dict["status"]["developer_approved"] and \
                    result_dict["status"]["transaction_verified"] and not result_dict["status"]["developer_completed"] and \
                    not (result_dict['status']['cancelled'] or result_dict['status']['user_cancelled']):
                    self.env["admin.apps"].pi_api({'action': "complete", 'txid': result_dict["transaction"]["txid"], 
                                                        'app_client': pit.app, 'paymentId': pit.payment_id})
                elif pit.action == "approve" and pit.action_type == "receive" and result_dict["status"]["developer_approved"] and \
                    not result_dict["status"]["transaction_verified"] and \
                    not (result_dict['status']['cancelled'] or result_dict['status']['user_cancelled']) and \
                    (datetime.now() - pit.create_date).seconds >= 39600: #11 horas
                    pit.unlink()
                
                self.env.cr.commit()
            except:
                _logger.info(str(re))

class admin_apps(models.Model):
    _name = "admin.apps"
    _description = "Admin Pi App"
    
    _sql_constraints = [
        # Partial constraint, complemented by a python constraint (see below).
        ('admin_apps_unique_key', 'unique (app)', 'You can not have two app with the same App code!'),
    ]

    name = fields.Char('Name')
    app = fields.Char('App code', required=True)
    admin_key = fields.Char('Admin Key', required=True, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    wallet_private_seed = fields.Char('Dev wallet private seed', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    validation_key = fields.Char('Validation Key', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    sandbox = fields.Boolean('Sandbox', required=True)
    mainnet = fields.Selection([('Mainnet ON', 'Mainnet ON'), ('Mainnet OFF', 'Mainnet OFF'), ('Testnet ON', 'Testnet ON'), ('Testnet OFF', 'Testnet OFF')], 'Mainnet', required=True, default="Testnet ON")
    pi_transactions_ids = fields.One2many('pi.transactions', 'app_id')
    pi_users_winners_datetime = fields.Datetime(string='Winners datetime', default="", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_count = fields.Integer(string='Winners count', compute="_compute_pi_users_winners_count", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_ids = fields.Many2many('pi.users', 'admin_apps_pi_users_winners_rel', string='Winners', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_paid_ids = fields.Many2many('pi.users', 'admin_apps_pi_users_winners_paid_rel', string='Winners Paid', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_ids_text = fields.Text(string='Winners Text', compute="_compute_pi_winner_text", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_paid_ids_text = fields.Text(string='Winners Paid Text', compute="_compute_pi_winner_text", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_ids_wallets = fields.Text(string='Winners pi wallet addresses', compute="_compute_pi_winner_text", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_paid_datetime = fields.Datetime(string='Winners paid datetime', default="", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_html = fields.Html('Winners HTML', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_to_pay = fields.Float('Winners To Pay', digits=(50,7), default=0, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_to_pay_percent = fields.Float('Winners To Pay percent (from 0 to 100)', digits=(50,2), default=0, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_to_pay_days = fields.Integer('Winners To Pay days', default=0, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_to_pay_seconds = fields.Integer('Winners To fill winners seconds', default=0, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_paying = fields.Boolean('Paying to winners', default=False, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_to_pay_per_user = fields.Float('Winners To Pay per user', digits=(50,7), store=True, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    #pi_users_winners_fee_to_pay = fields.Integer('Winners Fee To Pay', default=100000, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_winners_completed_payments = fields.Integer('Winners To Pay completed payments', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_devs_ids = fields.Many2many('pi.users', 'admin_apps_pi_users_devs_rel', string='Devs', domain=[('pi_user_role', 'in', ['latinchain_dev', 'latinchain_adm'])], groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_devs_paid_ids = fields.Many2many('pi.users', 'admin_apps_pi_users_devs_paid_rel', string='Devs Paid', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_account_balance = fields.Float('Account Balance', digits=(50,7), compute='_get_balance', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_devs_to_pay_per_user = fields.Float('Devs To Pay per user', digits=(50,7), store=True, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_users_devs_completed_payments = fields.Integer('Devs To Pay completed payments', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    block_points = fields.Boolean('Block points', default=False)
    amount = fields.Float('Amount', digits=(50,7), default=1)
    google_adsense = fields.Char('Google Adsense src', required=True, default="Set your Google Adsense", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    google_adsense_ads_txt = fields.Char('Google Adsense ads.txt', default="Set your Google Adsense ads.txt", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads = fields.Char('A-Ads.com src', required=True, default="Set your A-Ads.com URL", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_data = fields.Char('A-Ads.com data', required=True, default="Set your A-Ads.com data ID", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_style = fields.Char('A-Ads.com style', required=True, default="width:728px; height:90px; border:0px; padding:0; overflow:hidden; background-color: transparent;", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_2 = fields.Char('A-Ads.com src 2', required=True, default="Set your A-Ads.com URL", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_data_2 = fields.Char('A-Ads.com data 2', required=True, default="Set your A-Ads.com data ID", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_style_2 = fields.Char('A-Ads.com style 2', required=True, default="width:728px; height:90px; border:0px; padding:0; overflow:hidden; background-color: transparent;", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_3 = fields.Char('A-Ads.com src 3', required=True, default="Set your A-Ads.com URL", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_data_3 = fields.Char('A-Ads.com data 3', required=True, default="Set your A-Ads.com data ID", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    a_ads_style_3 = fields.Char('A-Ads.com style 3', required=True, default="width:728px; height:90px; border:0px; padding:0; overflow:hidden; background-color: transparent;", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    
    def _get_balance(self):
        for i in self:
            api_key = i.admin_key
            wallet_private_seed = i.wallet_private_seed
            
            if i.mainnet == "Mainnet ON":
                network = "Pi Network"
            else:
                network = "Pi Testnet"

            """ Initialization """
            pi = pi_python.PiNetwork()
            pi.initialize(api_key, wallet_private_seed, network)
    
            i.pi_users_account_balance = pi.get_balance()

    def fill_winners(self):
        winner_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_chess', '>=', 20), ('points_sudoku', '>', 18), ('points_snake', '>', 20), ('points', '>', 200)]
        winner_chess_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_chess', '>=', 20)]
        winner_sudoku_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_sudoku', '>', 18)]
        winner_snake_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_snake', '>', 20)]
        leaders_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30))]
        
        pi_users_leaders = self.env["pi.users"].search(leaders_domain, limit=10, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        pi_users_list = self.env["pi.users"].search(winner_domain, limit=10, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        pi_users_list_chess = self.env["pi.users"].search(winner_chess_domain, limit=10, order="points_chess desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        pi_users_list_snake = self.env["pi.users"].search(winner_snake_domain, limit=10, order="points_snake desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        pi_users_list_sudoku = self.env["pi.users"].search(winner_sudoku_domain, limit=10, order="points_sudoku desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        
        point_list = []
        point_list_name = []
        
        for i in pi_users_leaders:
            point_list.append(i.id)
            point_list_name.append(i.name)
        for i in pi_users_list:
            point_list.append(i.id)
        for i in pi_users_list_chess:
            point_list.append(i.id)
        for i in pi_users_list_snake:
            point_list.append(i.id)
        for i in pi_users_list_sudoku:
            point_list.append(i.id)
        
        for i in self:
            date_now = datetime.now()
            #transactions_domain = [('counted_to_pay', '=', 'not_counted'), ('action', '=', 'complete'), ('action_type', '=', 'receive'), ('create_date', '>=', date_now - timedelta(seconds=i.pi_users_winners_to_pay_seconds)), ('create_date', '<=', date_now - timedelta(seconds=1800))]

            #transactions_ids = self.env["pi.transactions"].read_group(transactions_domain, ['amount', 'action_type'], ['action_type'])
            
            #if len(transactions_ids) > 0:
            #    _logger.info(str(transactions_ids))
            
            #break

            #i.pi_users_winners_to_pay = 0
            #if len(transactions_ids) > 0:
            #    #_logger.info(str(transactions_ids[0]['amount']))
            #    i.pi_users_winners_to_pay += transactions_ids[0]['amount'] * (i.pi_users_winners_to_pay_percent/100)
                
            #transactions_ids = self.env["pi.transactions"].search(transactions_domain)
            #transactions_ids.write({'counted_to_pay': 'counted'})
            
            i.pi_users_winners_to_pay = i.pi_users_account_balance * (i.pi_users_winners_to_pay_percent/100)
            
            """    
            transactions_domain = [('counted_to_pay', '=', 'not_counted'), ('action', '=', 'complete'), ('action_type', '=', 'send'), ('create_date', '>=', datetime.now() - timedelta(seconds=i.pi_users_winners_to_pay_seconds))]

            transactions_ids = self.env["pi.transactions"].read_group(transactions_domain, ['amount', 'action_type'], ['action_type'])

            if len(transactions_ids) > 0:
                #_logger.info(str(transactions_ids[0]['amount']))
                i.pi_users_winners_to_pay -= transactions_ids[0]['amount']
            
            transactions_ids = self.env["pi.transactions"].search(transactions_domain)
            transactions_ids.write({'counted_to_pay': 'not_counted'})
            
            #transactions_ids.write({'counted_to_pay': 'counted'})
            
            if i.pi_users_winners_to_pay < 0:
                i.pi_users_winners_to_pay = 0
            """

            i.pi_users_winners_ids = [(6, 0, point_list)]
            i.pi_users_winners_datetime = datetime.now()
    
    def delete_paid_winners(self):
        for i in self:
            i.pi_users_winners_paid_ids = [(6, 0, [])]
            
    def fill_paid_winners(self):
        for i in self:
            winner = []
            for j in self.pi_users_winners_ids:
                transactions_domain = [('pi_user', '=', j.id), ('action', '=', 'complete'), ('action_type', '=', 'send'), ('create_date', '>=', datetime.now() - timedelta(days=(i.pi_users_winners_to_pay_days)))]
                    
                transactions_ids = self.env["pi.transactions"].search(transactions_domain, limit=1)

                if len(transactions_ids) > 0:
                    winner.append(j.id)
                    
            i.pi_users_winners_paid_ids = [(6, 0, winner)]
    
    def pay_winners(self):
        for self_i in self:
            self_i.pi_users_winners_paying = True
            self.env.cr.commit()
            
            winner_paid_list = []
            
            """ 
                Your SECRET Data 
                Visit the Pi Developer Portal to get these data
                
                 DO NOT expose these values to public
            """
            admin_app_list = self_i
            
            api_key = admin_app_list.admin_key
            wallet_private_seed = admin_app_list.wallet_private_seed
            
            if admin_app_list.mainnet == "Mainnet ON":
                network = "Pi Network"
            else:
                network = "Pi Testnet"

            """ Initialization """
            pi = pi_python.PiNetwork()
            pi.initialize(api_key, wallet_private_seed, network)
            
            self_i.pi_users_winners_completed_payments = 0
            
            """ Check for incomplete payments """
            incomplete_payments = pi.get_incomplete_server_payments()

            """ Handle incomplete payments first """
            if len(incomplete_payments) > 0:
                for i in incomplete_payments:
                    if i["transaction"] == None:
                        pi_user = self.env['pi.users'].sudo().search([('pi_user_id', '=', i["user_uid"])])
                        if len(pi_user) > 0:
                            txid = pi.submit_payment(i["identifier"], i)
                            
                            if txid:
                                result = self.pi_api({'paymentId': i["identifier"],
                                            'app_client': 'auth_platform',
                                            'action': 'complete',
                                            'pi_user_code': pi_user[0].pi_user_code,
                                            'txid': txid})
                            
                                result = json.loads(result)
                                #pi.complete_payment(i["identifier"], txid)
                                if result["result"]:
                                    self_i.pi_users_winners_completed_payments += 1
                                    self_i.pi_users_winners_paid_ids = [(4, pi_user[0].id)]
                                    self_i.pi_users_winners_to_pay = self_i.pi_users_winners_to_pay - float(i["amount"])
                                    if self_i.pi_users_winners_to_pay < 0:
                                        self_i.pi_users_winners_to_pay = 0
                                self.env.cr.commit()
                            else:
                                pi.cancel_payment(i["identifier"])
                    else:
                        pi_user = self.env['pi.users'].sudo().search([('pi_user_id', '=', i["user_uid"])])
                        if len(pi_user) > 0:
                            result = self.pi_api({'paymentId': i["identifier"],
                                            'app_client': 'auth_platform',
                                            'action': 'complete',
                                            'pi_user_code': pi_user[0].pi_user_code,
                                            'txid': i["transaction"]["txid"]})
                            
                            result = json.loads(result)
                            if result["result"]:
                                self_i.pi_users_winners_completed_payments += 1
                                self_i.pi_users_winners_paid_ids = [(4, pi_user[0].id)]
                                self_i.pi_users_winners_to_pay = self_i.pi_users_winners_to_pay - float(i["amount"])
                                if self_i.pi_users_winners_to_pay < 0:
                                    self_i.pi_users_winners_to_pay = 0
                            #pi.complete_payment(i["identifier"], i["transaction"]["txid"])
                            self.env.cr.commit()
                        else:
                            pi.cancel_payment(i["identifier"])
            
            winners = self_i._compute_to_pay()
            
            for i in winners:
                transactions_domain = [('pi_user', '=', i.id), ('action', '=', 'complete'), ('action_type', '=', 'send'), ('create_date', '>=', datetime.now() - timedelta(days=(self_i.pi_users_winners_to_pay_days-1)))]
                
                transactions_ids = self.env["pi.transactions"].search(transactions_domain, limit=1)

                if len(transactions_ids) == 0 and float(admin_app_list.pi_users_winners_to_pay_per_user) > 0:
                    """ 
                        Example Data
                        Get the user_uid from the Frontend
                    """
                    user_uid = i.pi_user_id #unique for every user

                    """ Build your payment """
                    payment_data = {
                      "amount": float(admin_app_list.pi_users_winners_to_pay_per_user),
                      "memo": "Payment prize from LatinChain Platform",
                      "metadata": {"internal_data": "Payment prize from LatinChain Platform"},
                      "uid": user_uid
                    }

                    """ Create an payment """
                    payment_id = pi.create_payment(payment_data)

                    """ 
                        Submit the payment and receive the txid
                        
                        Store the txid on your side!
                    """
                    if payment_id and len(payment_id) > 0:
                        txid = pi.submit_payment(payment_id, False)

                        if txid and len(txid) > 0:
                            """ Complete the Payment """
                            result = self.pi_api({'paymentId': payment_id,
                                            'app_client': 'auth_platform',
                                            'action': 'complete',
                                            'pi_user_code': i.pi_user_code,
                                            'txid': txid})
                                            
                            result = json.loads(result)
                            if result["result"]:
                                self_i.pi_users_winners_completed_payments += 1
                                self_i.pi_users_winners_paid_ids = [(4, i.id)]
                                self_i.pi_users_winners_to_pay = self_i.pi_users_winners_to_pay - float(payment_data["amount"])
                                if self_i.pi_users_winners_to_pay < 0:
                                    self_i.pi_users_winners_to_pay = 0
                        
                            #payment = pi.complete_payment(payment_id, txid)
                            
                            #winner_paid_list.append(i.id)
                            
                            #self_i.pi_users_winners_paid_ids = [(4, i.id)]
                            
                            self.env.cr.commit()
                        else:
                            pi.cancel_payment(payment_id)
                        
            self_i.pi_users_winners_paying = False
            self.env.cr.commit()

    def pay_devs(self):
        for self_i in self:
            
            """ 
                Your SECRET Data 
                Visit the Pi Developer Portal to get these data
                
                 DO NOT expose these values to public
            """
            admin_app_list = self_i

            self_i.pi_users_devs_paid_ids = [(6, 0, [])]
            
            api_key = admin_app_list.admin_key
            wallet_private_seed = admin_app_list.wallet_private_seed
            
            if admin_app_list.mainnet == "Mainnet ON":
                network = "Pi Network"
            else:
                network = "Pi Testnet"

            """ Initialization """
            pi = pi_python.PiNetwork()
            pi.initialize(api_key, wallet_private_seed, network)
            
            self_i.pi_users_devs_completed_payments = 0
            
            """ Check for incomplete payments """
            incomplete_payments = pi.get_incomplete_server_payments()

            """ Handle incomplete payments first """
            if len(incomplete_payments) > 0:
                for i in incomplete_payments:
                    if i["transaction"] == None:
                        pi_user = self.env['pi.users'].sudo().search([('pi_user_id', '=', i["user_uid"])])
                        if len(pi_user) > 0:
                            txid = pi.submit_payment(i["identifier"], i)
                            
                            if txid:
                                result = self.pi_api({'paymentId': i["identifier"],
                                            'app_client': 'auth_platform',
                                            'action': 'complete',
                                            'pi_user_code': pi_user[0].pi_user_code,
                                            'txid': txid})
                            
                                result = json.loads(result)
                                #pi.complete_payment(i["identifier"], txid)
                                if result["result"]:
                                    self_i.pi_users_devs_completed_payments += 1
                                    self_i.pi_users_devs_paid_ids = [(4, pi_user[0].id)]
                                self.env.cr.commit()
                            else:
                                pi.cancel_payment(i["identifier"])
                    else:
                        pi_user = self.env['pi.users'].sudo().search([('pi_user_id', '=', i["user_uid"])])
                        if len(pi_user) > 0:
                            result = self.pi_api({'paymentId': i["identifier"],
                                            'app_client': 'auth_platform',
                                            'action': 'complete',
                                            'pi_user_code': pi_user[0].pi_user_code,
                                            'txid': i["transaction"]["txid"]})
                            
                            result = json.loads(result)
                            if result["result"]:
                                self_i.pi_users_devs_completed_payments += 1
                                self_i.pi_users_devs_paid_ids = [(4, pi_user[0].id)]
                            #pi.complete_payment(i["identifier"], i["transaction"]["txid"])
                            self.env.cr.commit()
                        else:
                            pi.cancel_payment(i["identifier"])
            
            devs = self_i._compute_to_pay_devs()
            #self_i.pi_users_devs_ids
            
            _logger.info("DEVS " + str(devs))
            
            for i in devs:
                if float(admin_app_list.pi_users_devs_to_pay_per_user) > 0:
                    """ 
                        Example Data
                        Get the user_uid from the Frontend
                    """
                    user_uid = i.pi_user_id #unique for every user

                    """ Build your payment """
                    payment_data = {
                      "amount": float(admin_app_list.pi_users_devs_to_pay_per_user),
                      "memo": "Dev payment from LatinChain Platform",
                      "metadata": {"internal_data": "Payment prize from LatinChain Platform"},
                      "uid": user_uid
                    }

                    """ Create an payment """
                    payment_id = pi.create_payment(payment_data)

                    """ 
                        Submit the payment and receive the txid
                        
                        Store the txid on your side!
                    """
                    if payment_id and len(payment_id) > 0:
                        txid = pi.submit_payment(payment_id, False)

                        if txid and len(txid) > 0:
                            """ Complete the Payment """
                            result = self.pi_api({'paymentId': payment_id,
                                            'app_client': 'auth_platform',
                                            'action': 'complete',
                                            'pi_user_code': i.pi_user_code,
                                            'txid': txid})
                                            
                            result = json.loads(result)
                            if result["result"]:
                                self_i.pi_users_devs_completed_payments += 1
                                self_i.pi_users_devs_paid_ids = [(4, i.id)]
                        
                            #payment = pi.complete_payment(payment_id, txid)
                            
                            #winner_paid_list.append(i.id)
                            
                            #self_i.pi_users_winners_paid_ids = [(4, i.id)]
                            
                            self.env.cr.commit()
                        else:
                            pi.cancel_payment(payment_id)
        
    def delete_winners(self):
        for i in self:
            i.pi_users_winners_ids = [(6, 0, [])]
            i.pi_users_winners_datetime = ""
            #i.pi_users_winners_to_pay = 0
    
    @api.depends("pi_users_winners_ids")
    def _compute_pi_users_winners_count(self):
        for i in self:
            i.pi_users_winners_count = len(i.pi_users_winners_ids)
    
    def _compute_to_pay(self):
        winners_list = list()
        for i in self:
            if len(i.pi_users_winners_ids) == 0:
                i.pi_users_winners_to_pay_per_user = 0
            else:
                counter_winner = len(i.pi_users_winners_ids.ids)
                winners = list()
                for j in i.pi_users_winners_ids:
                    winner_paid = False
                    for k in i.pi_users_winners_paid_ids:
                        if j.pi_user_code == k.pi_user_code:
                            winner_paid = True
                            counter_winner-=1
                            break
                    if not winner_paid:
                        winners.append(j)
                        
                if counter_winner > 0:
                    i.pi_users_winners_to_pay_per_user = i.pi_users_winners_to_pay / counter_winner
                else:
                    i.pi_users_winners_to_pay_per_user = 0
                    
                winners_list = winners
        
        return winners_list
                
    def _compute_to_pay_devs(self):
        devs_list = list()
        for i in self:
            devs = list()
            for j in i.pi_users_devs_ids:
                dev_paid = False
                for k in i.pi_users_devs_paid_ids:
                    if j.pi_user_code == k.pi_user_code:
                        dev_paid = True
                        break
                if not dev_paid:
                    devs.append(j)
                
            devs_list = devs
        
        return devs_list
    
    @api.depends("pi_users_winners_ids", "pi_users_winners_paid_ids")
    def _compute_pi_winner_text(self):
        for i in self:
            i.pi_users_winners_ids_text = ""
            for winner in i.pi_users_winners_ids:
                i.pi_users_winners_ids_text += str(winner.name) + ", "
                
            i.pi_users_winners_paid_ids_text = ""
            for paid in i.pi_users_winners_paid_ids:
                i.pi_users_winners_paid_ids_text += str(paid.name) + ", "
                
            i.pi_users_winners_ids_wallets = ""
            for winner in i.pi_users_winners_ids:
                i.pi_users_winners_ids_wallets += str(winner.pi_wallet_address) + ", "
    
    def pi_api(self, kw):
        
        if kw['action'] == "approve":
            url = 'https://api.minepi.com/v2/payments/' + kw['paymentId'] + '/approve'
            obj = {}
        elif kw['action'] == "complete":
            url = 'https://api.minepi.com/v2/payments/' + kw['paymentId'] + '/complete'
            if kw['txid'] == "":
                obj = {}
            else:
                obj = {'txid': kw['txid']}
            
        admin_app_list = self.env["admin.apps"].sudo().search([('app', '=', kw['app_client'])])
        
        if len(admin_app_list) == 0:
            result = {"result": False, "error": "SERVER MESSAGE: There is not API Key Stored in DB"}
            return json.dumps(result)
        
        re = requests.post(url,data=obj,json=obj,headers={'Authorization': "Key " + admin_app_list[0].admin_key})
        
        try:
            
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if kw['action'] == "approve":
                """
                pi_user = self.env['pi.users'].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
                self.env["pi.transactions"].sudo().create({'name': kw['action'] + ". PaymentId: " + kw['paymentId'],
                                                                'app_id': admin_app_list[0].id,
                                                                'action': kw['action'],
                                                                'payment_id': kw['paymentId'],
                                                                'json_result': str(result_dict),
                                                                'pi_user_id': result_dict["user_uid"],
                                                                'pi_user': pi_user[0].id,
                                                                'amount': result_dict["amount"],
                                                                'memo': result_dict["memo"],
                                                                'to_address': result_dict["to_address"],
                                                                'developer_approved': result_dict["status"]["developer_approved"], 
                                                                'transaction_verified': result_dict["status"]["transaction_verified"], 
                                                                'developer_completed': result_dict["status"]["developer_completed"], 
                                                                'cancelled': result_dict["status"]["cancelled"], 
                                                                'user_cancelled': result_dict["status"]["user_cancelled"]})
                self.env["pi.transactions"].sudo().search([('action', '=', 'approve'), 
                                                            ('pi_user_id', '=', result_dict["user_uid"])]).check_transactions_one_user()
                """
                if result_dict["status"]["developer_approved"]:
                    result = {"result": True, "approved": True}
                else:
                    result = {"result": True, "approved": False}
            elif kw['action'] == "complete":
                pi_user = self.env['pi.users'].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
                data_dict = {'name': kw['action'] + ". PaymentId: " + kw['paymentId'],
                            'app_id': admin_app_list[0].id,
                            'action': kw['action'],
                            'payment_id': kw['paymentId'],
                            'txid': kw['txid'],
                            'pi_user_id': result_dict["user_uid"],
                            'pi_user': pi_user[0].id,
                            'json_result': str(result_dict),
                            'pi_user_id': result_dict["user_uid"],
                            'amount': result_dict["amount"],
                            'memo': result_dict["memo"],
                            'to_address': result_dict["to_address"],
                            'developer_approved': result_dict["status"]["developer_approved"], 
                            'transaction_verified': result_dict["status"]["transaction_verified"], 
                            'developer_completed': result_dict["status"]["developer_completed"], 
                            'cancelled': result_dict["status"]["cancelled"], 
                            'user_cancelled': result_dict["status"]["user_cancelled"]}
                
                admin_app = self.env["admin.apps"].sudo().search([('app', '=', "auth_platform")])
                if "direction" in result_dict and result_dict["direction"] == "app_to_user":
                    data_dict.update({'action_type': 'send'})
                elif "direction" in result_dict and result_dict["direction"] == "user_to_app":
                    data_dict.update({'action_type': 'receive'})
                    #if not admin_app[0].pi_users_winners_paying:
                    #    admin_app[0].pi_users_winners_to_pay = admin_app[0].pi_users_winners_to_pay + (float(result_dict["amount"]) * (admin_app[0].pi_users_winners_to_pay_percent/100))
                
                transaction_count = self.env["pi.transactions"].sudo().search_count([('payment_id', '=', kw['paymentId'])])
                if transaction_count == 0:
                    self.env["pi.transactions"].sudo().create(data_dict)
                else:
                    self.env["pi.transactions"].sudo().search([('payment_id', '=', kw['paymentId'])]).write(data_dict)
                    
                transaction = self.env["pi.transactions"].sudo().search([('payment_id', '=', kw['paymentId'])])
                
                result = {"result": True, "completed": False}
                if len(transaction) > 0 and kw['app_client'] in ['auth_pidoku', 'auth_snake', 'auth_platform', 'auth_example']:
                    if result_dict["status"]["transaction_verified"] and result_dict["status"]["developer_approved"] and result_dict["status"]["developer_completed"]:
                        users = transaction[0].pi_user
                        
                        if len(users) > 0:
                            if users[0].paid_in_transactions >= admin_app_list[0].amount:
                                users[0].sudo().write({'unblocked_datetime': datetime.now()})
                            
                        result = {"result": True, "completed": True}
                    elif not result_dict["status"]["transaction_verified"] and result_dict["status"]["developer_approved"] and result_dict["status"]["developer_completed"]:
                        transaction[0].sudo().write({'action': 'approve'})
            else:
                result = {"result": True, "completed": False, "approved": False}
        except:
            result = {"result": False, "error": "SERVER MESSAGE: " + str(re)}
        
        return json.dumps(result)

class pi_users(models.Model):
    _name = "pi.users"
    _description = "Pi Users"
    _order = "points desc,unblocked_datetime desc,points_datetime asc,id asc"
    
    _sql_constraints = [
        # Partial constraint, complemented by a python constraint (see below).
        ('pi_user_unique_key', 'unique (pi_user_code)', 'You can not have two users with the same User code!'),
    ]

    name = fields.Char('Name')
    email = fields.Char('Email')
    pi_user_id = fields.Char('Pi User ID', required=True, groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_user_code = fields.Char('Pi User Code', required=True)
    pi_user_role = fields.Selection([('pi_user', 'Pi User'), ('latinchain_dev', 'LatinChain Dev'), ('latinchain_adm', 'LatinChain Administration')], 'Pi User Role', default="pi_user", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_wallet_address = fields.Char('Wallet Address', size=56, default="", groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    passkey = fields.Char('Pass Key')
    points = fields.Float('Pi User Points', compute="_total_points", store=True, digits=(50,7))
    points_chess = fields.Float('Chess Points', required=True, default=0, digits=(50,7))
    points_sudoku = fields.Float('Sudoku Points', required=True, default=0, digits=(50,7))
    points_snake = fields.Float('Snake Points', required=True, default=0, digits=(50,7))
    points_datetime = fields.Datetime('Points Datetime', compute="_total_points", store=True, default=datetime.now())
    paid_in_transactions = fields.Float('Paid by user in transactions', compute="_total_paid_transactions", store=True, digits=(50,7), groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    pi_transactions_ids = fields.One2many('pi.transactions', 'pi_user', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    unblocked = fields.Boolean('Unblocked', compute="_compute_unblocked", store=False)
    unblocked_datetime = fields.Datetime('Unblocked datetime', compute="_total_paid_transactions", store=True)
    user_agent = fields.Char('User agent')
    last_connection = fields.Datetime(string='Last connection', default="")
    days_available = fields.Integer('Days available', compute="_compute_unblocked", store=False)
    admin_apps_winners_ids = fields.Many2many('admin.apps', 'admin_apps_pi_users_winners_rel', string='Winners Apps', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    admin_apps_winners_paid_ids = fields.Many2many('admin.apps', 'admin_apps_pi_users_winners_paid_rel', string='Winners Paid Apps', groups="website_pinetwork_odoo.group_pi_admin,base.group_system")
    donator = fields.Boolean('Donator', compute="_compute_donator", store=True)
    paid_in_all_donations = fields.Float('Paid by user in donations', compute="_compute_donator", store=True, digits=(50,7))
    
    @api.depends("pi_transactions_ids", "pi_transactions_ids.action", "pi_transactions_ids.app_id", "pi_transactions_ids.app_id.app")
    def _compute_donator(self):
        for i in self:
            i.donator = False
            transaction = self.env['pi.transactions'].search([('id', 'in', i.pi_transactions_ids.ids), ('app_id.app', '=', 'auth_example'), ('action', '=', 'complete'), ('action_type', '=', 'receive')], limit=1)
            
            if len(transaction) == 0:
                i.donator = False
            else:
                i.donator = True
            
            total = 0    
            for j in i.pi_transactions_ids:
                if j.action == "complete" and j.action_type == "receive" and j.app_id.app == "auth_example":
                    total += j.amount
            
            i.paid_in_all_donations = total
                        
    @api.depends("points_chess", "points_sudoku", "points_snake")
    def _total_points(self):
        for i in self:
            total_points = i.points
            i.points = i.points_chess + i.points_sudoku + i.points_snake
            if i.points != total_points:
                i.points_datetime = datetime.now()
                
    @api.depends("unblocked_datetime")
    def _compute_unblocked(self):
        for i in self:
            if i.unblocked_datetime:
                i.days_available = 30 - (datetime.now() - i.unblocked_datetime).days
            else:
                i.days_available = 0
            
            if i.days_available < 0:
                i.days_available = 0
            
            if i.days_available == 0:
                i.unblocked = False
            else:
                i.unblocked = True
    
    @api.depends("pi_transactions_ids", "pi_transactions_ids.action")
    def _total_paid_transactions(self):
        for i in self:
            total = 0
            for j in i.pi_transactions_ids:
                if j.action == "complete" and j.action_type == "receive":
                    total += j.amount
            
            i.paid_in_transactions = total
            
            #if i.paid_in_transactions > 0:
            #    i.unblocked = True
                
            transaction = self.env['pi.transactions'].search([('id', 'in', i.pi_transactions_ids.ids), ('action', '=', 'complete'), ('action_type', '=', 'receive')], order="create_date desc", limit=1)
            
            if len(transaction) == 0:
                #i.unblocked = False
                #i.days_available = 0
                i.unblocked_datetime = ""
            else:
                #days_available = 30 - (datetime.now() - transaction[0].create_date).days
                
                i.unblocked_datetime = transaction[0].create_date
                
                #if days_available < 0:
                #    days_available = 0
                
                #if i.days_available == 0:
                #    i.unblocked = False

    """
    def check_users(self):
        #i = 0
        for piu in self:
            transaction = self.env['pi.transactions'].search([('id', 'in', piu.pi_transactions_ids.ids), ('action', '=', 'complete'), ('action_type', '=', 'receive')], order="create_date desc", limit=1)
            
            if len(transaction) == 0:
                piu.write({'unblocked': False, 'days_available': 0})
            else:
                days_available = 30 - (datetime.now() - transaction[0].create_date).days
                
                if days_available < 0:
                    days_available = 0
                
                piu.write({'days_available': days_available})
                
                if days_available == 0:
                    piu.write({'unblocked': False})
            #_logger.info(str(i))
            #i+=1
            
            self.env.cr.commit()
    """
