# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request
import json

import requests

from werkzeug.utils import redirect

import logging
_logger = logging.getLogger(__name__)

from odoo.addons.website.controllers.main import Website

from datetime import datetime, timedelta

class Website(Website):
    @http.route('/', type='http', auth="public", website=True, csrf=False)
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
            total_transactions_daily_count = 0
            total_users_daily_count = 0
            pi_main_user = False
            points_latin_amount = 1
            pi_ad_hours = 0
            pi_ad_max = 0
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
            total_transactions_daily_count = int(admin_app_list[0].total_transactions_daily_count)
            total_users_daily_count = int(admin_app_list[0].total_users_daily_count)
            pioneers_streaming = admin_app_list[0].pioneers_streaming
            pi_main_user = admin_app_list[0].pi_main_user
            points_latin_amount = admin_app_list[0].points_latin_amount
            pi_ad_hours = str(timedelta(seconds=admin_app_list[0].pi_ad_seconds))
            #round(((admin_app_list[0].pi_ad_seconds/3600)*60)/100,4)
            pi_ad_max = admin_app_list[0].pi_ad_max
        
        avatar_user_options = request.env["pi.users"].sudo()._get_dynamic_avatar_options()

        nopopup = False
        if "nopopup" in kw:
            nopopup = kw["nopopup"]
        
        return http.request.render('website_pinetwork_games_odoo.mainpage', {'avatar_user_options': avatar_user_options, 'nopopup': nopopup, 'pi_ad_max': pi_ad_max, 'pi_ad_hours': pi_ad_hours, 'points_latin_amount': points_latin_amount, 'pi_main_user': pi_main_user, 'pioneers_streaming': pioneers_streaming, 'total_transactions_daily_count': total_transactions_daily_count, 'total_users_daily_count': total_users_daily_count, 'no_footer': True, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})

