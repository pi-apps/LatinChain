# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request
import json

import requests

import logging
_logger = logging.getLogger(__name__)

from odoo.addons.website.controllers.main import Website

class Website(Website):
    @http.route('/', type='http', auth="public", website=True)
    def index(self, **kw):
        #super(Website, self).index(**kw)
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            google_adsense = ""
            a_ads = ""
            a_ads_data = ""
            a_ads_style = ""
            a_ads_2 = ""
            a_ads_data_2 = ""
            a_ads_style_2 = ""
            a_ads_3 = ""
            a_ads_data_3 = ""
            a_ads_style_3 = ""
            mainnet = ""
            no_footer = True
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            google_adsense = admin_app_list[0].google_adsense
            a_ads = admin_app_list[0].a_ads
            a_ads_data = admin_app_list[0].a_ads_data
            a_ads_style = admin_app_list[0].a_ads_style
            a_ads_2 = admin_app_list[0].a_ads_2
            a_ads_data_2 = admin_app_list[0].a_ads_data_2
            a_ads_style_2 = admin_app_list[0].a_ads_style_2
            a_ads_3 = admin_app_list[0].a_ads_3
            a_ads_data_3 = admin_app_list[0].a_ads_data_3
            a_ads_style_3 = admin_app_list[0].a_ads_style_3
            mainnet = admin_app_list[0].mainnet
            no_footer = True
        
        return http.request.render('website_pinetwork_games_odoo.mainpage', {'no_footer': True, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})

