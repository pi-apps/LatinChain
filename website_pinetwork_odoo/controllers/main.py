# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request, Response
import json

import time

import odoo

import requests

from werkzeug.utils import redirect

import logging
_logger = logging.getLogger(__name__)

from odoo.addons.website.controllers.main import Website

from odoo.addons.portal.controllers.portal import CustomerPortal

from random import choice

import random

from datetime import datetime, timedelta

import os

"""
class Website(Website):
    @http.route('/', type='http', auth="public", website=True)
    def index(self, **kw):
        super(Website, self).index(**kw)
        return http.request.render('website_pinetwork_odoo.mainpage', {})
"""

"""
winner_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_chess', '>=', 20), ('points_sudoku', '>', 18), ('points_snake', '>', 20), ('points', '>', 200)]
winner_chess_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_chess', '>=', 20)]
winner_sudoku_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_sudoku', '>', 18)]
winner_snake_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_snake', '>', 20)]
leaders_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30))]
"""

class CustomerPortalInherit(CustomerPortal):
    @http.route('/my/security', type='http', auth='user', website=True, methods=['GET', 'POST'], csrf=False)
    def security(self, **post):
        return request.redirect('/')

class PiNetworkBaseController(http.Controller):
    
    def leaders_domain_def(self):
        winner_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_chess', '>=', 20), ('points_sudoku', '>', 18), ('points_snake', '>', 20), ('points', '>', 200)]
        winner_chess_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_chess', '>=', 20)]
        winner_sudoku_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_sudoku', '>', 18)]
        winner_snake_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('points_snake', '>', 20)]
        leaders_domain = [('unblocked_datetime', '>=', datetime.now() - timedelta(days=30))]
        
        return {'winner_domain': winner_domain, 'winner_chess_domain': winner_chess_domain, 'winner_sudoku_domain': winner_sudoku_domain, 'winner_snake_domain': winner_snake_domain, 'leaders_domain': leaders_domain}
    
    @http.route('/mainpage', type='http', auth="public", website=True, csrf=False)
    def index(self, **kw):
                    
        return http.request.render('website_pinetwork_odoo.mainpage')
    
    @http.route('/example', type='http', auth="public", website=True, csrf=False)
    def example(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_first_app')])
        
        if len(admin_app_list) == 0:
            sandbox = False
        else:
            sandbox = admin_app_list[0].sandbox
        
        return http.request.render('website_pinetwork_odoo.example', {'sandbox': sandbox})
        
    @http.route('/api-docs/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def api_external_docs(self, **kw):
        return http.request.redirect('https://github.com/pi-apps/LatinChain/tree/main/docs')
    
    @http.route('/mainnet/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def latinchain_mainnet(self, **kw):
        return http.request.redirect('https://latinchain.pinet.com')
    
    @http.route('/testnet/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def latinchain_testnet(self, **kw):
        return http.request.redirect('https://latinchaintest9869.pinet.com')
        
    @http.route('/odoo-tech-course/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def odoo_technical_course(self, **kw):
        return http.request.redirect('https://www.udemy.com/course/odoo-14-technical-training-en-espanol/?referralCode=1229BD4F262C09869DB2')
    
    @http.route('/piapps-course/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def piapps_course(self, **kw):
        return http.request.redirect('https://www.udemy.com/course/learn-how-to-develop-a-pi-app-on-the-pi-network/?referralCode=ADD5DE357007E267B364')
        
    @http.route('/english-course/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def english_course(self, **kw):
        return http.request.redirect('https://www.udemy.com/course/aprende-ingles-practico-hoy-mismo-con-ia/?referralCode=D67C6EEEA0A577E2C2CF')
    
    @http.route('/brand-course/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def brand_course(self, **kw):
        return http.request.redirect('https://www.udemy.com/course/como-crear-tu-marca-personal-by-cesar-opensource-expert/?referralCode=755FB82D3B05FA01F3D5')
        
    @http.route('/odoo-tech-book/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def odoo_technical_book(self, **kw):
        return http.request.redirect('https://www.amazon.com/dp/B0DJVY51LS')
    
    @http.route('/piapps-book/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def piapps_book(self, **kw):
        return http.request.redirect('https://www.amazon.com/dp/B0DK3NJ23V')
    
    @http.route('/english-book/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def english_book(self, **kw):
        return http.request.redirect('https://www.amazon.com/dp/B0F7792QFW')
    
    @http.route('/brand-book/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def brand_book(self, **kw):
        return http.request.redirect('https://www.amazon.com/dp/B0F79N2ZWQ')
        
    @http.route('/collection-2025-book/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def collection_2025_book(self, **kw):
        return http.request.redirect('https://www.amazon.com/dp/B0FPPVRGWG')
        
    @http.route('/books-collection/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def books_collection(self, **kw):
        return http.request.redirect('https://www.amazon.com/dp/B0F771VKRF')
    
    @http.route('/terms/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def latinchain_terms(self, **kw):
        return http.request.redirect('/blog/latinchain-blog-1/terms-of-service-6')
        
    @http.route('/privacy/', type='http', auth="public", website=True, methods=['GET'], csrf=False)
    def latinchain_privacy(self, **kw):
        return http.request.redirect('/blog/latinchain-blog-1/privacy-policy-5')
    
    @http.route('/api/get-external-winners', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def get_external_winners(self, **kw):

        """
        headers = {'Content-Type': 'application/json'}
        return Response(json.dumps({'result': True, 'pi_user_code': pi_users_list[0].pi_user_code,
                            'points': pi_users_list[0].points, 'points_chess': pi_users_list[0].points_chess, 
                            'points_sudoku': pi_users_list[0].points_sudoku,
                            'points_snake': pi_users_list[0].points_snake, 'points_datetime': str(pi_users_list[0].points_datetime) + " UTC",
                            'unblocked': pi_users_list[0].unblocked}), headers=headers)
        """
        
        app = request.env["admin.apps"].sudo().search([('app', 'in', ['auth_platform'])])
        
        if len(app) == 0:
            headers = {'Content-Type': 'application/json'}
            return Response(json.dumps({'result': False}), headers=headers)
        
        pi_winner_list = []
        for pi_user in app.pi_users_winners_ids:
            is_winner = False
            if pi_user.id in app.pi_users_winners_ids.ids:
                is_winner = True
            
            if not pi_user.unblocked_datetime:
                unblocked_datetime = ""
            else:
                unblocked_datetime = str(pi_user.unblocked_datetime) + " UTC"
            pi_winner_list.append({'pi_user_code': pi_user.pi_user_code,
                    'points': pi_user.points, 'points_chess': pi_user.points_chess, 
                    'points_sudoku': pi_user.points_sudoku,
                    'points_snake': pi_user.points_snake, 
                    'points_chess_max': pi_user.points_chess_last, 
                    'points_sudoku_max': pi_user.points_sudoku_last,
                    'points_snake_max': pi_user.points_snake_last,
                    'points_chess_wins': pi_user.points_chess_wins, 
                    'points_sudoku_wins': pi_user.points_sudoku_wins,
                    'points_snake_wins': pi_user.points_snake_wins, 
                    'points_latin': pi_user.points_latin, 'points_datetime': str(pi_user.points_datetime) + " UTC",
                    'unblocked': pi_user.unblocked, 'unblocked_datetime': str(unblocked_datetime), 
                    'days_available': pi_user.days_available,
                    'is_winner': is_winner})
        
        headers = {'Content-Type': 'application/json'}
        return Response(json.dumps({'result': True, 'pi_winner_list': pi_winner_list}), headers=headers)
    
    @http.route('/api/get-external-user', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def get_external_user(self, **kw):
        
        # Enable when Mainnet
        if 'HTTP_REFERER' in http.request.httprequest.environ and 'HTTP_HOST' in http.request.httprequest.environ:
            if http.request.httprequest.environ['HTTP_HOST'] == "latin-chain.com" and "https://radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                result = requests.post("https://test.latin-chain.com/api/get-external-user", kw)
                headers = {'Content-Type': 'application/json'}
                return Response(json.dumps(result.json()), headers=headers)
            elif http.request.httprequest.environ['HTTP_HOST'] == "test.latin-chain.com" and "https://mainnet.radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                result = requests.post("https://latin-chain.com/api/get-external-user", kw)
                headers = {'Content-Type': 'application/json'}
                return Response(json.dumps(result.json()), headers=headers)
        
        if 'pi_user_code' not in kw:
            headers = {'Content-Type': 'application/json'}
            return Response(json.dumps({'result': False}), headers=headers)
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            headers = {'Content-Type': 'application/json'}
            return Response(json.dumps({'result': False}), headers=headers)

        """
        headers = {'Content-Type': 'application/json'}
        return Response(json.dumps({'result': True, 'pi_user_code': pi_users_list[0].pi_user_code,
                            'points': pi_users_list[0].points, 'points_chess': pi_users_list[0].points_chess, 
                            'points_sudoku': pi_users_list[0].points_sudoku,
                            'points_snake': pi_users_list[0].points_snake, 'points_datetime': str(pi_users_list[0].points_datetime) + " UTC",
                            'unblocked': pi_users_list[0].unblocked}), headers=headers)
        """
        
        app = request.env["admin.apps"].sudo().search([('app', 'in', ['auth_platform'])])
        
        if len(app) == 0:
            headers = {'Content-Type': 'application/json'}
            return Response(json.dumps({'result': False}), headers=headers)
        
        is_winner = False
        if pi_users_list[0].id in app.pi_users_winners_ids.ids:
            is_winner = True
        
        headers = {'Content-Type': 'application/json'}
        
        if not pi_users_list[0].unblocked_datetime:
            unblocked_datetime = ""
        else:
            unblocked_datetime = str(pi_users_list[0].unblocked_datetime) + " UTC"
        return Response(json.dumps({'result': True, 'pi_user_code': pi_users_list[0].pi_user_code,
                            'points': pi_users_list[0].points, 'points_chess': pi_users_list[0].points_chess, 
                            'points_sudoku': pi_users_list[0].points_sudoku,
                            'points_snake': pi_users_list[0].points_snake,
                            'points_chess_max': pi_users_list[0].points_chess_last, 
                            'points_sudoku_max': pi_users_list[0].points_sudoku_last,
                            'points_snake_max': pi_users_list[0].points_snake_last,
                            'points_chess_wins': pi_users_list[0].points_chess_wins, 
                            'points_sudoku_wins': pi_users_list[0].points_sudoku_wins,
                            'points_snake_wins': pi_users_list[0].points_snake_wins, 
                            'points_latin': pi_users_list[0].points_latin, 'points_datetime': str(pi_users_list[0].points_datetime) + " UTC",
                            'unblocked': pi_users_list[0].unblocked, 'unblocked_datetime': str(unblocked_datetime), 
                            'days_available': pi_users_list[0].days_available,
                            'is_winner': is_winner}), headers=headers)
    
    @http.route('/get-user', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def get_user(self, **kw):
        
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
            
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        
        """
        if pi_users_list[0].pi_user_id != kw['pi_user_id']:
            _logger.info("not equeals pi_user_id")
            return json.dumps({'result': False})
        """
        
        apps_list = request.env["admin.apps"].sudo().search([('app', '=', "auth_platform")])
        
        if len(apps_list) == 0:
            return json.dumps({'result': False})
        
        passkey = ''.join([choice('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%^*(-_=+)') for i in range(20)])
        
        pi_users_list[0].sudo().write({'passkey': passkey})
        
        im_winner = False
        if pi_users_list[0].id in apps_list.pi_users_winners_ids.ids:
            im_winner = True
        
        if not pi_users_list[0].unblocked_datetime:
            unblocked_datetime = ""
        else:
            unblocked_datetime = str(pi_users_list[0].unblocked_datetime) + " UTC"
        
        if 'app_client' in kw:
            apps_list_temp = request.env["admin.apps"].sudo().search([('app', '=', kw['app_client'])])
            
            if len(apps_list_temp) > 0:
                apps_list = apps_list_temp
            
        pi_ad_seconds = apps_list[0].pi_ad_seconds
        pi_ad_max = apps_list[0].pi_ad_max
        pi_amount = apps_list[0].amount
        pi_amount_latin_pay = apps_list[0].amount_latin_pay
        
        """
        if pi_users_list[0].unblocked:
            pi_ad_seconds = pi_ad_seconds*8
            pi_ad_max = (pi_ad_max+1)*8
        """
        
        if not pi_users_list[0].pi_ad_datetime:
            show_pi_ad = True
            show_pi_ad_time = str(timedelta(seconds=pi_ad_seconds))
            #round(((pi_ad_seconds/3600)*60)/100,4)
        elif pi_users_list[0].pi_ad_datetime <= (datetime.now() - timedelta(seconds=pi_ad_seconds)):
            show_pi_ad = True
            show_pi_ad_time = str(timedelta(seconds=pi_ad_seconds))
            #round(((pi_ad_seconds/3600)*60)/100,4)
        else:
            show_pi_ad = False
            show_pi_ad_time = str(timedelta(seconds=pi_ad_seconds))
            #round(((pi_ad_seconds/3600)*60)/100,4)
            
        if not pi_users_list[0].pi_ad_datetime:
            if pi_users_list[0].pi_ad_counter >= pi_ad_max:
                pi_ad_new = False
            else:
                pi_ad_new = True
        elif pi_users_list[0].pi_ad_datetime >= (datetime.now() - timedelta(seconds=pi_ad_seconds)) and \
            pi_users_list[0].pi_ad_datetime <= datetime.now():
            if pi_users_list[0].pi_ad_counter >= pi_ad_max:
                pi_ad_new = False
            else:
                pi_ad_new = True
        else:
            pi_ad_new = True
        
        if pi_users_list[0].unblocked:
            if not pi_users_list[0].pi_ad_automatic:
                show_pi_ad = False
                
            pi_ad_automatic = False
            if not pi_users_list[0].pi_ad_automatic:
                pi_ad_automatic = False
            else:
                pi_ad_automatic = True
        else:
            pi_ad_automatic = True
        
        result_found = request.env["pi.transactions"].sudo().search([('action', '!=', 'complete'), ('action_type', '=', 'receive'), 
                                                                ('pi_user_id', '=', pi_users_list[0].pi_user_id)]).check_transactions_one_user()
        
        if pi_users_list[0].pi_user_referrer_id:
            referrer_code = pi_users_list[0].pi_user_referrer_id.pi_user_code
        else:
            referrer_code = ""
        
        #if apps_list[0].mainnet in ['Testnet OFF']:
        #    apps_list[0].sudo()._pay_onincomplete_a2u(pi_users_list[0])
            
        request.env.cr.commit()
        
        return json.dumps({'result': True, 'pi_user_id': pi_users_list[0].pi_user_id, 'pi_user_code': pi_users_list[0].pi_user_code,
                            'points': pi_users_list[0].points, 
                            'points_chess_wins': pi_users_list[0].points_chess_wins, 
                            'points_sudoku_wins': pi_users_list[0].points_sudoku_wins,
                            'points_snake_wins': pi_users_list[0].points_snake_wins, 
                            'points_chess_last': pi_users_list[0].points_chess_last, 
                            'points_sudoku_last': pi_users_list[0].points_sudoku_last,
                            'points_snake_last': pi_users_list[0].points_snake_last, 
                            'points_chess': pi_users_list[0].points_chess, 
                            'points_sudoku': pi_users_list[0].points_sudoku,
                            'points_snake': pi_users_list[0].points_snake, 
                            'points_latin': pi_users_list[0].points_latin, 'points_datetime': str(pi_users_list[0].points_datetime) + " UTC",
                            'unblocked': pi_users_list[0].unblocked,
                            'unblocked_datetime': str(unblocked_datetime),
                            'days_available': pi_users_list[0].days_available,
                            'amount': pi_amount,
                            'amount_latin_pay': pi_amount_latin_pay,
                            'passkey': passkey,
                            'im_winner': im_winner, 'pi_wallet_address': pi_users_list[0].pi_wallet_address,
                            'streaming_url': pi_users_list[0].streaming_url,
                            'referrer_code': referrer_code,
                            'complete_found': result_found['complete_found'],
                            'show_pi_ad': show_pi_ad,
                            'show_pi_ad_time': show_pi_ad_time,
                            'pi_ad_new': pi_ad_new,
                            'pi_ad_max': pi_ad_max,
                            'pi_ad_automatic': pi_ad_automatic,
                            'avatar_user': pi_users_list[0].avatar_user,
                            'avatar_user_url': pi_users_list[0].avatar_user_url,
                            'x2_game': pi_users_list[0].x2_game
                            })
    
    @http.route('/set-pi-ad-datetime', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def set_pi_ad_datetime(self, **kw):
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        pi_ad_new = False
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            
            values = {'pi_ad_datetime': datetime.now()}
            
            apps_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
            
            pi_ad_seconds = apps_list[0].pi_ad_seconds
            pi_ad_max = apps_list[0].pi_ad_max
            
            """
            if pi_users_list[0].unblocked:
                pi_ad_seconds = pi_ad_seconds*8
                pi_ad_max = (pi_ad_max+1)*8
            """
            
            if not pi_users_list[0].pi_ad_datetime:
                values.update({'pi_ad_datetime': datetime.now()})
                if pi_users_list[0].pi_ad_counter+1 >= pi_ad_max:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = False
                else:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = True
            elif pi_users_list[0].pi_ad_datetime >= (datetime.now() - timedelta(seconds=pi_ad_seconds)) and \
                pi_users_list[0].pi_ad_datetime <= datetime.now():
                if pi_users_list[0].pi_ad_counter+1 >= pi_ad_max:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = False
                else:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = True
            else:
                values.update({'pi_ad_datetime': datetime.now()})
                values.update({'pi_ad_counter': 0})
                pi_ad_new = True
        
        #Uncomment in case of you want to save wallet address
        pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True, 'pi_ad_new': pi_ad_new})
        
    @http.route('/set-pi-wallet', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def set_pi_wallet(self, **kw):
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
            
            if 'pi_wallet_address' not in kw:
                _logger.info("pi_wallet_address not present")
                return json.dumps({'result': False})
            values = {'pi_wallet_address': kw['pi_wallet_address']}
        
        #Uncomment in case of you want to save wallet address
        #pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True})
    
    @http.route('/set-streaming-url', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def set_streaming_url(self, **kw):
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
            
            if pi_users_list[0].unblocked == False:
                return json.dumps({'result': False})
            
            if 'streaming_url' not in kw:
                _logger.info("streaming_url not present")
                return json.dumps({'result': False})
            values = {'streaming_url': kw['streaming_url']}
        
        #Uncomment in case of you want to save wallet address
        pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True})
    
    @http.route('/set-referrer-code', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def set_referrer_code(self, **kw):
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
            
            if pi_users_list[0].unblocked == False:
                return json.dumps({'result': False})
            
            if 'referrer_code' not in kw:
                _logger.info("referrer_code not present")
                return json.dumps({'result': False})
                
            if kw['referrer_code'] == kw['pi_user_code']:
                return json.dumps({'result': False})
                
            if kw['referrer_code'] == "":
                values = {'pi_user_referrer_id': False}
            else:
                pi_users_referrer_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['referrer_code'])])
                
                if len(pi_users_referrer_list) == 0:
                    return json.dumps({'result': False})
                    
                values = {'pi_user_referrer_id': pi_users_referrer_list[0].id}
        
        #Uncomment in case of you want to save wallet address
        pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True})
        
    @http.route('/set-latin-points', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def set_latin_points(self, **kw):
        
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', 'in', ['auth_platform'])])
        
        if len(admin_app_list) == 0:
            return json.dumps({'result': False})
        
        if 'adId' not in kw:
            _logger.info("adId not present")
            return json.dumps({'result': False})
            
        url_result = 'https://api.minepi.com/v2/ads_network/status/'+kw['adId']
        
        re = requests.get(url_result, headers={'Authorization': "Key " + admin_app_list[0].admin_key})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['identifier'] == kw['adId'] and result_dict['mediator_ack_status'] == "granted"):
                _logger.info("Not granted")
                return json.dumps({'result': False})
        except:
            _logger.info("Ad authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        pi_ad_new = False
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
            
            values = {'points_latin': pi_users_list[0].points_latin + admin_app_list[0].points_latin_amount}
            
            values.update({'x2_game': True})
            
            apps_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
            
            pi_ad_seconds = apps_list[0].pi_ad_seconds
            pi_ad_max = apps_list[0].pi_ad_max
            
            """
            if pi_users_list[0].unblocked:
                pi_ad_seconds = pi_ad_seconds*8
                pi_ad_max = (pi_ad_max+1)*8
            """
            
            if not pi_users_list[0].pi_ad_datetime:
                values.update({'pi_ad_datetime': datetime.now()})
                if pi_users_list[0].pi_ad_counter+1 >= pi_ad_max:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = False
                else:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = True
            elif pi_users_list[0].pi_ad_datetime >= (datetime.now() - timedelta(seconds=pi_ad_seconds)) and \
                pi_users_list[0].pi_ad_datetime <= datetime.now():
                if pi_users_list[0].pi_ad_counter+1 >= pi_ad_max:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = False
                else:
                    values.update({'pi_ad_counter': pi_users_list[0].pi_ad_counter+1})
                    pi_ad_new = True
            else:
                values.update({'pi_ad_datetime': datetime.now()})
                values.update({'pi_ad_counter': 0})
                pi_ad_new = True
        
        pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True, 'points_latin': admin_app_list[0].points_latin_amount, 'pi_ad_new': pi_ad_new, 'x2_game': pi_users_list[0].x2_game})
    
    @http.route('/pi-ad-automatic', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def pi_ad_automatic(self, **kw):
        
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', 'in', ['auth_platform'])])
        
        if len(admin_app_list) == 0:
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
            
            if not pi_users_list[0].unblocked:
                return json.dumps({'result': False})
            
            if 'pi_ad_automatic' not in kw:
                _logger.info("pi_ad_automatic not present")
                return json.dumps({'result': False})
            
            values = {'pi_ad_automatic': json.loads(kw['pi_ad_automatic'].lower())}
        
        pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True, 'pi_ad_automatic': pi_users_list[0].pi_ad_automatic})
    
    @http.route('/avatar-user', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def avatar_user(self, **kw):
        
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', 'in', ['auth_platform'])])
        
        if len(admin_app_list) == 0:
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
            
            if not pi_users_list[0].unblocked:
                return json.dumps({'result': False})
            
            if 'avatar_user' not in kw:
                _logger.info("avatar_user not present")
                return json.dumps({'result': False})
            
            values = {'avatar_user': kw['avatar_user']}
        
        pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True, 'avatar_user': pi_users_list[0].avatar_user, 'avatar_user_url': pi_users_list[0].avatar_user_url})
    
    @http.route('/validate-memo', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def validate_memo(self, **kw):
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        if len(pi_users_list) == 0:
            return json.dumps({'result': False})
        else:
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
            
            if 'memo_id' not in kw:
                _logger.info("memo_id not present")
                return json.dumps({'result': False})
            #values = {'streaming_url': kw['streaming_url']}
            
            pi_transaction = request.env["pi.transactions"].sudo().search([('action', '=', 'complete'), ('action_type', '=', 'receive'), 
                                                        ('payment_id', '=', kw['memo_id']), ('pi_user_id', '=', pi_users_list[0].pi_user_id)])
            if len(pi_transaction) > 0:
                return json.dumps({'result': False})
                
            pi_transaction = request.env["pi.transactions"].sudo().search([('action', '!=', 'complete'), ('action_type', '=', 'receive'), 
                                                        ('payment_id', '=', kw['memo_id']), ('pi_user_id', '=', pi_users_list[0].pi_user_id)])
            
            if len(pi_transaction) > 0:
                pi_transaction.check_transactions_one_user()
                pi_transaction = request.env["pi.transactions"].sudo().search([('action', '=', 'complete'), ('action_type', '=', 'receive'), 
                                                        ('payment_id', '=', kw['memo_id']), ('pi_user_id', '=', pi_users_list[0].pi_user_id)])
                if len(pi_transaction) > 0:
                    return json.dumps({'result': True})
                return json.dumps({'result': False})
                
            admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_example')])
                
            url = 'https://api.minepi.com/v2/payments/' + kw['memo_id']
            
            re = requests.get(url,headers={'Authorization': "Key " + admin_app_list[0].admin_key})
            
            try:
                result = re.json()
                
                result_dict = json.loads(str(json.dumps(result)))
                
                if "direction" in result_dict and result_dict["direction"] == "user_to_app":
                    if "identifier" in result_dict and result_dict["identifier"] == kw['memo_id'] and \
                        "user_uid" in result_dict and result_dict["user_uid"] == pi_users_list[0].pi_user_id:
                            data_dict = {
                                'payment_id': kw['memo_id'],
                                'app_id': admin_app_list[0].id,
                                'pi_user_id': result_dict["user_uid"],
                                'action_type': 'receive'
                            }
                            request.env["pi.transactions"].sudo().create(data_dict)
                            request.env["pi.transactions"].sudo().search([('payment_id', '=', kw['memo_id'])]).check_transactions_one_user()
                            
                            pi_transaction = request.env["pi.transactions"].sudo().search([('action', '=', 'complete'), ('action_type', '=', 'receive'), 
                                                            ('payment_id', '=', kw['memo_id']), ('pi_user_id', '=', pi_users_list[0].pi_user_id)])
                            
                            if len(pi_transaction) > 0:
                                return json.dumps({'result': True})
                        
            except Exception as e:
                return json.dumps({"result": False, "error": "SERVER MESSAGE: " + str(re)})
        
        return json.dumps({'result': False})
        
    @http.route('/pi-api', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def pi_api(self, **kw):
        admin_apps_block_list = request.env["admin.apps"].sudo().search([('app', '=', "auth_platform"), ('block_points', '=', True)])
        
        if len(admin_apps_block_list) > 0:
            return json.dumps({'result': False})
        
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
                
            pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
            if len(pi_users_list) == 0:
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
            
            """
            if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                _logger.info("not equeals pi_user_id")
                return json.dumps({'result': False})
            """
                
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        return request.env["admin.apps"].pi_api(kw)
        
    @http.route('/pi-points', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def pi_points(self, **kw):
        """
        admin_apps_block_list = request.env["admin.apps"].sudo().search([('app', '=', "auth_platform"), ('block_points', '=', True)])
        
        if len(admin_apps_block_list) > 0 and int(kw['points']) != 0:
            return json.dumps({'result': False})
        """
        
        if 'accessToken' not in kw:
            _logger.info("accessToken not present")
            return json.dumps({'result': False})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        #_logger.info(kw['accessToken'])
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'result': False})
        except:
            _logger.info("Authorization error")
            return json.dumps({'result': False})
        
        pi_users_list = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw['pi_user_code'])])
        
        points = 0            
        exchanged_latin = False
        previous_x2_game = False
        
        if len(pi_users_list) == 0:
            request.env["pi.users"].sudo().create({'name': kw['pi_user_code'],
                                                    'pi_user_id': kw['pi_user_id'],
                                                    'pi_user_code': kw['pi_user_code'],
                                                    'points': 0,
                                                    'points_chess': 0,
                                                    'points_sudoku': 0,
                                                    'points_snake': 0,
                                                    'points_latin': 0,
                                                    'unblocked_datetime': False,
                                                    'user_agent': request.httprequest.environ.get('HTTP_USER_AGENT', ''),
                                                    'last_connection': datetime.now(),
                                                })
        else:
            
            """
            if pi_users_list[0].pi_user_id != '':
                if pi_users_list[0].pi_user_id != kw['pi_user_id']:
                    _logger.info("not equeals pi_user_id")
                    return json.dumps({'result': False})
            """
            
            if 'points' not in kw:
                _logger.info("points not present")
                return json.dumps({'result': False})
            
            """
            if int(kw['points']) > 0:
                if 'passkey' not in kw:
                    _logger.info("PASSKEY NOT PRESENT")
                    return json.dumps({'result': False})
                    
                if kw['passkey'] != pi_users_list[0].passkey:
                    _logger.info("PASSKEY DOESN'T MATCH: " + str(kw['passkey']))
                    return json.dumps({'result': False})
            """
            
            values = {'name': kw['pi_user_code'],
                                'pi_user_id': kw['pi_user_id'],
                                'pi_user_code': kw['pi_user_code'],
                                'user_agent': request.httprequest.environ.get('HTTP_USER_AGENT', ''),
                                'last_connection': datetime.now(),
                            }
            
            points = float(kw['points'])
            
            exchanged_latin = False
            previous_x2_game = False
            
            if pi_users_list[0].unblocked:
                #if int(kw['points']) > 0:
                #    pi_users_winnners_count = request.env["pi.users"].sudo().search_count(winner_domain)
                #    
                #    if pi_users_winnners_count >= 10:
                #        return json.dumps({'result': False})
                
                #if pi_users_list[0].pi_user_id != '':
                if 'app_client' in kw:
                    
                    if pi_users_list[0].x2_game:
                        points = points*2
                    
                    if kw['app_client'] == "auth_platform":
                        if points > 0:
                            values.update({'points_chess': pi_users_list[0].points_chess + points})
                            values.update({'points_chess_wins': pi_users_list[0].points_chess_wins + 1 })
                            if points > pi_users_list[0].points_chess_last:
                                values.update({'points_chess_last': points})
                            values.update({'x2_game': False})
                            
                            if 'action' in kw:
                                if kw['action'] == "exchange":
                                    if 'latin_points' in kw:
                                        if pi_users_list[0].points_latin - float(kw['latin_points']) < 0:
                                            return json.dumps({'result': True, 
                                                'exchanged_latin': False, 
                                                'reason': 'not_enough_latin_points'})
                                        else:
                                            values.update({'points_latin': pi_users_list[0].points_latin - float(kw['latin_points'])})
                                            exchanged_latin = True
                    elif kw['app_client'] == "auth_pidoku":
                        if points > 0:
                            values.update({'points_sudoku': pi_users_list[0].points_sudoku + points})
                            values.update({'points_sudoku_wins': pi_users_list[0].points_sudoku_wins + 1 })
                            if points > pi_users_list[0].points_sudoku_last:
                                values.update({'points_sudoku_last': points})
                            values.update({'x2_game': False})
                            
                            if 'action' in kw:
                                if kw['action'] == "exchange":
                                    if 'latin_points' in kw:
                                        if pi_users_list[0].points_latin - float(kw['latin_points']) < 0:
                                            return json.dumps({'result': True, 
                                                'exchanged_latin': False, 
                                                'reason': 'not_enough_latin_points'})
                                        else:
                                            values.update({'points_latin': pi_users_list[0].points_latin - float(kw['latin_points'])})
                                            exchanged_latin = True
                    elif kw['app_client'] == "auth_snake":
                        if points > 0:
                            values.update({'points_snake': pi_users_list[0].points_snake + points})
                            values.update({'points_snake_wins': pi_users_list[0].points_snake_wins + 1 })
                            if points > pi_users_list[0].points_snake_last:
                                values.update({'points_snake_last': points})
                            if points == 4 and pi_users_list[0].x2_game:
                                values.update({'x2_game': False})
                            
                            if 'action' in kw:
                                if kw['action'] == "exchange":
                                    if 'latin_points' in kw:
                                        if pi_users_list[0].points_latin - float(kw['latin_points']) < 0:
                                            return json.dumps({'result': True, 
                                                'exchanged_latin': False, 
                                                'reason': 'not_enough_latin_points'})
                                        else:
                                            values.update({'points_latin': pi_users_list[0].points_latin - float(kw['latin_points']), 'x2_game': False})
                                            exchanged_latin = True
            elif not pi_users_list[0].unblocked and int(points) > 0:
                return json.dumps({'result': False})
            
            previous_x2_game = pi_users_list[0].x2_game
            
            pi_users_list[0].sudo().write(values)
        
        request.env.cr.commit()
        
        return json.dumps({'result': True, 'x2_game': pi_users_list[0].x2_game, 'previous_x2_game': previous_x2_game, 'points': points, 'exchanged_latin': exchanged_latin})
    
    @http.route('/get-general-ranking/<string:pi_user_code>', type='http', auth="public", website=True, csrf=False)
    def get_general_ranking_user(self, pi_user_code, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']

        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            general_ranking = []
            total_users_count = 0
            total_users_verified_count = 0
        else:
            general_ranking = admin_app_list[0].pi_users_general_ranking_ids
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = general_ranking
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.general_ranking', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_user': pi_user})
        
    @http.route('/get-general-ranking/', type='http', auth="public", website=True, csrf=False)
    def get_general_ranking(self, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            general_ranking = []
            total_users_count = 0
            total_users_verified_count = 0
        else:
            general_ranking = admin_app_list[0].pi_users_general_ranking_ids
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = general_ranking
        
        return http.request.render('website_pinetwork_odoo.general_ranking', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list})
        
    @http.route('/get-points/<string:pi_user_code>', type='http', auth="public", website=True, csrf=False)
    def get_points_user(self, pi_user_code, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']

        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = request.env["pi.users"].sudo().search(leaders_domain, limit=50, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.list_points', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_user': pi_user})
        
    @http.route('/get-points/', type='http', auth="public", website=True, csrf=False)
    def get_points(self, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = request.env["pi.users"].sudo().search(leaders_domain, limit=50, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        
        return http.request.render('website_pinetwork_odoo.list_points', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list})
    
    """
    @http.route('/get-top10-zone/<string:pi_user_code>', type='http', auth="public", website=True)
    def get_top10_zone_user(self, pi_user_code, **kw):
        pi_users_verified_count = request.env["pi.users"].sudo().search_count(leaders_domain)
        
        pi_users_count = request.env["pi.users"].sudo().search_count([])
        
        pi_users_list = request.env["pi.users"].sudo().search(winner_domain, limit=10, order="points desc,unblocked desc,points_datetime asc")
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.list_winners', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_user': pi_user})
    """
        
    @http.route('/get-top10-zone/', type='http', auth="public", website=True, csrf=False)
    def get_top10_zone(self, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = request.env["pi.users"].sudo().search(winner_domain, limit=10, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        
        pi_users_list_chess = request.env["pi.users"].sudo().search(winner_chess_domain, limit=10, order="points_chess desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        pi_users_list_snake = request.env["pi.users"].sudo().search(winner_snake_domain, limit=10, order="points_snake desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        pi_users_list_sudoku = request.env["pi.users"].sudo().search(winner_sudoku_domain, limit=10, order="points_sudoku desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")

        return http.request.render('website_pinetwork_odoo.list_winners', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_users_list_chess': pi_users_list_chess, 'pi_users_list_snake': pi_users_list_snake, 'pi_users_list_sudoku': pi_users_list_sudoku})
    
    @http.route('/get-top10-zone/<string:pi_user_code>', type='http', auth="public", website=True, csrf=False)
    def get_top10_zone_user(self, pi_user_code, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = request.env["pi.users"].sudo().search(winner_domain, limit=10, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        
        pi_users_list_chess = request.env["pi.users"].sudo().search(winner_chess_domain, limit=10, order="points_chess desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        pi_users_list_snake = request.env["pi.users"].sudo().search(winner_snake_domain, limit=10, order="points_snake desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        pi_users_list_sudoku = request.env["pi.users"].sudo().search(winner_sudoku_domain, limit=10, order="points_sudoku desc,unblocked_datetime desc,points_datetime asc,points desc,id asc")
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.list_winners', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_user': pi_user, 'pi_users_list_chess': pi_users_list_chess, 'pi_users_list_snake': pi_users_list_snake, 'pi_users_list_sudoku': pi_users_list_sudoku})
        
    @http.route('/get-winners-zone/', type='http', auth="public", website=True, csrf=False)
    def get_winners_zone(self, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            user_winners = []
            pi_users_winners_count = 0
            pi_users_winners_datetime = ""
            pi_users_winners_to_pay = 0
            total_users_count = 0
            total_users_verified_count = 0
        else:
            user_winners = admin_app_list[0].pi_users_winners_ids
            pi_users_winners_count = admin_app_list[0].pi_users_winners_count
            pi_users_winners_datetime = admin_app_list[0].pi_users_winners_datetime
            pi_users_winners_to_pay = admin_app_list[0].pi_users_winners_to_pay
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = user_winners
        
        return http.request.render('website_pinetwork_odoo.list_winners_zone', {'pi_users_winners_count': pi_users_winners_count, 'pi_users_winners_to_pay': pi_users_winners_to_pay, 'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_users_winners_datetime': pi_users_winners_datetime})

    @http.route('/get-winners-zone/<string:pi_user_code>', type='http', auth="public", website=True, csrf=False)
    def get_winners_zone_user(self, pi_user_code, **kw):
        domains_def = self.leaders_domain_def()
        leaders_domain = domains_def['leaders_domain']
        winner_domain = domains_def['winner_domain']
        winner_chess_domain = domains_def['winner_chess_domain']
        winner_sudoku_domain = domains_def['winner_sudoku_domain']
        winner_snake_domain = domains_def['winner_snake_domain']
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            user_winners = []
            pi_users_winners_count = 0
            pi_users_winners_datetime = ""
            pi_users_winners_to_pay = 0
            total_users_count = 0
            total_users_verified_count = 0
        else:
            user_winners = admin_app_list[0].pi_users_winners_ids
            pi_users_winners_count = admin_app_list[0].pi_users_winners_count
            pi_users_winners_datetime = admin_app_list[0].pi_users_winners_datetime
            pi_users_winners_to_pay = admin_app_list[0].pi_users_winners_to_pay
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_users_list = user_winners
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.list_winners_zone', {'pi_users_winners_count': pi_users_winners_count, 'pi_users_winners_to_pay': pi_users_winners_to_pay, 'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_users_winners_datetime': pi_users_winners_datetime, 'pi_user': pi_user})
    
    @http.route('/get-streamers-zone/', type='http', auth="public", website=True, csrf=False)
    def get_streamers_zone(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
            top_50_streamers = []
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
            top_50_streamers = admin_app_list[0].top_50_streamers_ids
        
        pi_users_list = top_50_streamers
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        return http.request.render('website_pinetwork_odoo.list_streamer_zone', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list})

    @http.route('/get-streamers-zone/<string:pi_user_code>', type='http', auth="public", website=True, csrf=False)
    def get_streamers_zone_user(self, pi_user_code, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
            top_50_streamers = []
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
            top_50_streamers = admin_app_list[0].top_50_streamers_ids
        
        pi_users_list = top_50_streamers
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.list_streamer_zone', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_user': pi_user})
        
    @http.route('/get-credits/', type='http', auth="public", website=True, csrf=False)
    def get_credits(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            mainnet = ""
        else:
            mainnet = admin_app_list[0].mainnet
            
        if mainnet in ['Mainnet OFF', 'Mainnet ON']:
            return False
        
        return http.request.render('website_pinetwork_odoo.list_credits')

    @http.route('/get-credits-data/', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def get_credits_data(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            mainnet = ""
        else:
            mainnet = admin_app_list[0].mainnet
            
        if mainnet in ['Mainnet OFF', 'Mainnet ON']:
            return False
        
        #_logger.info(str(kw))
        
        draw = kw['draw'];
        row = kw['start'];
        rowperpage = kw['length'];
        #columnIndex = kw["order[0][column]"]
        columnName = kw["columns[0][data]"]
        #columnSortOrder = kw["order[0][dir]"]
        searchValue = kw["search[value]"]
        
        #if searchValue.lower() == "is verified":
        #    domain_filter = [('donator', '=', True), ('unblocked_datetime', '>=', datetime.now() - timedelta(days=30))]
        #elif searchValue.lower() == "not verified":
        #    domain_filter = [('donator', '=', True), ('unblocked_datetime', '<', datetime.now() - timedelta(days=30))]
        #else:
        
        domain_filter = [('donator', '=', True), ('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), '|', ('pi_user_code', 'ilike', '%' + searchValue + '%'), ('paid_in_all_donations', 'ilike', '%' + searchValue + '%')]
        
        pi_users_count = request.env["pi.users"].sudo().search_count([('donator', '=', True), ('unblocked_datetime', '>=', datetime.now() - timedelta(days=30))])
        
        pi_users_count_filter = request.env["pi.users"].sudo().search_count(domain_filter)
        
        pi_users_list = request.env["pi.users"].sudo().search(domain_filter, order="paid_in_all_donations desc, unblocked_datetime desc", limit=int(rowperpage), offset=int(row))
        
        data = []
        for i in pi_users_list:
            verified = ""
            if i.unblocked:
                if request.env.context.get("lang") == "es_ES":
                    verified = " (<i class='fa fa-check-circle-o'></i>, " + str(i.unblocked_datetime) + " UTC)"
                else:
                    verified = " (<i class='fa fa-check-circle-o'></i>, " + str(i.unblocked_datetime) + " UTC)"
            else:
                verified = ""
            
            if request.env.context.get("lang") == "es_ES":
                data.append({'pi_user_code': "<strong translate='no'>" + i.pi_user_code + "</strong>" + verified + ". Donación: " + str('{:,}'.format(i.paid_in_all_donations)) + " Pi"})
            else:
                data.append({'pi_user_code': "<strong translate='no'>" + i.pi_user_code + "</strong>" + verified + ". Donation: " + str('{:,}'.format(i.paid_in_all_donations)) + " Pi"})
        
        return json.dumps({'draw': int(draw), 'aaData': data, "iTotalRecords": pi_users_count, "iTotalDisplayRecords": pi_users_count_filter})
    
    @http.route('/latinchain-academy/', type='http', auth="public", website=True, csrf=False)
    def latinchain_academy(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_odoo.latinchain_academy', {'no_footer': False, 'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/latinchain-sports/', type='http', auth="public", website=True, csrf=False)
    def latinchain_sports(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_odoo.latinchain_sports', {'no_footer': False, 'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/get-transactions/', type='http', auth="public", website=True, csrf=False)
    def get_transactions(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_odoo.list_transactions', {'company_latinchain_id': request.env['res.company']._company_default_get(), 'no_footer': False, 'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})

    @http.route('/get-transactions-data/<string:source>', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def get_transactions_data(self, source, **kw):
        #_logger.info(str(kw))
        
        draw = kw['draw']
        row = kw['start']
        rowperpage = kw['length']
        #columnIndex = kw["order[0][column]"]
        columnName = kw["columns[0][data]"]
        #columnSortOrder = kw["order[0][dir]"]
        searchValue = kw["search[value]"]
        
        if 'accessToken' not in kw or kw['accessToken'] == "":
            return json.dumps({'draw': int(draw), 'aaData': [], "iTotalRecords": 0, "iTotalDisplayRecords": 0})
        
        re = requests.get('https://api.minepi.com/v2/me',headers={'Authorization': "Bearer " + kw['accessToken']})
        #_logger.info(kw['accessToken'])
        try:
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            
            if not (result_dict['uid'] == kw['pi_user_id'] and result_dict['username'] == kw['pi_user_code']):
                _logger.info("Authorization failed")
                return json.dumps({'draw': int(draw), 'aaData': [], "iTotalRecords": 0, "iTotalDisplayRecords": 0})
        except:
            _logger.info("Authorization error")
            return json.dumps({'draw': int(draw), 'aaData': [], "iTotalRecords": 0, "iTotalDisplayRecords": 0})
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', kw["pi_user_code"])])
        
        if len(pi_user) == 0:
            return json.dumps({'draw': int(draw), 'aaData': [], "iTotalRecords": 0, "iTotalDisplayRecords": 0})
        
        pi_transactions_count = request.env["pi.transactions"].sudo().search_count([('id', 'in', pi_user[0].pi_transactions_ids.ids), ('action', '=', 'complete')])
        
        pi_transactions_count_filter = request.env["pi.transactions"].sudo().search_count([('id', 'in', pi_user[0].pi_transactions_ids.ids), ('action', '=', 'complete'), '|', ('amount', 'ilike', '%' + searchValue + '%'), '|', ('memo', 'ilike', '%' + searchValue + '%'), '|', ('create_date', 'ilike', '%' + searchValue + '%'), ('txid', 'ilike', '%' + searchValue + '%')])
        
        pi_transactions_list = request.env["pi.transactions"].sudo().search([('id', 'in', pi_user[0].pi_transactions_ids.ids), ('action', '=', 'complete'), '|', ('amount', 'ilike', '%' + searchValue + '%'), '|', ('memo', 'ilike', '%' + searchValue + '%'), '|', ('create_date', 'ilike', '%' + searchValue + '%'), ('txid', 'ilike', '%' + searchValue + '%')], order="create_date desc", limit=int(rowperpage), offset=int(row))
        
        data = []
        for i in pi_transactions_list:
            direction = ""
            if i.action_type == "receive":
                direction = " <span style='color:red'><i class='fa fa-arrow-up'></i></span>"
            elif i.action_type == "send":
                direction = " <span style='color:green'><i class='fa fa-arrow-down'></i></span>"
            if source == "radioforus":
                data.append({'memo': i.memo + direction + " (" + str(i.create_date) + " UTC)", 'amount': str('{:,}'.format(i.amount)) + " Pi", 'txid': " <button class='btn btn-link' onclick='$.colorbox({href:\"" + i.txid_url + "\", iframe:true, width: \"100%\", height: \"90%\", maxWidth: \"100%\", maxHeight: \"90%\", top: \"0%\", bottom: \"10%\", onOpen: function(){$(\"body\").css(\"overflow\", \"hidden\");}, onClosed: function(){$(\"body\").css(\"overflow\", \"auto\");}});'>" + i.txid[:4] + "..." + i.txid[-4:] + "</button><button class='btn btn-primary' onclick='copyToClipboard(\"" + i.txid_url + "\");'>Copy</button>"})
            else:
                data.append({'memo': i.memo + direction + " (" + str(i.create_date) + " UTC)", 'amount': str('{:,}'.format(i.amount)) + " Pi", 'txid': " <button class='btn btn-link' onclick='$.colorbox({href:\"" + i.txid_url + "\", iframe:true, width: \"100%\", height: \"100%\", maxWidth: \"100%\", maxHeight: \"100%\"});'>" + i.txid[:4] + "..." + i.txid[-4:] + "</button><button class='btn btn-primary' onclick='copyToClipboard(\"" + i.txid_url + "\");'>Copy</button>"})
        
        return json.dumps({'draw': int(draw), 'aaData': data, "iTotalRecords": pi_transactions_count, "iTotalDisplayRecords": pi_transactions_count_filter})
        
    @http.route('/validation-key.txt', type='http', auth="public", website=True, csrf=False)
    def validation_txt(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            validation_key = ""
        else:
            validation_key = admin_app_list[0].validation_key

        #"9ab0680599b4a0d44a5c46a500ef78ba0753c8772401d6df13e5a1158f293cd603c4a257723d964e300759deb38470fa1bd000018823d156bfc618f88bba81b5"
        return validation_key
        
    @http.route('/piapp-link-verification.txt', type='http', auth="public", website=True, csrf=False)
    def piapp_link_verification(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            validation_key = ""
        else:
            if admin_app_list[0].mainnet in ["Mainnet ON", "Mainnet OFF"]:
                validation_key = "HIxYDFeM8j4zC4A7BT_oZWNJLKUS9HI9"
            else:
                validation_key = "hh4KuEUkRhMTGItK2peuIYI4wlp1yHbN"

        return validation_key
        
    @http.route('/ads.txt', type='http', auth="public", website=True, csrf=False)
    def google_adsense_txt(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            google_adsense_ads_txt = ""
        else:
            google_adsense_ads_txt = admin_app_list[0].google_adsense_ads_txt

        headers = {'Content-Type': 'text; charset=UTF-8'}
        return Response(google_adsense_ads_txt, headers=headers)

    @http.route('/c31e6c84fe776276bd8ee62aa064f70c.txt', type='http', auth="public", website=True, csrf=False)
    def coinzilla_txt(self, **kw):

        return "c31e6c84fe776276bd8ee62aa064f70c"
    
    @http.route('/gemini-native-image.png', type='http', auth='public')
    def gemini_image(self, **kwargs):
        file_folder = os.path.dirname(os.path.realpath(__file__))
        
        img_array = [file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Buenos_Aires.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Caracas.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Los_Angeles.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Mexico_City.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Seoul.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Shanghai.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Tokyo.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Vietnam.png",
                    file_folder + "/" + "../static/src/ai-images/Gemini_Generated_Image_Honduras.png"]
        
        random_integer = random.randint(0, 8)
        
        #try:
        with open(img_array[random_integer], 'rb') as f:
            image_data = f.read()
        return request.make_response(
            image_data,
            headers=[('Content-Type', 'image/png')]  # Adjust content type if needed
        )
        #except FileNotFoundError:
        #    return request.not_found()