class PiNetworkController(http.Controller):
    @http.route('/radioforus', type='http', auth="public", website=True, csrf=False)
    def radioforus(self, **kw):
        
        link_back = "https://mainnet.radioforus.com"
        if 'link_back' not in kw:
            if 'HTTP_REFERER' in http.request.httprequest.environ and 'HTTP_HOST' in http.request.httprequest.environ:
                if "https://radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://test.latin-chain.com/radioforus?link_back=https://radioforus.com")
                elif "https://mainnet.radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://latin-chain.com/radioforus?link_back=https://mainnet.radioforus.com")
            else:
                if http.request.httprequest.environ['HTTP_HOST'] == "latin-chain.com":
                    link_back = "https://mainnet.radioforus.com"
                elif http.request.httprequest.environ['HTTP_HOST'] == "test.latin-chain.com":
                    link_back = "https://radioforus.com"
        else:
            link_back = kw['link_back']
        
        """
        link_back = "https://mainnet.radioforus.com"
        if 'link_back' not in kw:
            if 'HTTP_REFERER' in http.request.httprequest.environ and 'HTTP_HOST' in http.request.httprequest.environ:
                if "https://radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://" + http.request.httprequest.environ['HTTP_HOST'] + "/radioforus?link_back=https://radioforus.com")
                elif "https://mainnet.radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://" + http.request.httprequest.environ['HTTP_HOST'] + "/radioforus?link_back=https://mainnet.radioforus.com")
        else:
            link_back = kw['link_back']
        """
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_example')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            amount_latin_pay = False
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
            points_latin_amount = 1
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            amount_latin_pay = admin_app_list[0].amount_latin_pay
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
            points_latin_amount = admin_app_list[0].points_latin_amount
        
        return http.request.render('website_pinetwork_games_odoo.radioforus', {'amount_latin_pay': amount_latin_pay, 'points_latin_amount': points_latin_amount, 'link_back': link_back, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/get-transactions-radioforus/', type='http', auth="public", website=True, csrf=False)
    def get_transactions_radioforus(self, **kw):
        
        link_back = "https://mainnet.radioforus.com"
        if 'link_back' not in kw:
            if 'HTTP_REFERER' in http.request.httprequest.environ and 'HTTP_HOST' in http.request.httprequest.environ:
                if "https://radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://test.latin-chain.com/get-transactions-radioforus?link_back=https://radioforus.com")
                elif "https://mainnet.radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://latin-chain.com/get-transactions-radioforus?link_back=https://mainnet.radioforus.com")
            else:
                if http.request.httprequest.environ['HTTP_HOST'] == "latin-chain.com":
                    link_back = "https://mainnet.radioforus.com"
                elif http.request.httprequest.environ['HTTP_HOST'] == "test.latin-chain.com":
                    link_back = "https://radioforus.com"
        else:
            link_back = kw['link_back']
        
        """
        link_back = "https://mainnet.radioforus.com"
        if 'link_back' not in kw:
            if 'HTTP_REFERER' in http.request.httprequest.environ and 'HTTP_HOST' in http.request.httprequest.environ:
                if "https://radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://" + http.request.httprequest.environ['HTTP_HOST'] + "/get-transactions-radioforus?link_back='https://radioforus.com'")
                elif "https://mainnet.radioforus.com" in http.request.httprequest.environ['HTTP_REFERER']:
                    return redirect("https://" + http.request.httprequest.environ['HTTP_HOST'] + "/get-transactions-radioforus?link_back='https://mainnet.radioforus.com'")
        else:
            link_back = kw['link_back']
        """
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.list_transactions_radioforus', {'company_latinchain_id': request.env['res.company']._company_default_get(), 'link_back': link_back, 'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/tetris/', type='http', auth="public", website=True, csrf=False)
    def tetris(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.tetris', {'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/mahjong/', type='http', auth="public", website=True)
    def mahjong(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.mahjong', {'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/bubble-shooter/', type='http', auth="public", website=True, csrf=False)
    def bubble_shooter(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.bubble_shooter', {'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/test-your-brain/', type='http', auth="public", website=True, csrf=False)
    def test_your_brain(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.test_your_brain', {'sandbox': sandbox, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/fifteen-puzzle/', type='http', auth="public", website=True, csrf=False)
    def fifteen_puzzle(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.fifteen_puzzle', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/pingpong/', type='http', auth="public", website=True, csrf=False)
    def pingpong(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.pingpong', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/checkers/', type='http', auth="public", website=True, csrf=False)
    def checkers(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.checkers', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
        
    @http.route('/domino/', type='http', auth="public", website=True, csrf=False)
    def domino(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.domino', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/latincrush/', type='http', auth="public", website=True, csrf=False)
    def latincrush(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.latincrush', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/gameslearning/', type='http', auth="public", website=True, csrf=False)
    def gameslearning(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.gameslearning', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/odoolearning/', type='http', auth="public", website=True, csrf=False)
    def odoolearning(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.odoolearning', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/languagelearning/', type='http', auth="public", website=True, csrf=False)
    def languagelearning(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.languagelearning', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/webtorrent/', type='http', auth="public", website=True, csrf=False)
    def webtorrent(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.webtorrent', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/musicplayer/', type='http', auth="public", website=True, csrf=False)
    def musicplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.musicplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/videoplayer/', type='http', auth="public", website=True, csrf=False)
    def videoplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.videoplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
        
    @http.route('/imgplayer/', type='http', auth="public", website=True, csrf=False)
    def imgplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.imgplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/webcamplayer/', type='http', auth="public", website=True, csrf=False)
    def webcamplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.webcamplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/texttospeechplayer/', type='http', auth="public", website=True, csrf=False)
    def texttospeechplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.texttospeechplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
        
    @http.route('/mapsplayer/', type='http', auth="public", website=True, csrf=False)
    def mapsplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.mapsplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/calcplayer/', type='http', auth="public", website=True, csrf=False)
    def calcplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.calcplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/calendarplayer/', type='http', auth="public", website=True, csrf=False)
    def calendarplayer(self, **kw):
        
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = admin_app_list[0].sandbox
            mainnet = admin_app_list[0].mainnet
            google_adsense = admin_app_list[0].google_adsense
        
        return http.request.render('website_pinetwork_games_odoo.calendarplayer', {'sandbox': sandbox, 'hide_google_translate': True, 'mainnet': mainnet, 'google_adsense': google_adsense})
    
    @http.route('/latinchain-mainnet-redirect', type='http', auth="public", website=True, csrf=False)
    def latinchain_mainnet_redirect(self, **kw):
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
        
        return http.request.render('website_pinetwork_games_odoo.latinchain_mainnet_redirect', {'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/latinchain_x', type='http', auth="public", website=True, csrf=False)
    def latinchain_x(self, **kw):
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
            announcement_html = ""
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
            announcement_html = admin_app_list[0].announcement_html
        
        return http.request.render('website_pinetwork_games_odoo.latinchain_x', {'announcement_html': announcement_html, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/pinetwork', type='http', auth="public", website=True, csrf=False)
    def index(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_example')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            amount_latin_pay = False
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
            points_latin_amount = 1
            pi_ad_hours = 0
            pi_ad_max = 0
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            amount_latin_pay = admin_app_list[0].amount_latin_pay
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
            points_latin_amount = admin_app_list[0].points_latin_amount
            pi_ad_hours = str(timedelta(seconds=admin_app_list[0].pi_ad_seconds))
            #round(((admin_app_list[0].pi_ad_seconds/3600)*60)/100,4)
            pi_ad_max = admin_app_list[0].pi_ad_max
            
        payoneclick = False
        if "payoneclick" in kw:
            payoneclick = kw["payoneclick"]
        
        return http.request.render('website_pinetwork_games_odoo.pinetwork', {'payoneclick': payoneclick, 'amount_latin_pay': amount_latin_pay, 'pi_ad_max': pi_ad_max, 'pi_ad_hours': pi_ad_hours, 'points_latin_amount': points_latin_amount, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/sudoku', type='http', auth="public", website=True, csrf=False)
    def sudoku(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_pidoku')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            amount_latin_pay = False
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
            points_latin_amount = 1
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            amount_latin_pay = admin_app_list[0].amount_latin_pay
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
            points_latin_amount = admin_app_list[0].points_latin_amount
        
        return http.request.render('website_pinetwork_games_odoo.sudoku', {'amount_latin_pay': amount_latin_pay, 'points_latin_amount': points_latin_amount, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
    
    @http.route('/snake', type='http', auth="public", website=True, csrf=False)
    def snake(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_snake')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            amount_latin_pay = False
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
            amount_latin_pay = admin_app_list[0].amount_latin_pay
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
        
        return http.request.render('website_pinetwork_games_odoo.snake', {'amount_latin_pay': amount_latin_pay, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 
                                                                        'google_adsense': google_adsense, 'a_ads': a_ads, 
                                                                        'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style,
                                                                        'hide_google_translate': True,
                                                                        'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 
                                                                        'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 
                                                                        'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})
        
    @http.route('/chess', type='http', auth="public", website=True, csrf=False)
    def chess(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            sandbox = False
            amount = False
            amount_latin_pay = False
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
            points_latin_amount = 1
        else:
            sandbox = admin_app_list[0].sandbox
            amount = admin_app_list[0].amount
            amount_latin_pay = admin_app_list[0].amount_latin_pay
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
            points_latin_amount = admin_app_list[0].points_latin_amount
        
        return http.request.render('website_pinetwork_games_odoo.chess', {'amount_latin_pay': amount_latin_pay, 'points_latin_amount': points_latin_amount, 'mainnet': mainnet, 'sandbox': sandbox, 'amount': amount, 'google_adsense': google_adsense, 'a_ads': a_ads, 'a_ads_data': a_ads_data, 'a_ads_style': a_ads_style, 'a_ads_2': a_ads_2, 'a_ads_data_2': a_ads_data_2, 'a_ads_style_2': a_ads_style_2, 'a_ads_3': a_ads_3, 'a_ads_data_3': a_ads_data_3, 'a_ads_style_3': a_ads_style_3})

    @http.route('/modal-vote', type='http', auth="public", website=True, csrf=False)
    def modal_vote(self, **kw):
        
        return http.request.render('website_pinetwork_games_odoo.modal')
        
    @http.route('/modal-rules', type='http', auth="public", website=True, csrf=False)
    def modal_rules(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            amount = False
            pi_users_winners_paid_datetime = False
            mainnet = ""
        else:
            amount = admin_app_list[0].amount
            pi_users_winners_paid_datetime = admin_app_list[0].pi_users_winners_paid_datetime
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.rules', {'mainnet': mainnet, 'amount': amount, 'pi_users_winners_paid_datetime': pi_users_winners_paid_datetime})


    @http.route('/reading-club', type='http', auth="public", website=True, csrf=False)
    def reading_club(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            mainnet = ""
        else:
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.reading_club', {'mainnet': mainnet})
        
    @http.route('/askanexpert', type='http', auth="public", website=True, csrf=False)
    def askanexpert(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            mainnet = ""
        else:
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.askanexpert', {'mainnet': mainnet})
        
    @http.route('/latinchain-certification/<string:pi_user_code>', type='http', auth="public", website=True, csrf=False)
    def certification(self, pi_user_code, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        pi_user = request.env["pi.users"].sudo().search([('pi_user_code', '=', pi_user_code)])
        
        if len(pi_user) == 0:
            username = "--"
            unblocked = False
        else:
            username = pi_user.pi_user_code
            unblocked = pi_user.unblocked
        
        if len(admin_app_list) == 0:
            mainnet = ""
        else:
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.certification', {'mainnet': mainnet, 'username': username, 'unblocked': unblocked})

    @http.route('/latinchain-partners', type='http', auth="public", website=True, csrf=False)
    def partners(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            mainnet = ""
        else:
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.partners', {'mainnet': mainnet})
    
    """
    @http.route('/iframetester', type='http', auth="public", website=True, csrf=False)
    def iframetester(self, **kw):
        admin_app_list = request.env["admin.apps"].sudo().search([('app', '=', 'auth_platform')])
        
        if len(admin_app_list) == 0:
            mainnet = ""
        else:
            mainnet = admin_app_list[0].mainnet
        
        return http.request.render('website_pinetwork_games_odoo.iframetester', {'mainnet': mainnet})
    """