class PiNetworkController(http.Controller):
    @http.route('/radioforus', type='http', auth="public", website=True)
    def index(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_example')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            google_adsense = ""
            a_ads = ""
            a_ads_data = ""
            a_ads_style = ""
            a_ads_2 = ""
            a_ads_data_2 = ""
            a_ads_style_2 = ""
            a_ads_3 = ""
            a_ads_data_3 = ""
            a_ads_style_3 = ""
            mainnet = ""
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            google_adsense = admin_app_list[0].google_adsense
            a_ads = admin_app_list[0].a_ads
            a_ads_data = admin_app_list[0].a_ads_data
            a_ads_style = admin_app_list[0].a_ads_style
            a_ads_2 = admin_app_list[0].a_ads_2
            a_ads_data_2 = admin_app_list[0].a_ads_data_2
            a_ads_style_2 = admin_app_list[0].a_ads_style_2
            a_ads_3 = admin_app_list[0].a_ads_3
            a_ads_data_3 = admin_app_list[0].a_ads_data_3
            a_ads_style_3 = admin_app_list[0].a_ads_style_3
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.radioforus', {'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/pinetwork', type='http', auth="public", website=True)
    def index(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_example')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            google_adsense = ""
            a_ads = ""
            a_ads_data = ""
            a_ads_style = ""
            a_ads_2 = ""
            a_ads_data_2 = ""
            a_ads_style_2 = ""
            a_ads_3 = ""
            a_ads_data_3 = ""
            a_ads_style_3 = ""
            mainnet = ""
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            google_adsense = admin_app_list[0].google_adsense
            a_ads = admin_app_list[0].a_ads
            a_ads_data = admin_app_list[0].a_ads_data
            a_ads_style = admin_app_list[0].a_ads_style
            a_ads_2 = admin_app_list[0].a_ads_2
            a_ads_data_2 = admin_app_list[0].a_ads_data_2
            a_ads_style_2 = admin_app_list[0].a_ads_style_2
            a_ads_3 = admin_app_list[0].a_ads_3
            a_ads_data_3 = admin_app_list[0].a_ads_data_3
            a_ads_style_3 = admin_app_list[0].a_ads_style_3
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.pinetwork', {'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/sudoku', type='http', auth="public", website=True)
    def sudoku(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_pidoku')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            google_adsense = ""
            a_ads = ""
            a_ads_data = ""
            a_ads_style = ""
            a_ads_2 = ""
            a_ads_data_2 = ""
            a_ads_style_2 = ""
            a_ads_3 = ""
            a_ads_data_3 = ""
            a_ads_style_3 = ""
            mainnet = ""
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            google_adsense = admin_app_list[0].google_adsense
            a_ads = admin_app_list[0].a_ads
            a_ads_data = admin_app_list[0].a_ads_data
            a_ads_style = admin_app_list[0].a_ads_style
            a_ads_2 = admin_app_list[0].a_ads_2
            a_ads_data_2 = admin_app_list[0].a_ads_data_2
            a_ads_style_2 = admin_app_list[0].a_ads_style_2
            a_ads_3 = admin_app_list[0].a_ads_3
            a_ads_data_3 = admin_app_list[0].a_ads_data_3
            a_ads_style_3 = admin_app_list[0].a_ads_style_3
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.sudoku', {'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/snake', type='http', auth="public", website=True)
    def snake(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_snake')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            google_adsense = ""
            a_ads = ""
            a_ads_data = ""
            a_ads_style = ""
            a_ads_2 = ""
            a_ads_data_2 = ""
            a_ads_style_2 = ""
            a_ads_3 = ""
            a_ads_data_3 = ""
            a_ads_style_3 = ""
            mainnet = ""
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            google_adsense = admin_app_list[0].google_adsense
            a_ads = admin_app_list[0].a_ads
            a_ads_data = admin_app_list[0].a_ads_data
            a_ads_style = admin_app_list[0].a_ads_style
            a_ads_2 = admin_app_list[0].a_ads_2
            a_ads_data_2 = admin_app_list[0].a_ads_data_2
            a_ads_style_2 = admin_app_list[0].a_ads_style_2
            a_ads_3 = admin_app_list[0].a_ads_3
            a_ads_data_3 = admin_app_list[0].a_ads_data_3
            a_ads_style_3 = admin_app_list[0].a_ads_style_3
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.snake', {'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 
                                                                        'google_adsense': google_adsense, 'a_ads': a_ads, 
                                                                        'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style,
                                                                        'hide_google_translate': True,
                                                                        'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 
                                                                        'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 
                                                                        'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
        
    @http.route('/chess', type='http', auth="public", website=True)
    def chess(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            google_adsense = ""
            a_ads = ""
            a_ads_data = ""
            a_ads_style = ""
            a_ads_2 = ""
            a_ads_data_2 = ""
            a_ads_style_2 = ""
            a_ads_3 = ""
            a_ads_data_3 = ""
            a_ads_style_3 = ""
            mainnet = ""
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            google_adsense = admin_app_list[0].google_adsense
            a_ads = admin_app_list[0].a_ads
            a_ads_data = admin_app_list[0].a_ads_data
            a_ads_style = admin_app_list[0].a_ads_style
            a_ads_2 = admin_app_list[0].a_ads_2
            a_ads_data_2 = admin_app_list[0].a_ads_data_2
            a_ads_style_2 = admin_app_list[0].a_ads_style_2
            a_ads_3 = admin_app_list[0].a_ads_3
            a_ads_data_3 = admin_app_list[0].a_ads_data_3
            a_ads_style_3 = admin_app_list[0].a_ads_style_3
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.chess', {'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})

    @http.route('/modal-vote', type='http', auth="public", website=True, csrf=False)
    def modal_vote(self, **kw):
        
        return http.request.render('website_pinetwork_games_odoo.modal')
        
    @http.route('/modal-rules', type='http', auth="public", website=True, csrf=False)
    def modal_rules(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            amount = False
            pi_users_winners_paid_datetime = False
        else:
            amount = admin_app_list[0].amount
            pi_users_winners_paid_datetime = admin_app_list[0].pi_users_winners_paid_datetime
        
        return http.request.render('website_pinetwork_games_odoo.rules', {'amount': amount, 'pi_users_winners_paid_datetime': pi_users_winners_paid_datetime})
