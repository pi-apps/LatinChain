# -*- coding: utf-8 -*-

from datetime import datetime, timedelta, time
import json
import logging
import textwrap
import requests
from werkzeug.utils import redirect

from odoo import http
from odoo.http import Response, request
from odoo.addons.website.controllers.main import Website
from odoo.addons.website_pinetwork_odoo.controllers.main import (
    PiNetworkBaseController,
)

_logger = logging.getLogger(__name__)


class Website(Website):

    @http.route('/', type='http', auth="public", website=True, csrf=False)
    def index(self, **kw):
        admin_app_list = (
            request.env["admin.apps"]
            .sudo()
            .search([('app', '=', 'auth_platform')])
        )

        if len(admin_app_list) == 0:
            sandbox = False
            amount_price = 0
            amount = False
            amount_latin_pay = False
            amount_price_topay_usd = False
            discount_active = False
            discount_percentage = False
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
            total_users_verified_count = 0
            pioneers_streaming = False
            pi_main_user = False
            points_latin_amount = 1
            points_latin_amount_tip = 5
            pi_ad_hours = 0
            pi_ad_max = 0
            pi_ad_seconds = 0
            latinchain_specs = ""
            base_fee = 0.01
        else:
            app_config = admin_app_list[0]
            sandbox = app_config.sandbox
            amount_price = app_config.amount_price
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            amount_price_topay_usd = app_config.amount_price_topay_usd
            discount_active = app_config.discount_active
            discount_percentage = app_config.discount_percentage
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            no_footer = True
            total_transactions_daily_count = int(
                app_config.total_transactions_daily_count
            )
            total_users_daily_count = int(app_config.total_users_daily_count)
            total_users_verified_count = int(
                app_config.total_users_verified_count
            )
            pioneers_streaming = app_config.pioneers_streaming
            pi_main_user = app_config.pi_main_user
            points_latin_amount = app_config.points_latin_amount
            points_latin_amount_tip = app_config.points_latin_amount_tip
            pi_ad_hours = str(timedelta(seconds=app_config.pi_ad_seconds))
            pi_ad_max = app_config.pi_ad_max
            pi_ad_seconds = app_config.pi_ad_seconds
            latinchain_specs = app_config._get_latinchain_specs()
            base_fee = app_config.get_fee()

        avatar_user_options = (
            request.env["pi.users"].sudo()._get_dynamic_avatar_options()
        )
        nopopup = False

        return http.request.render(
            'website_pinetwork_games_odoo.mainpage',
            {
                'base_fee': base_fee,
                'latinchain_specs': latinchain_specs,
                'discount_active': discount_active,
                'discount_percentage': discount_percentage,
                'amount_price': amount_price,
                'amount_price_topay_usd': amount_price_topay_usd,
                'amount_latin_pay': amount_latin_pay,
                'avatar_user_options': avatar_user_options,
                'nopopup': nopopup,
                'pi_ad_max': pi_ad_max,
                'pi_ad_hours': pi_ad_hours,
                'pi_ad_seconds': pi_ad_seconds,
                'points_latin_amount': points_latin_amount,
                'points_latin_amount_tip': points_latin_amount_tip,
                'pi_main_user': pi_main_user,
                'pioneers_streaming': pioneers_streaming,
                'total_transactions_daily_count': total_transactions_daily_count,
                'total_users_daily_count': total_users_daily_count,
                'total_users_verified_count': total_users_verified_count,
                'no_footer': True,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route(
        '/index-nopopup', type='http', auth="public", website=True, csrf=False
    )
    def index_no_popup(self, **kw):
        admin_app_list = (
            request.env["admin.apps"]
            .sudo()
            .search([('app', '=', 'auth_platform')])
        )

        if len(admin_app_list) == 0:
            sandbox = False
            amount_price = 0
            amount = False
            amount_latin_pay = False
            amount_price_topay_usd = False
            discount_active = False
            discount_percentage = False
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
            total_users_verified_count = 0
            pioneers_streaming = False
            pi_main_user = False
            points_latin_amount = 1
            points_latin_amount_tip = 5
            pi_ad_hours = 0
            pi_ad_max = 0
            pi_ad_seconds = 0
            latinchain_specs = ""
            base_fee = 0.01
        else:
            app_config = admin_app_list[0]
            sandbox = app_config.sandbox
            amount_price = app_config.amount_price
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            amount_price_topay_usd = app_config.amount_price_topay_usd
            discount_active = app_config.discount_active
            discount_percentage = app_config.discount_percentage
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            no_footer = True
            total_transactions_daily_count = int(
                app_config.total_transactions_daily_count
            )
            total_users_daily_count = int(app_config.total_users_daily_count)
            total_users_verified_count = int(
                app_config.total_users_verified_count
            )
            pioneers_streaming = app_config.pioneers_streaming
            pi_main_user = app_config.pi_main_user
            points_latin_amount = app_config.points_latin_amount
            points_latin_amount_tip = app_config.points_latin_amount_tip
            pi_ad_hours = str(timedelta(seconds=app_config.pi_ad_seconds))
            pi_ad_max = app_config.pi_ad_max
            pi_ad_seconds = app_config.pi_ad_seconds
            latinchain_specs = app_config._get_latinchain_specs()
            base_fee = app_config.get_fee()

        avatar_user_options = (
            request.env["pi.users"].sudo()._get_dynamic_avatar_options()
        )

        if mainnet in ['Mainnet OFF', 'Mainnet ON']:
            nopopup = False
        else:
            nopopup = True

        return http.request.render(
            'website_pinetwork_games_odoo.mainpage',
            {
                'base_fee': base_fee,
                'latinchain_specs': latinchain_specs,
                'discount_active': discount_active,
                'discount_percentage': discount_percentage,
                'amount_price': amount_price,
                'amount_price_topay_usd': amount_price_topay_usd,
                'amount_latin_pay': amount_latin_pay,
                'avatar_user_options': avatar_user_options,
                'nopopup': nopopup,
                'pi_ad_max': pi_ad_max,
                'pi_ad_hours': pi_ad_hours,
                'pi_ad_seconds': pi_ad_seconds,
                'points_latin_amount': points_latin_amount,
                'points_latin_amount_tip': points_latin_amount_tip,
                'pi_main_user': pi_main_user,
                'pioneers_streaming': pioneers_streaming,
                'total_transactions_daily_count': total_transactions_daily_count,
                'total_users_daily_count': total_users_daily_count,
                'total_users_verified_count': total_users_verified_count,
                'no_footer': True,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )


class PiNetworkController(http.Controller):

    def _get_app_config(self, app_name='auth_platform'):
        """Utility method to safely fetch administrative configuration records."""
        admin_app_list = (
            request.env["admin.apps"]
            .sudo()
            .search([('app', '=', app_name)])
        )
        return admin_app_list[0] if len(admin_app_list) > 0 else None

    @http.route(
        '/radioforus', type='http', auth="public", website=True, csrf=False
    )
    def radioforus(self, **kw):
        link_back = "https://mainnet.radioforus.com"
        if 'link_back' not in kw:
            if (
                'HTTP_REFERER' in http.request.httprequest.environ
                and 'HTTP_HOST' in http.request.httprequest.environ
            ):
                if (
                    "https://radioforus.com"
                    in http.request.httprequest.environ['HTTP_REFERER']
                ):
                    return redirect(
                        "https://test.latin-chain.com/radioforus?link_back=https://radioforus.com"
                    )
                elif (
                    "https://mainnet.radioforus.com"
                    in http.request.httprequest.environ['HTTP_REFERER']
                ):
                    return redirect(
                        "https://latin-chain.com/radioforus?link_back=https://mainnet.radioforus.com"
                    )
            else:
                if (
                    http.request.httprequest.environ.get('HTTP_HOST')
                    == "latin-chain.com"
                ):
                    link_back = "https://mainnet.radioforus.com"
                elif (
                    http.request.httprequest.environ.get('HTTP_HOST')
                    == "test.latin-chain.com"
                ):
                    link_back = "https://radioforus.com"
        else:
            link_back = kw['link_back']

        app_config = self._get_app_config('auth_example')

        if not app_config:
            sandbox = False
            amount = False
            amount_latin_pay = False
            amount_price_topay_usd = False
            discount_active = False
            discount_percentage = False
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
            latinchain_specs = ""
            block_points = False
        else:
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            amount_price_topay_usd = app_config.amount_price_topay_usd
            discount_active = app_config.discount_active
            discount_percentage = app_config.discount_percentage
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            points_latin_amount = app_config.points_latin_amount
            latinchain_specs = app_config._get_latinchain_specs()
            block_points = app_config.block_points

        return http.request.render(
            'website_pinetwork_games_odoo.radioforus',
            {
                'block_points': block_points,
                'latinchain_specs': latinchain_specs,
                'discount_active': discount_active,
                'discount_percentage': discount_percentage,
                'amount_price_topay_usd': amount_price_topay_usd,
                'amount_latin_pay': amount_latin_pay,
                'points_latin_amount': points_latin_amount,
                'link_back': link_back,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route(
        '/get-transactions-radioforus/',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def get_transactions_radioforus(self, **kw):
        link_back = "https://mainnet.radioforus.com"
        if 'link_back' not in kw:
            if (
                'HTTP_REFERER' in http.request.httprequest.environ
                and 'HTTP_HOST' in http.request.httprequest.environ
            ):
                if (
                    "https://radioforus.com"
                    in http.request.httprequest.environ['HTTP_REFERER']
                ):
                    return redirect(
                        "https://test.latin-chain.com/get-transactions-radioforus?link_back=https://radioforus.com"
                    )
                elif (
                    "https://mainnet.radioforus.com"
                    in http.request.httprequest.environ['HTTP_REFERER']
                ):
                    return redirect(
                        "https://latin-chain.com/get-transactions-radioforus?link_back=https://mainnet.radioforus.com"
                    )
            else:
                if (
                    http.request.httprequest.environ.get('HTTP_HOST')
                    == "latin-chain.com"
                ):
                    link_back = "https://mainnet.radioforus.com"
                elif (
                    http.request.httprequest.environ.get('HTTP_HOST')
                    == "test.latin-chain.com"
                ):
                    link_back = "https://radioforus.com"
        else:
            link_back = kw['link_back']

        app_config = self._get_app_config('auth_platform')

        if not app_config:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = app_config.sandbox
            mainnet = app_config.mainnet
            google_adsense = app_config.google_adsense

        return http.request.render(
            'website_pinetwork_games_odoo.list_transactions_radioforus',
            {
                'company_latinchain_id': (
                    request.env['res.company']._company_default_get()
                ),
                'link_back': link_back,
                'sandbox': sandbox,
                'mainnet': mainnet,
                'google_adsense': google_adsense,
            },
        )

    def _render_simple_game(self, template_name, hide_translate=False):
        """Helper to standardize game routing logic and avoid duplicate boilerplate."""
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            sandbox = False
            mainnet = ""
            google_adsense = ""
        else:
            sandbox = app_config.sandbox
            mainnet = app_config.mainnet
            google_adsense = app_config.google_adsense

        context = {
            'sandbox': sandbox,
            'mainnet': mainnet,
            'google_adsense': google_adsense,
        }
        if hide_translate:
            context['hide_google_translate'] = True

        return http.request.render(
            f'website_pinetwork_games_odoo.{template_name}', context
        )

    @http.route('/tetris/', type='http', auth="public", website=True, csrf=False)
    def tetris(self, **kw):
        return self._render_simple_game('tetris')

    @http.route('/mahjong/', type='http', auth="public", website=True)
    def mahjong(self, **kw):
        return self._render_simple_game('mahjong')

    @http.route(
        '/solitaire/', type='http', auth="public", website=True, csrf=False
    )
    def solitaire(self, **kw):
        return self._render_simple_game('solitaire', hide_translate=True)

    @http.route(
        '/bubble-shooter/',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def bubble_shooter(self, **kw):
        return self._render_simple_game('bubble_shooter')

    @http.route(
        '/test-your-brain/',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def test_your_brain(self, **kw):
        return self._render_simple_game('test_your_brain')

    @http.route(
        '/fifteen-puzzle/',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def fifteen_puzzle(self, **kw):
        return self._render_simple_game('fifteen_puzzle', hide_translate=True)

    @http.route(
        '/pingpong/', type='http', auth="public", website=True, csrf=False
    )
    def pingpong(self, **kw):
        return self._render_simple_game('pingpong', hide_translate=True)

    @http.route('/rpggame/', type='http', auth="public", website=True, csrf=False)
    def rpggame(self, **kw):
        return self._render_simple_game('rpggame', hide_translate=True)

    @http.route(
        '/checkers/', type='http', auth="public", website=True, csrf=False
    )
    def checkers(self, **kw):
        return self._render_simple_game('checkers', hide_translate=True)

    @http.route(
        '/latincats3d/', type='http', auth="public", website=True, csrf=False
    )
    def latincats3d(self, **kw):
        return self._render_simple_game('latincats3d', hide_translate=True)

    @http.route('/xiangqi/', type='http', auth="public", website=True, csrf=False)
    def xiangqi(self, **kw):
        return self._render_simple_game('xiangqi', hide_translate=True)

    @http.route('/domino/', type='http', auth="public", website=True, csrf=False)
    def domino(self, **kw):
        return self._render_simple_game('domino', hide_translate=True)

    @http.route(
        '/latincrush/', type='http', auth="public", website=True, csrf=False
    )
    def latincrush(self, **kw):
        return self._render_simple_game('latincrush', hide_translate=True)

    @http.route(
        '/loslatinos/', type='http', auth="public", website=True, csrf=False
    )
    def loslatinos(self, **kw):
        return self._render_simple_game('loslatinos', hide_translate=True)

    @http.route(
        '/soccer-penalty/',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def soccer_penalty(self, **kw):
        return self._render_simple_game('soccer_penalty', hide_translate=True)

    @http.route(
        '/gameslearning/', type='http', auth="public", website=True, csrf=False
    )
    def gameslearning(self, **kw):
        return self._render_simple_game('gameslearning', hide_translate=True)

    @http.route(
        '/odoolearning/', type='http', auth="public", website=True, csrf=False
    )
    def odoolearning(self, **kw):
        return self._render_simple_game('odoolearning', hide_translate=True)

    @http.route(
        '/languagelearning/',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def languagelearning(self, **kw):
        return self._render_simple_game('languagelearning', hide_translate=True)

    @http.route(
        '/wayuulearning/', type='http', auth="public", website=True, csrf=False
    )
    def wayuulearning(self, **kw):
        return self._render_simple_game('wayuulearning', hide_translate=True)

    @http.route(
        '/mayalearning/', type='http', auth="public", website=True, csrf=False
    )
    def mayalearning(self, **kw):
        return self._render_simple_game('mayalearning', hide_translate=True)

    @http.route(
        ['/external-login-step/', '/pi-sign-in/'],
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def externalloginstep(self, **kw):
        return self._render_simple_game('externalloginstep', hide_translate=True)

    @http.route(
        '/external-login/', type='http', auth="public", website=True, csrf=False
    )
    def externallogin(self, **kw):
        return self._render_simple_game('externallogin', hide_translate=True)

    @http.route('/webcode/', type='http', auth="public", website=True, csrf=False)
    def webcode(self, **kw):
        return self._render_simple_game('webcode', hide_translate=True)

    @http.route(
        '/weboffice/', type='http', auth="public", website=True, csrf=False
    )
    def weboffice(self, **kw):
        return self._render_simple_game('weboffice', hide_translate=True)

    @http.route(
        '/webtorrent/', type='http', auth="public", website=True, csrf=False
    )
    def webtorrent(self, **kw):
        return self._render_simple_game('webtorrent', hide_translate=True)

    @http.route('/tvtube/', type='http', auth="public", website=True, csrf=False)
    def tvtube(self, **kw):
        return self._render_simple_game('tvtube', hide_translate=True)

    @http.route(
        '/pdfreader/', type='http', auth="public", website=True, csrf=False
    )
    def pdfreader(self, **kw):
        return self._render_simple_game('pdfreader', hide_translate=True)

    @http.route(
        '/musicplayer/', type='http', auth="public", website=True, csrf=False
    )
    def musicplayer(self, **kw):
        return self._render_simple_game('musicplayer', hide_translate=True)

    @http.route(
        '/videoplayer/', type='http', auth="public", website=True, csrf=False
    )
    def videoplayer(self, **kw):
        return self._render_simple_game('videoplayer', hide_translate=True)

    @http.route(
        '/imgplayer/', type='http', auth="public", website=True, csrf=False
    )
    def imgplayer(self, **kw):
        return self._render_simple_game('imgplayer', hide_translate=True)

    @http.route(
        '/webcamplayer/', type='http', auth="public", website=True, csrf=False
    )
    def webcamplayer(self, **kw):
        return self._render_simple_game('webcamplayer', hide_translate=True)

    @http.route(
        '/texttospeechplayer/',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def texttospeechplayer(self, **kw):
        return self._render_simple_game('texttospeechplayer', hide_translate=True)

    @http.route(
        '/mapsplayer/', type='http', auth="public", website=True, csrf=False
    )
    def mapsplayer(self, **kw):
        return self._render_simple_game('mapsplayer', hide_translate=True)

    @http.route(
        '/calcplayer/', type='http', auth="public", website=True, csrf=False
    )
    def calcplayer(self, **kw):
        return self._render_simple_game('calcplayer', hide_translate=True)

    @http.route(
        '/calendarplayer/', type='http', auth="public", website=True, csrf=False
    )
    def calendarplayer(self, **kw):
        return self._render_simple_game('calendarplayer', hide_translate=True)

    @http.route(
        '/newsplayer/', type='http', auth="public", website=True, csrf=False
    )
    def newsplayer(self, **kw):
        return self._render_simple_game('newsplayer', hide_translate=True)

    @http.route(
        '/sportsplayer/', type='http', auth="public", website=True, csrf=False
    )
    def sportsplayer(self, **kw):
        return self._render_simple_game('sportsplayer', hide_translate=True)

    @http.route(
        '/timezoneplayer/', type='http', auth="public", website=True, csrf=False
    )
    def timezoneplayer(self, **kw):
        return self._render_simple_game('timezoneplayer', hide_translate=True)

    @http.route('/iq-test/', type='http', auth="public", website=True, csrf=False)
    def iqtest(self, **kw):
        return self._render_simple_game('iqtest', hide_translate=True)

    @http.route(
        '/latinchain-mainnet-redirect',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def latinchain_mainnet_redirect(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
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
            discount_active = False
            discount_percentage = False
        else:
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            discount_active = app_config.discount_active
            discount_percentage = app_config.discount_percentage

        onlymainnet = False

        return http.request.render(
            'website_pinetwork_games_odoo.latinchain_mainnet_redirect',
            {
                'onlymainnet': onlymainnet,
                'discount_active': discount_active,
                'discount_percentage': discount_percentage,
                'amount_latin_pay': amount_latin_pay,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route(
        '/latinchain-onlymainnet-redirect',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def latinchain_onlymainnet_redirect(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
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
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet

        onlymainnet = True

        return http.request.render(
            'website_pinetwork_games_odoo.latinchain_mainnet_redirect',
            {
                'onlymainnet': onlymainnet,
                'amount_latin_pay': amount_latin_pay,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route(
        '/latinchain-token',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def latinchain_token(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
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
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet

        onlymainnet = True

        return http.request.render(
            'website_pinetwork_games_odoo.latinchain_token_whitepaper',
            {
                'onlymainnet': onlymainnet,
                'amount_latin_pay': amount_latin_pay,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route(
        '/latinchain_x', type='http', auth="public", website=True, csrf=False
    )
    def latinchain_x(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
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
            sandbox = app_config.sandbox
            amount = app_config.amount
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            announcement_html = app_config.announcement_html

        return http.request.render(
            'website_pinetwork_games_odoo.latinchain_x',
            {
                'announcement_html': announcement_html,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route(
        ['/pinetwork', '/pinetwork/<string:pi_user_referrer>'],
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def pinetwork_index(self, pi_user_referrer=None, **kw):
        app_config = self._get_app_config('auth_example')

        if not app_config:
            sandbox = False
            amount = False
            amount_latinchain_token = False
            amount_latin_pay = False
            amount_price_topay_usd = False
            discount_active = False
            discount_percentage = False
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
            latinchain_specs = ""
            block_points = False
        else:
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latinchain_token = app_config.amount_latinchain_token
            amount_latin_pay = app_config.amount_latin_pay
            amount_price_topay_usd = app_config.amount_price_topay_usd
            discount_active = app_config.discount_active
            discount_percentage = app_config.discount_percentage
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            points_latin_amount = app_config.points_latin_amount
            pi_ad_hours = str(timedelta(seconds=app_config.pi_ad_seconds))
            pi_ad_max = app_config.pi_ad_max
            latinchain_specs = app_config._get_latinchain_specs()
            block_points = app_config.block_points

        payoneclick = kw.get("payoneclick", False)
        showpiad = kw.get("showpiad", False)

        pi_user_referred_by = (
            pi_user_referrer if pi_user_referrer else "rockcesar"
        )

        return http.request.render(
            'website_pinetwork_games_odoo.pinetwork',
            {
                'block_points': block_points,
                'latinchain_specs': latinchain_specs,
                'pi_user_referred_by': pi_user_referred_by,
                'discount_active': discount_active,
                'discount_percentage': discount_percentage,
                'amount_latinchain_token': amount_latinchain_token,
                'amount_price_topay_usd': amount_price_topay_usd,
                'payoneclick': payoneclick,
                'showpiad': showpiad,
                'amount_latin_pay': amount_latin_pay,
                'pi_ad_max': pi_ad_max,
                'pi_ad_hours': pi_ad_hours,
                'points_latin_amount': points_latin_amount,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route('/sudoku', type='http', auth="public", website=True, csrf=False)
    def sudoku(self, **kw):
        app_config = self._get_app_config('auth_pidoku')

        if not app_config:
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
            block_points = False
        else:
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            points_latin_amount = app_config.points_latin_amount
            block_points = app_config.block_points

        return http.request.render(
            'website_pinetwork_games_odoo.sudoku',
            {
                'block_points': block_points,
                'amount_latin_pay': amount_latin_pay,
                'points_latin_amount': points_latin_amount,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route('/snake', type='http', auth="public", website=True, csrf=False)
    def snake(self, **kw):
        app_config = self._get_app_config('auth_snake')

        if not app_config:
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
            block_points = False
        else:
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            block_points = app_config.block_points

        return http.request.render(
            'website_pinetwork_games_odoo.snake',
            {
                'block_points': block_points,
                'amount_latin_pay': amount_latin_pay,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'hide_google_translate': True,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route('/chess', type='http', auth="public", website=True, csrf=False)
    def chess(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
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
            block_points = False
        else:
            sandbox = app_config.sandbox
            amount = app_config.amount
            amount_latin_pay = app_config.amount_latin_pay
            google_adsense = app_config.google_adsense
            a_ads = app_config.a_ads
            a_ads_data = app_config.a_ads_data
            a_ads_style = app_config.a_ads_style
            a_ads_2 = app_config.a_ads_2
            a_ads_data_2 = app_config.a_ads_data_2
            a_ads_style_2 = app_config.a_ads_style_2
            a_ads_3 = app_config.a_ads_3
            a_ads_data_3 = app_config.a_ads_data_3
            a_ads_style_3 = app_config.a_ads_style_3
            mainnet = app_config.mainnet
            points_latin_amount = app_config.points_latin_amount
            block_points = app_config.block_points

        return http.request.render(
            'website_pinetwork_games_odoo.chess',
            {
                'block_points': block_points,
                'amount_latin_pay': amount_latin_pay,
                'points_latin_amount': points_latin_amount,
                'mainnet': mainnet,
                'sandbox': sandbox,
                'amount': amount,
                'google_adsense': google_adsense,
                'a_ads': a_ads,
                'a_ads_data': a_ads_data,
                'a_ads_style': a_ads_style,
                'a_ads_2': a_ads_2,
                'a_ads_data_2': a_ads_data_2,
                'a_ads_style_2': a_ads_style_2,
                'a_ads_3': a_ads_3,
                'a_ads_data_3': a_ads_data_3,
                'a_ads_style_3': a_ads_style_3,
            },
        )

    @http.route(
        '/modal-vote', type='http', auth="public", website=True, csrf=False
    )
    def modal_vote(self, **kw):
        return http.request.render('website_pinetwork_games_odoo.modal')

    @http.route(
        '/modal-rules', type='http', auth="public", website=True, csrf=False
    )
    def modal_rules(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            amount = False
            pi_users_winners_paid_datetime = False
            mainnet = ""
        else:
            amount = app_config.amount
            pi_users_winners_paid_datetime = (
                app_config.pi_users_winners_paid_datetime
            )
            mainnet = app_config.mainnet

        return http.request.render(
            'website_pinetwork_games_odoo.rules',
            {
                'mainnet': mainnet,
                'amount': amount,
                'pi_users_winners_paid_datetime': pi_users_winners_paid_datetime,
            },
        )

    @http.route(
        '/reading-club', type='http', auth="public", website=True, csrf=False
    )
    def reading_club(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            mainnet = ""
        else:
            mainnet = app_config.mainnet

        with_links = False
        amazon_aff_code = PiNetworkBaseController.get_amazon_affiliate_code(
            self
        )

        return http.request.render(
            'website_pinetwork_games_odoo.reading_club',
            {
                'mainnet': mainnet,
                'with_links': with_links,
                'amazon_aff_code': amazon_aff_code,
            },
        )

    @http.route(
        ['/reading-club-links', '/shopping-club', '/latinchain-store'],
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def reading_club_links(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            mainnet = ""
        else:
            mainnet = app_config.mainnet

        with_links = True
        amazon_aff_code = PiNetworkBaseController.get_amazon_affiliate_code(
            self
        )

        return http.request.render(
            'website_pinetwork_games_odoo.reading_club',
            {
                'mainnet': mainnet,
                'with_links': with_links,
                'amazon_aff_code': amazon_aff_code,
            },
        )

    @http.route(
        ['/shopping'], type='http', auth="public", website=True, csrf=False
    )
    def shopping(self, **kw):
        if http.request.httprequest.host not in [
            'club.latin-chain.com',
            'localhost',
            'localhost:8014',
        ]:
            return Response(template='website.page_404', status=404)

        link_text = False
        link_back = "https://latinchain.pinet.com"

        if (
            'HTTP_REFERER' in http.request.httprequest.environ
            and 'HTTP_HOST' in http.request.httprequest.environ
        ):
            _logger.info(http.request.httprequest.environ['HTTP_REFERER'])
            referer = http.request.httprequest.environ['HTTP_REFERER']
            if referer in [
                "https://latin-chain.com",
                "https://latinchain.pinet.com",
            ]:
                link_back = "https://latinchain.pinet.com"
            elif referer in [
                "https://test.latin-chain.com",
                "https://latinchaintest9869.pinet.com",
            ]:
                link_back = "https://latinchaintest9869.pinet.com"
        else:
            if (
                http.request.httprequest.environ.get('HTTP_HOST')
                == "club.latin-chain.com"
            ):
                link_back = "https://latinchain.pinet.com"
                link_text = "Mainnet"

        app_config = self._get_app_config('auth_platform')

        if not app_config:
            mainnet = ""
        else:
            mainnet = app_config.mainnet

        with_links = True
        shopping = True
        amazon_aff_code = PiNetworkBaseController.get_amazon_affiliate_code(
            self
        )

        return http.request.render(
            'website_pinetwork_games_odoo.reading_club',
            {
                'mainnet': mainnet,
                'link_back': link_back,
                'link_text': link_text,
                'with_links': with_links,
                'shopping': shopping,
                'amazon_aff_code': amazon_aff_code,
            },
        )

    @http.route(
        '/askanexpert', type='http', auth="public", website=True, csrf=False
    )
    def askanexpert(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            mainnet = ""
        else:
            mainnet = app_config.mainnet

        return http.request.render(
            'website_pinetwork_games_odoo.askanexpert', {'mainnet': mainnet}
        )

    @http.route(
        '/latinchain-certification/<string:pi_user_code>',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def certification(self, pi_user_code, **kw):
        app_config = self._get_app_config('auth_platform')

        pi_user = (
            request.env["pi.users"]
            .sudo()
            .search([('pi_user_code', '=', pi_user_code)])
        )

        if len(pi_user) == 0:
            username = "--"
            unblocked = False
            iq_result = 0
        else:
            user_rec = pi_user[0]
            username = user_rec.pi_user_code
            unblocked = user_rec.unblocked
            iq_result = user_rec.iq_result

        if not app_config:
            mainnet = ""
        else:
            mainnet = app_config.mainnet

        return http.request.render(
            'website_pinetwork_games_odoo.certification',
            {
                'mainnet': mainnet,
                'username': username,
                'unblocked': unblocked,
                'iq_result': iq_result,
            },
        )

    @http.route(
        '/latinchain-partners',
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def partners(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            mainnet = ""
        else:
            mainnet = app_config.mainnet

        return http.request.render(
            'website_pinetwork_games_odoo.partners', {'mainnet': mainnet}
        )

    @http.route(
        '/binance-donation', type='http', auth="public", website=True, csrf=False
    )
    def binance_donation(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            mainnet = ""
        else:
            mainnet = app_config.mainnet

        return http.request.render(
            'website_pinetwork_games_odoo.binance_donation_redirect',
            {'mainnet': mainnet},
        )

    @http.route(
        ['/binance-donation-stay-safe', '/pi-donation-stay-safe'],
        type='http',
        auth="public",
        website=True,
        csrf=False,
    )
    def binance_donation_stay_safe(self, **kw):
        app_config = self._get_app_config('auth_platform')

        if not app_config:
            mainnet = ""
            amount = 0
            amount_price_topay_usd = 0
            discount_active = 0
            discount_percentage = 0
            total_users_verified_count = 0
        else:
            mainnet = app_config.mainnet
            amount = app_config.amount
            amount_price_topay_usd = app_config.amount_price_topay_usd
            discount_active = app_config.discount_active
            discount_percentage = app_config.discount_percentage
            total_users_verified_count = app_config.total_users_verified_count

        return http.request.render(
            'website_pinetwork_games_odoo.binance_donation_stay_safe',
            {
                'total_users_verified_count': total_users_verified_count,
                'amount': amount,
                'amount_price_topay_usd': amount_price_topay_usd,
                'discount_active': discount_active,
                'discount_percentage': discount_percentage,
                'hide_google_translate': True,
                'mainnet': mainnet,
            },
        )