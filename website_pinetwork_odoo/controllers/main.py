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

from datetime import datetime, timedelta

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
    @http.route('/my/security', type='http', auth='user', website=True, methods=['GET', 'POST'])
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
    
    @http.route('/mainpage', type='http', auth="public", website=True)
    def index(self, **kw):
                    
        return http.request.render('website_pinetwork_odoo.mainpage')
    
    @http.route('/example', type='http', auth="public", website=True)
    def example(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_first_app')])
        
        if len(admin_app_list) == 0:
            sandbox = False
        else:
            sandbox = admin_app_list[0].sandbox
        
        return http.request.render('website_pinetwork_odoo.example', {'sandbox': sandbox})
        
    @http.route('/api-docs/', type='http', auth="public", website=True, csrf=False, methods=['GET'])
    def api_external_docs(self, **kw):
        return http.request.redirect('https://github.com/pi-apps/LatinChain/tree/main/docs')
        
    @http.route('/terms/', type='http', auth="public", website=True, csrf=False, methods=['GET'])
    def latinchain_terms(self, **kw):
        return http.request.redirect('/blog/latinchain-blog-1/terms-of-service-6')
        
    @http.route('/privacy/', type='http', auth="public", website=True, csrf=False, methods=['GET'])
    def latinchain_privacy(self, **kw):
        return http.request.redirect('/blog/latinchain-blog-1/privacy-policy-5')
    
    @http.route('/api/get-external-winners', type='http', auth="public", website=True, csrf=False, methods=['POST'])
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
                    'points_snake_wins': pi_user.points_snake_wins, 'points_datetime': str(pi_user.points_datetime) + " UTC",
                    'unblocked': pi_user.unblocked, 'unblocked_datetime': str(unblocked_datetime), 
                    'days_available': pi_user.days_available,
                    'is_winner': is_winner})
        
        headers = {'Content-Type': 'application/json'}
        return Response(json.dumps({'result': True, 'pi_winner_list': pi_winner_list}), headers=headers)
    
    @http.route('/api/get-external-user', type='http', auth="public", website=True, csrf=False, methods=['POST'])
    def get_external_user(self, **kw):
        
        """
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
        """
        
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
                            'points_snake_wins': pi_users_list[0].points_snake_wins, 'points_datetime': str(pi_users_list[0].points_datetime) + " UTC",
                            'unblocked': pi_users_list[0].unblocked, 'unblocked_datetime': str(unblocked_datetime), 
                            'days_available': pi_users_list[0].days_available,
                            'is_winner': is_winner}), headers=headers)
    
    @http.route('/get-user', type='http', auth="public", website=True, csrf=False, methods=['POST'])
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
        
        result_found = request.env["pi.transactions"].sudo().search([('action', '!=', 'complete'), ('action_type', '=', 'receive'), 
                                                                ('pi_user_id', '=', pi_users_list[0].pi_user_id)]).check_transactions_one_user()
            
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
                            'points_snake': pi_users_list[0].points_snake, 'points_datetime': str(pi_users_list[0].points_datetime) + " UTC",
                            'unblocked': pi_users_list[0].unblocked,
                            'unblocked_datetime': str(unblocked_datetime),
                            'days_available': pi_users_list[0].days_available,
                            'amount': apps_list[0].amount,
                            'passkey': passkey,
                            'im_winner': im_winner, 'pi_wallet_address': pi_users_list[0].pi_wallet_address,
                            'streaming_url': pi_users_list[0].streaming_url,
                            'complete_found': result_found['complete_found']})
    
    @http.route('/set-pi-wallet', type='http', auth="public", website=True, csrf=False, methods=['POST'])
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
    
    @http.route('/set-streaming-url', type='http', auth="public", website=True, csrf=False, methods=['POST'])
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
            
            if 'streaming_url' not in kw:
                _logger.info("streaming_url not present")
                return json.dumps({'result': False})
            values = {'streaming_url': kw['streaming_url']}
        
        #Uncomment in case of you want to save wallet address
        pi_users_list[0].sudo().write(values)
        
        return json.dumps({'result': True})
        
    @http.route('/pi-api', type='http', auth="public", website=True, csrf=False, methods=['POST'])
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
        
    @http.route('/pi-points', type='http', auth="public", website=True, csrf=False, methods=['POST'])
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
        
        if len(pi_users_list) == 0:
            request.env["pi.users"].sudo().create({'name': kw['pi_user_code'],
                                                    'pi_user_id': kw['pi_user_id'],
                                                    'pi_user_code': kw['pi_user_code'],
                                                    'points': 0,
                                                    'points_chess': 0,
                                                    'points_sudoku': 0,
                                                    'points_snake': 0,
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
            
            if pi_users_list[0].unblocked:
                #if int(kw['points']) > 0:
                #    pi_users_winnners_count = request.env["pi.users"].sudo().search_count(winner_domain)
                #    
                #    if pi_users_winnners_count >= 10:
                #        return json.dumps({'result': False})
                
                #if pi_users_list[0].pi_user_id != '':
                if 'app_client' in kw:
                    if kw['app_client'] == "auth_platform":
                        if float(kw['points']) > 0:
                            values.update({'points_chess': pi_users_list[0].points_chess + float(kw['points'])})
                            values.update({'points_chess_wins': pi_users_list[0].points_chess_wins + 1 })
                            if float(kw['points']) > pi_users_list[0].points_chess_last:
                                values.update({'points_chess_last': float(kw['points'])})
                    elif kw['app_client'] == "auth_pidoku":
                        if float(kw['points']) > 0:
                            values.update({'points_sudoku': pi_users_list[0].points_sudoku + float(kw['points'])})
                            values.update({'points_sudoku_wins': pi_users_list[0].points_sudoku_wins + 1 })
                            if float(kw['points']) > pi_users_list[0].points_sudoku_last:
                                values.update({'points_sudoku_last': float(kw['points'])})
                    elif kw['app_client'] == "auth_snake":
                        if float(kw['points']) > 0:
                            values.update({'points_snake': pi_users_list[0].points_snake + float(kw['points'])})
                            values.update({'points_snake_wins': pi_users_list[0].points_snake_wins + 1 })
                            if float(kw['points']) > pi_users_list[0].points_snake_last:
                                values.update({'points_snake_last': float(kw['points'])})
            elif not pi_users_list[0].unblocked and int(kw['points']) > 0:
                return json.dumps({'result': False})
            
            pi_users_list[0].sudo().write(values)
            
        request.env.cr.commit()
        
        return json.dumps({'result': True})
        
    @http.route('/get-points/<string:pi_user_code>', type='http', auth="public", website=True)
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
        
        pi_users_list = request.env["pi.users"].sudo().search(leaders_domain, limit=50, order="points desc,unblocked_datetime desc,points_datetime asc")
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.list_points', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_user': pi_user})
        
    @http.route('/get-points/', type='http', auth="public", website=True)
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
        
        pi_users_list = request.env["pi.users"].sudo().search(leaders_domain, limit=50, order="points desc,unblocked_datetime desc,points_datetime asc")
        
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
        
    @http.route('/get-top10-zone/', type='http', auth="public", website=True)
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
    
    @http.route('/get-top10-zone/<string:pi_user_code>', type='http', auth="public", website=True)
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
        
    @http.route('/get-winners-zone/', type='http', auth="public", website=True)
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

    @http.route('/get-winners-zone/<string:pi_user_code>', type='http', auth="public", website=True)
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
    
    @http.route('/get-streamers-zone/', type='http', auth="public", website=True)
    def get_streamers_zone(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_list = request.env["pi.users"].sudo().search([('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('streaming_url', '!=', '')], limit=50, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        return http.request.render('website_pinetwork_odoo.list_streamer_zone', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list})

    @http.route('/get-streamers-zone/<string:pi_user_code>', type='http', auth="public", website=True)
    def get_streamers_zone_user(self, pi_user_code, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            total_users_count = 0
            total_users_verified_count = 0
        else:
            total_users_count = admin_app_list[0].total_users_count
            total_users_verified_count = admin_app_list[0].total_users_verified_count
        
        pi_users_list = request.env["pi.users"].sudo().search([('unblocked_datetime', '>=', datetime.now() - timedelta(days=30)), ('streaming_url', '!=', '')], limit=50, order="points desc,unblocked_datetime desc,points_datetime asc,id asc")
        
        pi_users_verified_count = int(total_users_verified_count)
        
        pi_users_count = int(total_users_count)
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        return http.request.render('website_pinetwork_odoo.list_streamer_zone', {'pi_users_verified_count': pi_users_verified_count, 'pi_users_count': pi_users_count, 'pi_users_list': pi_users_list, 'pi_user': pi_user})
        
    @http.route('/get-credits/', type='http', auth="public", website=True)
    def get_credits(self, **kw):
        return http.request.render('website_pinetwork_odoo.list_credits')

    @http.route('/get-credits-data/', type='http', auth="public", website=True, methods=['POST'], csrf=False)
    def get_credits_data(self, **kw):
        #_logger.info(str(kw))
        
        draw = kw['draw'];
        row = kw['start'];
        rowperpage = kw['length'];
        #columnIndex = kw["order[0][column]"]
        columnName = kw["columns[0][data]"]
        #columnSortOrder = kw["order[0][dir]"]
        searchValue = kw["search[value]"]
        
        if searchValue.lower() == "is verified":
            domain_filter = [('donator', '=', True), ('unblocked_datetime', '>=', datetime.now() - timedelta(days=30))]
        elif searchValue.lower() == "not verified":
            domain_filter = [('donator', '=', True), ('unblocked_datetime', '<', datetime.now() - timedelta(days=30))]
        else:
            domain_filter = [('donator', '=', True), '|', ('pi_user_code', 'ilike', '%' + searchValue + '%'), ('paid_in_all_donations', 'ilike', '%' + searchValue + '%')]
        
        pi_users_count = request.env["pi.users"].sudo().search_count([('donator', '=', True)])
        
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
                data.append({'pi_user_code': "<strong translate='no'>" + i.pi_user_code + "</strong>" + verified + ". Donación: " + str(i.paid_in_all_donations) + " Pi"})
            else:
                data.append({'pi_user_code': "<strong translate='no'>" + i.pi_user_code + "</strong>" + verified + ". Donation: " + str(i.paid_in_all_donations) + " Pi"})
        
        return json.dumps({'draw': int(draw), 'aaData': data, "iTotalRecords": pi_users_count, "iTotalDisplayRecords": pi_users_count_filter})
    
    @http.route('/get-transactions/', type='http', auth="public", website=True)
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
        
        return http.request.render('website_pinetwork_odoo.list_transactions', {'no_footer': True, 'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})

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
                data.append({'memo': i.memo + direction + " (" + str(i.create_date) + " UTC)", 'amount': str(i.amount) + " Pi", 'txid': " <button class='btn btn-link' onclick='$.colorbox({href:\"" + i.txid_url + "\", iframe:true, width: \"100%\", height: \"90%\", maxWidth: \"100%\", maxHeight: \"90%\", top: \"0%\", bottom: \"10%\", onOpen: function(){$(\"body\").css(\"overflow\", \"hidden\");}, onClosed: function(){$(\"body\").css(\"overflow\", \"auto\");}});'>" + i.txid[:4] + "..." + i.txid[-4:] + "</button><button class='btn btn-primary' onclick='copyToClipboard(\"" + i.txid_url + "\");'>Copy</button>"})
            else:
                data.append({'memo': i.memo + direction + " (" + str(i.create_date) + " UTC)", 'amount': str(i.amount) + " Pi", 'txid': " <button class='btn btn-link' onclick='$.colorbox({href:\"" + i.txid_url + "\", iframe:true, width: \"100%\", height: \"100%\", maxWidth: \"100%\", maxHeight: \"100%\"});'>" + i.txid[:4] + "..." + i.txid[-4:] + "</button><button class='btn btn-primary' onclick='copyToClipboard(\"" + i.txid_url + "\");'>Copy</button>"})
        
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
                validation_key = "y7sKhIQZDC1r3C6Tt4nSexcafCZzPr0m"
            else:
                validation_key = "NiFura6ej0P_vczsXAsIKbW6RSzDXxEY"

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
