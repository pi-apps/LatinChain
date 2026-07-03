"use strict";

var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";
var passkey = "";
const Pi = window.Pi;
var unblocked = false;
var show_pi_ad_user = true;
var show_pi_ad_user_time = 0;
var pi_ad_new = false;
var pi_ad_max = 0;

var showing_paying = false;

var leaderboard = "/get-points/";
var winnerboard = "/get-top10-zone/";
var winnerzoneboard = "/get-winners-zone/";
var streamerzoneboard = "/get-streamers-zone/";
var generalranking = "/get-general-ranking/";

var btnvalue = "";

var accessed_interstitial = false;

var colorbox_count = 0;
var colorbox_opened = false;

var colorbox_count_mainnet = 0;
var colorbox_opened_mainnet = false;

var is_open_tab = false;
var is_open_tab_ads = false;

function setConfirmUnload(on) {
    unloadMessage(on);
}

function setConfirmUnloadPoints(on) {
    unloadMessage(on);
}

function showImageModal(imageUrl, captionText) {
    
    var modalHTML = `
        <div style="max-height: 100%; max-width: 100%; height: 250px; overflow-y: auto; overflow-x: hidden; padding: 10px; width: 100%;" tabindex="0">
            <img src="${imageUrl}" class="img-fluid" alt="${captionText}" />
        </div>
    `;
    
    showModalAllAppsHTML(modalHTML);
}

function openInNewTabAds(url) {
    
    is_open_tab_ads = true;
    
    document.getElementById('GoForwardLink').href = url;
    //document.getElementById('GoForwardLink').innerHTML = '<div style="display: inline"><i class="fa-solid fa-unlock-keyhole"></i></div> <div style="display: inline">Unlock Once</div>';
    document.getElementById('blockingOverlay').style.display = 'flex'; // Use 'flex' instead of 'block'
    document.getElementById('goforward-message').style.display = 'flex'; // Use 'flex' instead of 'block'
    document.getElementById('GoForwardShow1').style.display = 'flex'; // Use 'flex' instead of 'block'
    document.getElementById('GoForwardShow2').style.display = 'flex'; // Use 'flex' instead of 'block'
    //document.getElementById('GoForwardShow3').style.display = 'none'; // Use 'flex' instead of 'block'
    document.getElementById('all-messages').style.display = 'none'; // Use 'flex' instead of 'block'
    
}

function colorboxLoaded()
{
    var URLTestnet = "https://ecosystem.latin-chain.com/page-1/?v=1.133"+hashLatinChainGoogleTranslate;
    
    if(["Testnet ON", "Testnet OFF"].includes($("#mainnet").val()) && $("#nopopup").val() == false)
    {
        openInNewTabAds(URLTestnet);
        //window.location.href = "https://ecosystem.latin-chain.com/page-1?v=1.133"+hashLatinChainGoogleTranslate;
        
        $('.darkmode-toggle').css('display', 'none');
        if($('.darkmode-toggle--white').length === 0)
            $('.darkmode-layer--button').css('display', 'none');
        else
            $('.darkmode-toggle--white').css('display', 'none');
    }else
    {
        $('.darkmode-toggle').css('display', 'block');
        if($('.darkmode-toggle--white').length === 0)
            $('.darkmode-layer--button').css('display', 'block');
        else
            $('.darkmode-toggle--white').css('display', 'block');
    }
        
    /*
    if(["Testnet ON", "Testnet OFF"].includes($("#mainnet").val()) && $("#nopopup").val() == false)
    {
        if($.colorbox && !colorbox_opened)
        {
            $.colorbox({fixed: true, href:"https://ecosystem.latin-chain.com/page-1?v=1.133"+hashLatinChainGoogleTranslate, closeButton:false, overlayClose:false, escKey:false, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
            colorbox_opened = true;
            return false;
        }else{
            if(colorbox_opened)
                return false;
            if(colorbox_count > 400)
                return false;
            setTimeout(function() {
                if(colorbox_opened)
                    return false;
                if(colorbox_count > 400)
                    return false;
                colorbox_count += 1;
                colorboxLoaded();
            }, 100);
        }
    }*/
}

function colorboxLoadedMainnet()
{
    var URLMainnet = "https://ecosystem.latin-chain.com/page-mainnet/?v=1.133"+hashLatinChainGoogleTranslate;
    var URLTestnet = "https://ecosystem.latin-chain.com/page-1/?v=1.133"+hashLatinChainGoogleTranslate;
    if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()) && $("#nopopup").val() == false)
    {
        openInNewTabAds(URLMainnet);
        //window.location.href = "https://ecosystem.latin-chain.com/page-mainnet?v=1.133"+hashLatinChainGoogleTranslate;
        
        $('.darkmode-toggle').css('display', 'none');
        if($('.darkmode-toggle--white').length === 0)
            $('.darkmode-layer--button').css('display', 'none');
        else
            $('.darkmode-toggle--white').css('display', 'none');
    }else
    {
        if(!is_open_tab && !is_open_tab_ads)
        {
            $('.darkmode-toggle').css('display', 'block');
            if($('.darkmode-toggle--white').length === 0)
                $('.darkmode-layer--button').css('display', 'block');
            else
                $('.darkmode-toggle--white').css('display', 'block');
        }else
        {
            $('.darkmode-toggle').css('display', 'none');
            if($('.darkmode-toggle--white').length === 0)
                $('.darkmode-layer--button').css('display', 'none');
            else
                $('.darkmode-toggle--white').css('display', 'none');
        }
    }
        
    /*if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()) && $("#nopopup").val() == false)
    {
        if($.colorbox && !colorbox_opened_mainnet)
        {
            $.colorbox({fixed: true, href:"https://ecosystem.latin-chain.com/page-mainnet?v=1.133"+hashLatinChainGoogleTranslate, closeButton:false, overlayClose:false, escKey:false, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
            colorbox_opened_mainnet = true;
            return false;
        }else{
            if(colorbox_opened_mainnet)
                return false;
            if(colorbox_count_mainnet > 400)
                return false;
            setTimeout(function() {
                if(colorbox_opened_mainnet)
                    return false;
                if(colorbox_count_mainnet > 400)
                    return false;
                colorbox_count_mainnet += 1;
                colorboxLoadedMainnet();
            }, 100);
        }
    }*/
}

function set_points(points) {
    if(pi_user_id != "" && pi_user_code != "")
    {
        var data = {
            'pi_user_id': pi_user_id,
            'pi_user_code': pi_user_code,
            'points': points,
            'passkey': passkey,
            'accessToken': accessToken,
            'csrf_token': odoo.csrf_token,
        };
        //$.ajaxSetup({async: false});
        return $.post( "/pi-points", data).done(function(data) {
            data = JSON.parse(data);
            //if(data.result)
            //    alert("You won " + points + " points");
            //$("#refresh").click();

        }).fail(function() {
        });
    }
}

function set_points_exchange(value_client) {
    if(pi_user_id != "" && pi_user_code != "")
    {
        if(value_client == "Chess10x1" || value_client == "Sudoku10x3" || value_client == "Snake10x1" ||
            value_client == "Chess100x10" || value_client == "Sudoku100x12" || value_client == "Snake100x10")
        {
            var app_client = "";
            var points = 0;
            var latin_points = 0;
            var app_client_message = "";
            
            if(value_client == "Chess10x1")
            {
                points = 1;
                app_client = "auth_platform";
                latin_points = 10;
                app_client_message = "Chess points.";
            }
            else if(value_client == "Sudoku10x3")
            {
                points = 3;
                app_client = "auth_pidoku";
                latin_points = 10;
                app_client_message = "Sudoku points.";
            }
            else if(value_client == "Snake10x1")
            {
                points = 1;
                app_client = "auth_snake";
                latin_points = 10;
                app_client_message = "Snake points.";
            }
            else if(value_client == "Chess100x10")
            {
                points = 10;
                app_client = "auth_platform";
                latin_points = 100;
                app_client_message = "Chess points.";
            }
            else if(value_client == "Sudoku100x12")
            {
                points = 12;
                app_client = "auth_pidoku";
                latin_points = 100;
                app_client_message = "Sudoku points.";
            }
            else if(value_client == "Snake100x10")
            {
                points = 10;
                app_client = "auth_snake";
                latin_points = 100;
                app_client_message = "Snake points.";
            }
            
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'points': points,
                'latin_points': latin_points,
                'app_client': app_client,
                'action': 'exchange',
                'passkey': passkey,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            //$.ajaxSetup({async: false});
            $('#button_exchange').prop( "disabled", true );
            $('#exchange_latin').prop( "disabled", true );
            setConfirmUnloadPoints(true);
            return $.post( "/pi-points", data).done(function(data) {
                setConfirmUnloadPoints(false);
                data = JSON.parse(data);
                if(data.result)
                {
                    if(data.exchanged_latin && data.points > 0)
                    {
                        get_user_rewarded();
                        var x2_game = "";
                        if(data.previous_x2_game)
                        {
                            x2_game = $("#modal_exchange_message_3").text();
                        }else
                        {
                            x2_game = "";
                        }
                        
                        showModalAllAppsHTML($("#modal_exchange_message_1").text() + latin_points + " Latin points" + $("#modal_exchange_message_2").text() + new Intl.NumberFormat('en-US').format(data.points) + " " + app_client_message + " " + x2_game);
                        
                        //alert($("#modal_exchange_message_1").text() + latin_points + " Latin points" + $("#modal_exchange_message_2").text() + data.points + " " + app_client_message + " " + x2_game);
                    }
                    else if(!data.exchanged_latin && data.reason)
                    {
                        if(data.reason == 'not_enough_latin_points')
                        {
                            showModalAllAppsHTML($("#modal_exchange_message_4").text() + " Latin points.");
                        }
                        
                        //alert($("#modal_exchange_message_4").text() + " Latin points.");
                    }
                }
                
                setTimeout(function() {
                    $('#button_exchange').prop( "disabled", false );
                    $('#exchange_latin').prop( "disabled", false );
                }, 3000);
                //$("#refresh").click();

            }).fail(function() {
                setConfirmUnloadPoints(false);
                $('#button_exchange').prop( "disabled", false );
                $('#exchange_latin').prop( "disabled", false );
            });
        }else
        {
            $('#button_exchange').prop( "disabled", false );
            $('#exchange_latin').prop( "disabled", false );
        }
    }else
    {
        $('#button_exchange').prop( "disabled", false );
        $('#exchange_latin').prop( "disabled", false );
    }
}

function get_user_rewarded() {
    if(pi_user_id != "" && pi_user_code != "")
    {
        var data = {
                    'pi_user_id': pi_user_id,
                    'pi_user_code': pi_user_code,
                    'accessToken': accessToken,
                    'csrf_token': odoo.csrf_token,
                };
        //$.ajaxSetup({async: false});
        return $.post( "/get-user", data).done(function(data) {
            data = JSON.parse(data);
            if(data.result)
            {
                $("#pi_ad_counter").html(data.pi_ad_counter);
                $("#resting_time").html(data.resting_time);
                
                $("#user_tips").html(data.user_tips);
                
                if(data.unblocked)
                {
                    unblocked = data.unblocked;
                    
                    if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                    {
                        $(".total_points_latin").html(new Intl.NumberFormat('en-US').format(data.points_latin));
                        $(".total-points-latin-div").show();
                    }
                    
                    $("#user_points").html(new Intl.NumberFormat('en-US').format(data.points));
                    $("#user_points_per_game").html('<div>Latin points: ' + new Intl.NumberFormat('en-US').format(data.points_latin) + '</div>' +
                                                  '<br/><table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_last").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_last) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_wins").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_wins) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_datetime").html(data.points_datetime);
                }else{
                
                    if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                    {
                        $(".total_points_latin").html(new Intl.NumberFormat('en-US').format(data.points_latin));
                        $(".total-points-latin-div").show();
                    }
                    
                    $("#user_points").html(new Intl.NumberFormat('en-US').format(data.points));
                    $("#user_points_per_game").html('<div>Latin points: ' + new Intl.NumberFormat('en-US').format(data.points_latin) + '</div>' +
                                                  '<br/><table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_last").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_last) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_wins").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_wins) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_datetime").html(data.points_datetime);
                }
            }
            
        }).fail(function() {
        });
    }
}

function get_user() {
    if(pi_user_id != "" && pi_user_code != "")
    {
        var data = {
                    'pi_user_id': pi_user_id,
                    'pi_user_code': pi_user_code,
                    'accessToken': accessToken,
                    'csrf_token': odoo.csrf_token,
                };
        //$.ajaxSetup({async: false});
        return $.post( "/get-user", data).done(function(data) {
            data = JSON.parse(data);
            if(data.result)
            {
                if(data.complete_found)
                {
                    alert($("#payment_message").text());
                    window.location.reload(true);
                }
                
                $("#user_tips").html(data.user_tips);
                
                /*if(data.pi_user_code && data.pi_user_code == $("#pi_main_user").val())
                {
                    $("#accordionTwo").show();
                }*/
                    
                show_pi_ad_user = data.show_pi_ad;
                show_pi_ad_user_time = data.show_pi_ad_time;
                pi_ad_new = data.pi_ad_new;
                pi_ad_max = data.pi_ad_max;
                
                $("#pi_ad_counter").html(data.pi_ad_counter);
                $("#resting_time").html(data.resting_time);
                
                $("#pi_ad_hours").html(show_pi_ad_user_time);
                $("#pi_ad_max").html(pi_ad_max);
                
                $(".show-tetris").show();
                $(".show-mahjong").show();
                $(".show-bubble-shooter").show();
                $(".show-test-your-brain").show();
                $(".show-15-puzzle").show();
                $(".show-pingpong").show();
                $(".show-checkers").show();
                $(".show-xiangqi").show();
                $(".show-domino").show();
                $(".show-latincrush").show();
                $(".show-soccer-penalty").show();
                $(".show-rpggame").show();
                $(".show-gameslearning").show();
                $(".show-odoolearning").show();
                $(".show-languagelearning").show();
                $(".show-iqtest").show();
                $(".show-webtorrent").show();
                $(".show-musicplayer").show();
                $(".show-videoplayer").show();
                $(".show-imgplayer").show();
                $(".show-webcamplayer").show();
                $(".show-texttospeechplayer").show();
                $(".show-mapsplayer").show();
                $(".show-calcplayer").show();
                $(".show-calendarplayer").show();
                $(".show-timezoneplayer").show();
                //$(".show-newsplayer").show();
                $(".show-tvonline").show();
                //$(".show-sport-results").show();
                //$(".show-cointelegraph").show();
                $(".show-streamerzoneboard").show();
                //$(".show-stellarium").show();
                //$(".show-latin-search").show();
                //$(".show-latin-dictionary").show();
                //$(".show-latin-university").show();
                //$(".show-latin-books").show();
                //$(".show-latin-academy").show();
                
                if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                {
                    $(".show_pi_ad_automatic").show();
                    $("#pi_ad_automatic").prop("checked", data.pi_ad_automatic);
                }
                
                /*var options = $("#avatar_user");
                //don't forget error handling!
                var was_selected = false;
                $.each(data.avatar_user_options, function(index, item) {
                    if(data.avatar_user == index)
                    {
                        var was_selected = true;
                        options.append($("<option selected='true' />").val(index).text(item));
                    }
                    else
                        options.append($("<option />").val(index).text(item));
                });*/
                
                $("#avatar_user option[value="+ data.avatar_user +"]").prop("selected",true);
                
                if(!data.unblocked)
                {
                    $(".avatar_show_blocked").show();
                    $(".avatar_show_unblocked").hide();
                }else
                {
                    $(".avatar_show_blocked").hide();
                    $(".avatar_show_unblocked").show();
                }
                
                $("#avatar_user_img_div").html('<img src="' + data.avatar_user_url + '" alt="LatinChain" class="img-fluid" style="max-width: 350px; border-radius: 25px;" width="100%" height="170px" />');
                $("#avatar_user").show();
                $("#avatar_user_img_div").show();
                
                passkey=data.passkey;
                if(data.unblocked)
                {
                    unblocked = data.unblocked;
                    
                    /*if(["Mainnet ON"].includes($("#mainnet").val()))
                    {
                        $(".getverified").hide();
                        $(".isverified").show();
                    }*/
                    
                    if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                    {
                        $(".total_points_latin").html(new Intl.NumberFormat('en-US').format(data.points_latin));
                        $(".total-points-latin-div").show();
                    }
                    
                    $(".getverified").hide();
                    $(".isverified").show();
                    $(".isverified-username").html(data.pi_user_code);
                    $(".isverified-username").show();
                    
                    if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                    {
                        $("#pi_ad_automatic").prop("disabled", false);
                    }
                    
                    $("#avatar_user").prop("disabled", false);
                
                    $("#verified").html(" (" + $("#verified_message").html() + ", " + data.unblocked_datetime + ")");
                    $("#verified").show();
                    
                    var winner = "";
                    if(data.im_winner)
                        winner = $("#winner_message").html();
                    
                    $("#user_logged").html(data.pi_user_code);
                    $(".div_user_status").addClass("p-3 mb-2 bg-secondary bg-gradient text-white rounded");
                    $(".user_status").html("(" + $("#verified_message").html() + ", " + data.unblocked_datetime + "). " + $("#available_days_message").text() + data.days_available + winner);
                    $(".user_status_account").html("(" + $("#verified_message").html() + ", " + data.unblocked_datetime + "). " + $("#available_days_message").text() + data.days_available + winner);
                    $( "<br/>" ).insertAfter( ".user_status_account" );
                    $("#user_points").html(new Intl.NumberFormat('en-US').format(data.points));
                    $("#user_points_per_game").html('<div>Latin points: ' + new Intl.NumberFormat('en-US').format(data.points_latin) + '</div>' +
                                                  '<br/><table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_last").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_last) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_wins").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_wins) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_datetime").html(data.points_datetime);
                    //$("#pi_wallet_address").val(data.pi_wallet_address);
                    $("#streaming_url").val(data.streaming_url);
                    $("#referrer_code").val(data.referrer_code);
                    
                    $("#button_click").prop( "disabled", false );
                    $("#button_exchange").prop( "disabled", false );
                    $("#exchange_latin").prop( "disabled", false );
                    
                    //$("#pi_wallet_address").prop( "disabled", false );
                    $("#streaming_url").prop( "disabled", false );
                    
                    $("#button_click_referrer").prop( "disabled", false );
                    $("#referrer_code").prop( "disabled", false );
                    
                    $("#button_click_memo").prop( "disabled", false );
                    $("#memo_id").prop( "disabled", false );
                }else{
                    $(".getverified").show();
                    $(".isverified").hide();
                    $(".isverified-username").hide();
                    
                    if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                    {
                        $(".total_points_latin").html(new Intl.NumberFormat('en-US').format(data.points_latin));
                        $(".total-points-latin-div").show();
                    }
                    
                    $("#user_logged").html(data.pi_user_code);
                    $(".div_user_status").addClass("p-3 mb-2 bg-secondary bg-gradient text-white rounded");
                    $(".user_status").html($("#not_verified_1_message").text() + data.amount + " Pi. " + $("#not_verified_2_message").text());
                    $(".user_status_account").html($("#not_verified_1_message").text() + data.amount + " Pi. " + $("#not_verified_2_message").text());
                    $( "<br/>" ).insertAfter( ".user_status_account" );
                    $("#user_points").html(new Intl.NumberFormat('en-US').format(data.points));
                    $("#user_points_per_game").html('<div>Latin points: ' + new Intl.NumberFormat('en-US').format(data.points_latin) + '</div>' +
                                                  '<br/><table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_last").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_last) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_last) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_wins").html('<table class="table text-white table-hover table-dark" style="word-break: break-word;" translate="no">' +
                                                  '<thead>' +
                                                    '<tr>' +
                                                      '<td>Chess</td>'+
                                                      '<td>Snake</td>'+
                                                      '<td>Sudoku</td>'+
                                                    '</tr>'+
                                                  '</thead>'+
                                                  '<tbody>'+
                                                    '<tr>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_chess_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_snake_wins) + '</td>' +
                                                      '<td>' + new Intl.NumberFormat('en-US').format(data.points_sudoku_wins) + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_datetime").html(data.points_datetime);
                    //$("#pi_wallet_address").val(data.pi_wallet_address);
                    $("#streaming_url").val(data.streaming_url);
                    $("#referrer_code").val(data.referrer_code);
                    
                    $("#button_click").prop( "disabled", true );
                    $("#button_exchange").prop( "disabled", true );
                    $("#exchange_latin").prop( "disabled", true );
                    //$("#pi_wallet_address").prop( "disabled", false );
                    $("#streaming_url").prop( "disabled", true );
                    $("#referrer_code").prop( "disabled", true );
                    
                    $("#button_click_memo").prop( "disabled", false );
                    $("#memo_id").prop( "disabled", false );
                }
            }
            
        }).fail(function() {
        });
    }
}

async function showPiInterstitialAds(Pi, url) {
    
    $(".show_test_app").hide();
    $(".show_test_app_loading").show();
    $("#button_reward_ad").prop( "disabled", true );
    $("#button_reward_ad").html("Showing Pi Interstitial Ad...");
    
    try {
        accessed_interstitial = false;
        
        setTimeout(function(){
            if(accessed_interstitial == false && pi_user_code == "" && pi_user_id == "")
            {
                if(url && url != false && url != undefined)
                {
                    //openInNewTab(url);
                    //window.location.href = url;
                }
                
                $("#button_reward_ad").html(btnvalue);
                
                if((pi_user_id != "" && pi_user_code != "") && (show_pi_ad_user || pi_ad_new))
                {
                    $(".show_test_app").show();
                    $(".show_test_app_loading").hide();
                    $("#button_reward_ad").prop( "disabled", false );
                }
                
                return;
            }
        }, 15000);
        
        const isAdReadyResponse = await Pi.Ads.isAdReady("interstitial");

        if (isAdReadyResponse.ready === false) {
            await Pi.Ads.requestAd("interstitial");
        }
        
        accessed_interstitial = true;
        
        const showAdResponse = await Pi.Ads.showAd("interstitial");
        
        if(showAdResponse.result == "AD_CLOSED")
        {
        }
        
        if(url && url != false && url != undefined)
        {
            //openInNewTab(url);
            //window.location.href = url;
        }
        
        $("#button_reward_ad").html(btnvalue);
        if((pi_user_id != "" && pi_user_code != "") && (show_pi_ad_user || pi_ad_new))
        {
            $(".show_test_app").show();
            $(".show_test_app_loading").hide();
            $("#button_reward_ad").prop( "disabled", false );
        }
        //$("#button_reward_ad").prop( "disabled", false );
        
    } catch (err) {
        $("#button_reward_ad").html(btnvalue);
        if((pi_user_id != "" && pi_user_code != "") && (show_pi_ad_user || pi_ad_new))
        {
            $(".show_test_app").show();
            $(".show_test_app_loading").hide();
            $("#button_reward_ad").prop( "disabled", false );
        }
        
        if(url && url != false && url != undefined)
        {
            //openInNewTab(url);
            //window.location.href = url;
        }
        //$("#button_reward_ad").prop( "disabled", false );
        //alert(err);
        // Not able to fetch the user
    }
}

async function showPiAds(Pi, activated) {
    
    $(".show_test_app").hide();
    $(".show_test_app_loading").show();
    $("#button_reward_ad").prop( "disabled", true );
    $("#button_reward_ad").html("Showing Pi Interstitial Ad...");
    
    try {
        var d1 = new Date();
        var date1 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
        var date2 = new Date(date1.getTime() - 10 * 60000);
        
        if(localStorage && localStorage['pi_ad_datetime_latinchain'] > date2.getTime() && activated)
        {
            $(".show_test_app").show();
            $(".show_test_app_loading").hide();
            $("#button_reward_ad").html(btnvalue);
            $("#button_reward_ad").prop( "disabled", false );
            //$("#button_reward_ad").prop( "disabled", false );
            return "datetime-not-meet";
        }
        
        $("#button_reward_ad").html(btnvalue);
        
        const isAdReadyResponse = await Pi.Ads.isAdReady("interstitial");
        
        $(".show_test_app").hide();
        $(".show_test_app_loading").show();
        $("#button_reward_ad").html("Showing Pi Interstitial Ad...");

        if (isAdReadyResponse.ready === false) {
            await Pi.Ads.requestAd("interstitial");
        }
        
        const showAdResponse = await Pi.Ads.showAd("interstitial");
        
        if(showAdResponse.result == "AD_CLOSED")
        {
            var d1 = new Date();
            var date1 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());

            localStorage['pi_ad_datetime_latinchain'] = date1.getTime();
            
            /*var gemini_image = getGeminiImage();
            $(".modal-body").html("<img src='" + gemini_image + "' class='rounded' style='max-width: 200px; max-height: 200px'/><br/>" + $("#modal_not_rewarded_message").text());
            
            $("#open_modal").click();*/
        }
        
        $(".show_test_app").show();
        $(".show_test_app_loading").hide();
        $("#button_reward_ad").prop( "disabled", false );
        $("#button_reward_ad").html(btnvalue);
        return true;
        //$("#button_reward_ad").prop( "disabled", false );
    } catch (err) {
        $(".show_test_app").show();
        $(".show_test_app_loading").hide();
        $("#button_reward_ad").prop( "disabled", false );
        $("#button_reward_ad").html(btnvalue);
        //$("#button_reward_ad").prop( "disabled", false );
        //alert(err);
        // Not able to fetch the user
    }
    
    $(".show_test_app").show();
    $(".show_test_app_loading").hide();
    $("#button_reward_ad").prop( "disabled", false );
    $("#button_reward_ad").html(btnvalue);
    return false;
}

function copyToClipboard(text) {
    var sampleTextarea = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = text; //save main text in it
    sampleTextarea.select(); //select textarea contenrs
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
}

$( document ).ready(function() {
    
    $(".numeric-decimal").on("keypress keyup blur",function (event) {
        //this.value = this.value.replace(/[^0-9\.]/g,'');
        //$(this).val($(this).val().replace(/[^0-9\.]/g,''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    
    /*const video_latinchain = document.getElementById('loading-message-video');
    video_latinchain.style.display="block";
    video_latinchain.width=250;
    video_latinchain.height=150;*/
    
    btnvalue = $("#button_reward_ad").html();
    
    /*
       colorboxLoaded();
       $(".modal-body").html("");
       $("#open_modal").click();
     */
     
    $(".copy_referrer_link").click(function(){
        if($("#username").html().trim() == "")
            copyToClipboard("https://latinchain.pinet.com/pinetwork");
        else
            copyToClipboard("https://latinchain.pinet.com/pinetwork/" + $("#username").html().trim());
    });
    
    $(".copy_referrer_username").click(function(){
        if($("#username").html().trim() == "")
            alert("You have to login on Pi Browser first.");
        else
            copyToClipboard($("#username").html().trim());
    });
    
    async function shareReferrerMessage()
    {
        var link_referrer = "";
        var username_referrer = "";
        if($("#username").html().trim() == "")
        {
            link_referrer = "https://latinchain.pinet.com/pinetwork/rockcesar";
            username_referrer = "rockcesar";
        }
        else
        {
            link_referrer = "https://latinchain.pinet.com/pinetwork/" + $("#username").html().trim();
            username_referrer = $("#username").html().trim();
        }
        
        const shareData = {
            title: 'LatinChain Platform',
            text: $("#share_referrer_latinchain_message").text() + " #LatinChain #PiApps #PiNetwork \n\nLatinChain referral link:\n" + link_referrer + "\nReferral username:\n" + username_referrer,
            //url: 'https://latin-chain.com/',
        }
        
        if (!navigator.share) {
            Pi.openShareDialog(shareData.title, shareData.text);
        }else
        {
          try {
            await navigator.share(shareData);
            //resultPara.textContent = 'MDN shared successfully'
          } catch(err) {
            //alert('Error: ' + err);
          }
        }
    }
    
    $(".share_referrer_message").click(async () => {
        shareReferrerMessage();
    });
    
    //colorboxLoaded();
    
    const STORAGE_KEY_MAINSCREEN = 'speech_synthesis_active';
    
    if (localStorage.getItem(STORAGE_KEY_MAINSCREEN) !== 'true'){ // || !('speechSynthesis' in window)) {
        $('#pi_automatic_accessibility').prop('checked', false);
        //speechModule.deactivate();
    }else
    {
        $('#pi_automatic_accessibility').prop('checked', true);
        //speechModule.activate();
    }
    
    $('#pi_automatic_accessibility').change(function() {
        var pi_automatic_accessibility = $("#pi_automatic_accessibility").is(":checked");
        
        if(pi_automatic_accessibility)
        {
            speechModule.activate();
        }
        else
        {
            speechModule.deactivate();
        }
    });
    
    window.addEventListener('unhandledrejection', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    });
    
    var startTime=new Date(), endTime=new Date(), seconds=0;

    function start() {
      startTime = new Date();
    };

    function end() {
      endTime = new Date();
      var timeDiff = endTime - startTime; //in ms
      // strip the ms
      timeDiff /= 1000;

      // get seconds 
      seconds = Math.round(timeDiff);
    }

    var start_flag = false;
    
    async function showRewardedPiAd()
    {
        end();
        if(seconds < 5 && start_flag)
        {
            start();
            return;
        }
        start();
        
        if(!start_flag)
        {
            start_flag = true;
        }
        
        $(".show_test_app").hide();
        $(".show_test_app_loading").show();
        $("#button_reward_ad").prop( "disabled", true );
        $("#button_reward_ad").html("Showing Pi Rewarded Ad...");
        
        if(pi_user_id != "" && pi_user_code != "" && pi_ad_new)
        {
            try {
                
                const isAdReadyResponse = await Pi.Ads.isAdReady("rewarded");
                if (isAdReadyResponse.ready === false) {
                    
                    const requestAdResponse = await Pi.Ads.requestAd("rewarded");
                    if (requestAdResponse.result === "ADS_NOT_SUPPORTED") {
                        // display modal to update Pi Browser
                        // showAdsNotSupportedModal()
                        alert("Update Pi Browser version, please!.");
                        $(".show_test_app").show();
                        $(".show_test_app_loading").hide();
                        $("#button_reward_ad").html(btnvalue);
                        $("#button_reward_ad").prop( "disabled", false );
                        return;
                    }
                    if (requestAdResponse.result !== "AD_LOADED") {
                        // display modal ads are temporarily unavailable and user should try again later
                        // showAdUnavailableModal()
                        alert("Ads are temporarily unavailable, try again later!.");
                        $(".show_test_app").show();
                        $(".show_test_app_loading").hide();
                        $("#button_reward_ad").html(btnvalue);
                        $("#button_reward_ad").prop( "disabled", false );
                        return;
                    }
                }
                
                const showAdResponse = await Pi.Ads.showAd("rewarded");
                
                if (showAdResponse.result === "AD_REWARDED") {
                    await delayAsync(2000);
                    if(pi_user_id != "" && pi_user_code != "" && showAdResponse.adId)
                    {
                        $(".show_test_app").hide();
                        $(".show_test_app_loading").show();
                        $("#button_reward_ad").prop( "disabled", true );
                        $("#button_reward_ad").html("Verifying...");
                        //alert($("#ready_reward_message").text());
                        var data = {
                            'pi_user_id': pi_user_id,
                            'pi_user_code': pi_user_code,
                            'adId': showAdResponse.adId,
                            'passkey': passkey,
                            'accessToken': accessToken,
                            'csrf_token': odoo.csrf_token,
                        };
                        //$.ajaxSetup({async: false});
                        setConfirmUnloadPoints(true);
                        return $.post( "/set-latin-points", data).done(function(data) {
                            end();
                            setConfirmUnloadPoints(false);
                            data = JSON.parse(data);
                            if(data.result && data.points_latin > 0)
                            {
                                $('.darkmode-toggle').css('display', 'block');
                                if($('.darkmode-toggle--white').length === 0)
                                    $('.darkmode-layer--button').css('display', 'block');
                                else
                                    $('.darkmode-toggle--white').css('display', 'block');
                                document.getElementById('blockingOverlay').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                                document.getElementById('paying-message').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                                document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                                document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                                
                                var gemini_image = getGeminiImage();
                                
                                if(data.x2_game)
                                    showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 150px; max-height: 150px'/>" + $(".modal-body").text() + "<br/>" + $("#modal_x2_game_message").text());
                                else
                                    showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 150px; max-height: 150px'/>" + $("#modal_reward_message").text() + new Intl.NumberFormat('en-US').format(data.points_latin) + " Latin points.");
                                
                                $(".show_test_app").hide();
                                $(".show_test_app_loading").show();
                                $("#button_reward_ad").prop( "disabled", true );
                                $("#button_reward_ad").html("+" + new Intl.NumberFormat('en-US').format(data.points_latin) + " Latin points.");
                                
                                /*setTimeout(function ()
                                {
                                    $("#button_reward_ad").html(btnvalue);
                                    $("#button_reward_ad").prop( "disabled", false );
                                }, 5000);*/
                                
                                pi_ad_new = data.pi_ad_new;
                                if(data.pi_ad_new)
                                {
                                    $("#button_reward_ad").show();
                                    $("#piad_not_available").hide();
                                    setTimeout(function ()
                                    {
                                        $(".show_test_app").show();
                                        $(".show_test_app_loading").hide();
                                        $("#button_reward_ad").html(btnvalue);
                                        $("#button_reward_ad").prop( "disabled", false );
                                    }, 5000);
                                }else
                                {
                                    $("#button_reward_ad").hide();
                                    $("#piad_not_available").show();
                                    setTimeout(function ()
                                    {
                                        $(".show_test_app").show();
                                        $(".show_test_app_loading").hide();
                                        $("#button_reward_ad").html(btnvalue);
                                        $("#button_reward_ad").prop( "disabled", false );
                                    }, 5000);
                                }
                                
                                get_user_rewarded();
                            }else{
                                //$("#button_reward_ad").html("Error, try again...");
    
                                setTimeout(function ()
                                {
                                    $(".show_test_app").show();
                                    $(".show_test_app_loading").hide();
                                    $("#button_reward_ad").html(btnvalue);
                                    $("#button_reward_ad").prop( "disabled", false );
                                }, 5000);
                                
                                var gemini_image = getGeminiImage();
                                
                                showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 200px; max-height: 200px'/>" + $("#modal_not_latin_rewarded_message").text() + " (No points shared Error) Result: " + data.result);
                                
                            }
                            start();
                        }).fail(function() {
                            $("#button_reward_ad").html("Fail, try again...");
    
                            setTimeout(function ()
                            {
                                $(".show_test_app").show();
                                $(".show_test_app_loading").hide();
                                $("#button_reward_ad").html(btnvalue);
                                $("#button_reward_ad").prop( "disabled", false );
                            }, 5000);
                            setConfirmUnloadPoints(false);
                            
                            var gemini_image = getGeminiImage();
                            
                            showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 200px; max-height: 200px'/>" + $("#modal_not_latin_rewarded_message").text() + " (Post failed Error)");
                            
                        });
                    }else{
                        $(".show_test_app").show();
                        $(".show_test_app_loading").hide();
                        $("#button_reward_ad").html(btnvalue);
                        $("#button_reward_ad").prop( "disabled", false );
                        
                        var gemini_image = getGeminiImage();
                        
                        showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 200px; max-height: 200px'/>" + $("#modal_not_latin_rewarded_message").text() + " (adId Error)");
                        
                    }
                } else {
                    $(".show_test_app").show();
                    $(".show_test_app_loading").hide();
                    $("#button_reward_ad").html(btnvalue);
                    $("#button_reward_ad").prop( "disabled", false );
                    // fallback logic
                    // showAdErrorModal()
                    var gemini_image = getGeminiImage();
                    
                    showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 200px; max-height: 200px'/>" + $("#modal_not_latin_rewarded_message").text() + " (AD_REWARDED Error)");
                    
                }
                
            } catch (err) {
                $(".show_test_app").show();
                $(".show_test_app_loading").hide();
                $("#button_reward_ad").html(btnvalue);
                $("#button_reward_ad").prop( "disabled", false );
                // good practice to handle any potential errors
                
                var gemini_image = getGeminiImage();
                
                showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 200px; max-height: 200px'/>" + $("#modal_not_latin_rewarded_message").text() + " (try-catch Error) " + err);
                
            }
        }else
        {
            $(".show_test_app").show();
            $(".show_test_app_loading").hide();
            $("#button_reward_ad").html(btnvalue);
            $("#button_reward_ad").prop( "disabled", false );
        }
    }
    
    if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
    {
        $("#exchange_latin > option").each(function() {
            if(location.pathname.substring(0, 3) == "/es")
            {
                var value = $(this).val();
                if(value == "Chess10x1")
                {
                    $(this).text("Paga 10 Latin points, gana 1 Chess points");
                }
                else if(value == "Sudoku10x3")
                {
                    $(this).text("Paga 10 Latin points, gana 3 Sudoku points");
                }
                else if(value == "Snake10x1")
                {
                    $(this).text("Paga 10 Latin points, gana 1 Snake points");
                }
                else if(value == "Chess100x10")
                {
                    $(this).text("Paga 100 Latin points, gana 10 Chess points");
                }
                else if(value == "Sudoku100x12")
                {
                    $(this).text("Paga 100 Latin points, gana 12 Sudoku points");
                }
                else if(value == "Snake100x10")
                {
                    $(this).text("Paga 100 Latin points, gana 10 Snake points");
                }
            }
        });
    }
    
    //$('#profile-tab').tab('show');
    
    const contactTabTrigger = document.getElementById('user-tab');
    const tab = new bootstrap.Tab(contactTabTrigger);

    // Or, if you want to show it via a button click, for example:
    $('.go-to-user-tab').on('click', function (e) {
        tab.show();
        window.location.href="#pay_with";
    });
    
    const appsTabTrigger = document.getElementById('home-tab');
    const tabApps = new bootstrap.Tab(appsTabTrigger);

    // Or, if you want to show it via a button click, for example:
    $('.go-to-home-tab').on('click', function (e) {
        tabApps.show();
        window.location.href="#pay_with";
    });
    
    /*
    $(".go-to-user-tab").click(function(){
        //$('#user-tab').tab('show');
        $('.nav-pills a[href="#user-tab"]').tab('show');
        $('.nav-pills a[href="#user-tab"]').click();
        window.location.href="#pay_with";
    });
    */
    
    $(".open_streaming").click(function(){
        var streaming_url = validateYouTubeUrl($(this).attr("videourl"));
        streaming_url = streaming_url[1];
        $.colorbox({fixed: true, width: "80%", height: "80%", maxWidth: "80%", maxHeight: "80%", html:'<iframe id="latin-chain" width="100%" height="100%" src="https://www.youtube.com/embed/' + streaming_url + '?autoplay=1&amp;loop=1" frameborder="0" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe>'});
    });
    
    $(".open_streaming_playlist").click(function(){
        var streaming_url = $(this).attr("videourl");
        $.colorbox({fixed: true, width: "80%", height: "80%", maxWidth: "80%", maxHeight: "80%", html:'<iframe id="latin-chain" width="100%" height="100%" src="' + streaming_url + '&amp;autoplay=1&amp;loop=1" frameborder="0" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe>'});
    });
    
    /*$( ".askanexpert" ).click(function() {
        $.colorbox({href:"/askanexpert/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    
    $( ".partners" ).click(function() {
        $.colorbox({fixed: true, href:"/latinchain-partners/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".latinchain-token" ).click(function() {
        $.colorbox({fixed: true, href:"/latinchain-token/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });

    /*(adsbygoogle = window.adsbygoogle || []).push({});
    (adsbygoogle = window.adsbygoogle || []).push({});
    (adsbygoogle = window.adsbygoogle || []).push({});*/
    //$("#a-ads").prop('src', $("#a_ads_val").val());
    /*$("#a-ads_2").prop('src', $("#a_ads_val_2").val());
    $("#a-ads_3").prop('src', $("#a_ads_val_3").val());*/
    $("#latin-chain").prop('src', 'https://www.youtube.com/embed/9KqcyAoCZzo');
    //$("#crypto_news").prop('src', 'https://www.youtube.com/embed/videoseries?list=PLmedLgLFYxR3qX-vNpSf5gpblUqFVUtQs');
    $("#tiesto").prop('src', 'https://www.youtube.com/embed/videoseries?list=PLmedLgLFYxR2PhV-bmZ6spZ73etMbPSUq');

    var streaming_url = validateYouTubeUrl($("#pi_main_user_streaming_url").val());
    streaming_url = streaming_url[1];
    $("#latinchain-tv").prop('src', 'https://www.youtube.com/embed/'+streaming_url);
    
    //$("#latinchain-tv").prop('src', 'https://www.youtube.com/embed/videoseries?si=Jad786J0eb5c4NoN&amp;list=PLmedLgLFYxR3oFeslBQfZ0zb8GJuU3VQG');

    var status_audio = false;
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/website_pinetwork_games_odoo/static/src/music/music.mp3');
    audioElement.addEventListener('ended', function() {
        this.play();
    }, false);
    
    $('#exchange_latin').change(function() {
        var exchange_latin = $('#exchange_latin :selected').val();
        if(pi_user_id != "" && pi_user_code != "")
        {
            $('#show_exchange_value').html($('#exchange_latin :selected').text());
        }
    });
    
    $('#button_exchange').click(function() {
        var exchange_latin = $('#exchange_latin :selected').val();
        if(pi_user_id != "" && pi_user_code != "")
        {
            if(confirm($('#modal_exchange_message_5').text()))
            {
                set_points_exchange(exchange_latin);
            }
        }
    });
    
    $('#button_click').click(function() {
        var streaming_url = $("#streaming_url").val().trim();
        if(streaming_url.length > 150)
            alert($("#streaming_url_message").text());
        else if(streaming_url.length > 0 && !validateYouTubeUrl(streaming_url))
            alert($("#streaming_url_not_a_video").text());
        else if(pi_user_id != "" && pi_user_code != "")
        {
            $("#button_click").prop( "disabled", true );
            $("#streaming_url").prop( "disabled", true );
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'streaming_url': streaming_url,
                'passkey': passkey,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            //$.ajaxSetup({async: false});
            setConfirmUnloadPoints(true);
            $.post( "/set-streaming-url", data).done(function(data) {
                setConfirmUnloadPoints(false);
                data = JSON.parse(data);
                if(data.result)
                    alert($("#streaming_url_saved").text());
                //$("#refresh").click();
                $("#button_click").prop( "disabled", false );
                $("#streaming_url").prop( "disabled", false );
            }).fail(function() {
                setConfirmUnloadPoints(false);
                $("#button_click").prop( "disabled", false );
                $("#streaming_url").prop( "disabled", false );
            });
        }
    });
    
    $('#button_click_memo').click(function() {
        var memo_id = $("#memo_id").val().trim();
        if(memo_id.length > 50)
            alert($("#memo_message").text());
        else if(memo_id.length < 20)
            alert($("#memo_not_a_memo").text());
        else if(pi_user_id != "" && pi_user_code != "")
        {
            $("#button_click_memo").prop( "disabled", true );
            $("#memo_id").prop( "disabled", true );
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'memo_id': memo_id,
                'passkey': passkey,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            //$.ajaxSetup({async: false});
            setConfirmUnloadPoints(true);
            $.post( "/validate-memo", data).done(function(data) {
                setConfirmUnloadPoints(false);
                data = JSON.parse(data);
                if(data.result)
                    alert($("#memo_saved").text());
                else
                    alert($("#memo_not_saved").text());
                //$("#refresh").click();
                $("#button_click_memo").prop( "disabled", false );
                $("#memo_id").prop( "disabled", false );
            }).fail(function() {
                setConfirmUnloadPoints(false);
                $("#button_click_memo").prop( "disabled", false );
                $("#memo_id").prop( "disabled", false );
            });
        }
    });
    
    $("#avatar_user").change(function() {
        
        var avatar_user = $('#avatar_user :selected').val();
        
        if(pi_user_id != "" && pi_user_code != "" && unblocked)
        {
            $("#avatar_user").prop( "disabled", true );
            
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'avatar_user': avatar_user,
                'passkey': passkey,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            //$.ajaxSetup({async: false});
            setConfirmUnloadPoints(true);
            $.post( "/avatar-user", data).done(function(data) {
                setConfirmUnloadPoints(false);
                data = JSON.parse(data);
                if(data.result)
                {
                    showModalAllAppsHTML($("#modal_latinchain_avatar_saved").text());
                    
                    $("#avatar_user_img_div").html('<img src="' + data.avatar_user_url + '" alt="LatinChain" class="img-fluid" style="max-width: 350px; border-radius: 25px;" width="100%" height="170px" />');
                    $("#avatar_user_img_div").show();
                }
                
                //$("#refresh").click();
                setTimeout(function() {
                  $("#avatar_user").prop( "disabled", false );
                }, 3000);
                
            }).fail(function() {
                setConfirmUnloadPoints(false);
                $("#avatar_user").prop( "disabled", false );
            });
        }
    });
    
    $('#pi_ad_automatic').change(function() {
        var pi_ad_automatic = $("#pi_ad_automatic").is(":checked");
        
        if(pi_user_id != "" && pi_user_code != "" && unblocked)
        {
            $("#pi_ad_automatic").prop( "disabled", true );
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'pi_ad_automatic': pi_ad_automatic,
                'passkey': passkey,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            //$.ajaxSetup({async: false});
            setConfirmUnloadPoints(true);
            $.post( "/pi-ad-automatic", data).done(function(data) {
                setConfirmUnloadPoints(false);
                data = JSON.parse(data);
                if(data.result)
                {
                    if(data.pi_ad_automatic)
                    {
                        showModalAllAppsHTML("<i class='fa-solid fa-square-check'></i> " + $("#modal_pi_ad_automatic_enabled").text());
                    }else
                    {
                        showModalAllAppsHTML("<i class='fa-solid fa-square-xmark'></i> " + $("#modal_pi_ad_automatic_disabled").text());
                    }
                }
                
                //$("#refresh").click();
                setTimeout(function() {
                  $("#pi_ad_automatic").prop( "disabled", false );
                }, 3000);
                
            }).fail(function() {
                setConfirmUnloadPoints(false);
                $("#pi_ad_automatic").prop( "disabled", false );
            });
        }
    });
    
    $('#button_click_referrer').click(function() {
        var referrer_code = $("#referrer_code").val().trim();
        if(referrer_code.length > 150)
            alert($("#referrer_code_message").text());
        else if(pi_user_id != "" && pi_user_code != "")
        {
            $("#button_click_refferer").prop( "disabled", true );
            $("#refferer_code").prop( "disabled", true );
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'referrer_code': referrer_code,
                'passkey': passkey,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            //$.ajaxSetup({async: false});
            setConfirmUnloadPoints(true);
            $.post( "/set-referrer-code", data).done(function(data) {
                setConfirmUnloadPoints(false);
                data = JSON.parse(data);
                if(data.result)
                    alert($("#referrer_code_saved").text());
                else
                    $("#referrer_code").val("");
                    
                //$("#refresh").click();
                $("#button_click_referrer").prop( "disabled", false );
                $("#referrer_code").prop( "disabled", false );
            }).fail(function() {
                setConfirmUnloadPoints(false);
                $("#button_click_referrer").prop( "disabled", false );
                $("#referrer_code").prop( "disabled", false );
            });
        }
    });
    
    $('#play').click(function() {
        if(!status_audio)
        {
            audioElement.play();
            status_audio = true;
            $(this).removeClass("fa-volume-off");
            $(this).addClass("fa-volume-up");
            //$("#play").attr('src','/website_pinetwork_games_odoo/static/src/music/music.png');
        }
        else
        {
            audioElement.pause();
            status_audio = false;
            $(this).removeClass("fa-volume-up");
            $(this).addClass("fa-volume-off");
            //$("#play").attr('src','/website_pinetwork_games_odoo/static/src/music/mute.png');
        }
    });

    $(document).ajaxStop(function() {
        $("#loading_word").hide();
        $("#loading_word_under").hide();
    });

    $("#verified").hide();
    
    async function displayAds()
    {
        if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
        {
            if(pi_user_id != "" && pi_user_code != "")
            {
                if(pi_ad_new)
                {
                    (async () => {
                        showRewardedPiAd();
                    })();
                }
                else if(show_pi_ad_user_time == 0 && pi_ad_max == 0)
                {
                    alert("Pi ads not fully loaded. Try again.");
                }
                else
                {
                    alert($("#piad_not_available").text().trim());
                }
            }else if(!localStorage.getItem("loggedIn"))
            {
                alert("This button only works if you're logged in, inside Pi Browser. Reload this page to login.");
            }else
            {
                //$(".PiBrowserLink").show();
                alert("This button only works inside Pi Browser.");
            }
        }
        else
        {
            alert("This button only works on Mainnet inside Pi Browser.");
        }
    }
    
    $( ".displayAds" ).click(async function() {
        displayAds();
    });
    
    async function auth() {
        try {
            
            // Identify the user with their username / unique network-wide ID, and  qget permission to request payments from them.
            const scopes = ['username', 'payments', 'wallet_address'];
            function onIncompletePaymentFound(payment) {
                
                try {
                    var txid = payment.transaction.txid;
                } catch (e) {
                    var txid = "";
                }
                
                var data = {
                        'action': 'complete',
                        'paymentId': payment.identifier,
                        'txid': txid,
                        'app_client': 'auth_example',
                        'csrf_token': odoo.csrf_token,
                        'accessToken': accessToken,
                        'pi_user_code': pi_user_code,
                        'pi_user_id': pi_user_id,
                    };
                
                $("#button_tip").prop( "disabled", true );
                
                setConfirmUnloadPoints(true);
                return $.post( "/pi-api", data).done(function(data) {
                    setConfirmUnloadPoints(false);
                    $("#button_tip").prop( "disabled", false );
                    try {
                        data = JSON.parse(data);
                        if(data.result && data.completed)
                        {
                            alert($("#payment_message").text());
                            
                            get_user_rewarded();
                            
                            $('.darkmode-toggle').css('display', 'block');
                            if($('.darkmode-toggle--white').length === 0)
                                $('.darkmode-layer--button').css('display', 'block');
                            else
                                $('.darkmode-toggle--white').css('display', 'block');
                            
                            document.getElementById('blockingOverlay').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                            document.getElementById('paying-message').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                            document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                        }
                    } catch (e) {
                    }
                }).fail(function() {
                    setConfirmUnloadPoints(false);
                    $("#button_tip").prop( "disabled", false );
                });
            }; // Read more about this in the SDK reference

            $("#loading_word").show();
            $("#loading_word_under").show();
            
            setTimeout(function() {
              $("#loading_word").hide();
              $("#loading_word_under").hide();
            }, 5000);

            Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                pi_user_id = auth.user.uid;
                pi_user_code = auth.user.username;
                accessToken = auth.accessToken;
                $("#username").html(" " + auth.user.username);
                
                $(".referrer_username").html("<strong>" + auth.user.username + "</strong>");
                
                leaderboard = "/get-points/" + auth.user.username;
                winnerboard = "/get-top10-zone/" + auth.user.username;
                winnerzoneboard = "/get-winners-zone/" + auth.user.username;
                streamerzoneboard = "/get-streamers-zone/" + auth.user.username;
                generalranking = "/get-general-ranking/" + auth.user.username;
                
                $( ".certification" ).click(function() {
                    $.colorbox({fixed: true, href:"/latinchain-certification/" + auth.user.username, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
                });
                
                $( ".div-certification" ).show();
                
                if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                {
                    $(".MainnetLink").prop('href', '/pinetwork');
                    $(".MainnetLink").prop('target', '_self');
                }
                
                $(".PayPiLink").prop('href', '/pinetwork');
                $(".PayPiLink").prop('target', '_self');
                
                /*$("#leaderboard").attr("href", "/get-points/" + auth.user.username);
                $("#winnerboard").attr("href", "/get-top10-zone/" + auth.user.username);
                $("#winnerzoneboard").attr("href", "/get-winners-zone/" + auth.user.username);*/

                //get_user();
                set_points(0).always(function(){
                    get_user().always(function(){
                        
                        if(!unblocked)
                        {
                            $(".PiBrowserLink").hide();
                            
                            //document.getElementById('PayPiLinkId1').style.display = 'flex';
                            /*$('.darkmode-toggle').css('display', 'none');
                            if($('.darkmode-toggle--white').length === 0)
                                $('.darkmode-layer--button').css('display', 'none');
                            else
                                $('.darkmode-toggle--white').css('display', 'none');*/
                            if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()) || (["Testnet ON", "Testnet OFF"].includes($("#mainnet").val()) && $("#nopopup").val() != false))
                            {
                                document.getElementById('blockingOverlay').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                                document.getElementById('paying-message').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                                document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                                document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            }
                            
                            showing_paying = true;

                            colorboxLoadedMainnet();
                        }else
                        {
                            if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()) || (["Testnet ON", "Testnet OFF"].includes($("#mainnet").val()) && $("#nopopup").val() != false))
                            {
                                //document.getElementById('PayPiLinkId1').style.display = 'none';
                                if(!is_open_tab && !is_open_tab_ads)
                                {
                                    $('.darkmode-toggle').css('display', 'block');
                                    if($('.darkmode-toggle--white').length === 0)
                                        $('.darkmode-layer--button').css('display', 'block');
                                    else
                                        $('.darkmode-toggle--white').css('display', 'block');
                                    document.getElementById('blockingOverlay').style.display = 'none'; // Use 'flex' instead of 'block'
                                    document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
                                    document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                                    document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                                }
                            }
                            
                            document.getElementById('GoForwardShow1').style.display = 'none';
                            
                        }
                        
                        if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                        {
                            if(show_pi_ad_user || pi_ad_new)
                            {
                                $(".show_test_app").show();
                                $(".show_test_app_loading").hide();
                                $("#button_reward_ad").show();
                                $("#piad_not_available").hide();
                                $("#button_reward_ad").prop( "disabled", false );
                            }else
                            {
                                $(".show_test_app").show();
                                $(".show_test_app_loading").hide();
                                $("#button_reward_ad").hide();
                                $("#piad_not_available").show();
                            }
                            
                            $( "#button_reward_ad" ).click(async function() {
                                displayAds();
                            });
                            
                            if(show_pi_ad_user && pi_ad_new && ["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                            {
                                $( "#rewardedad-open" ).click(async function() {
                                    showRewardedPiAd();
                                    
                                    $( "#rewardedad-close" ).click();
                                });
                                
                                showModalAllAppsHTML($("#rewarded_message_1").text() + "<br/><br/>" + $("#rewarded_message_2").text());
                                
                                //(async () => {
                                    //if(confirm($("#rewarded_message_1").text() + "\n\n" + $("#rewarded_message_2").text()))
                                    //    showRewardedPiAd();
                                //})();
                            }/*else if(!unblocked)
                            {
                                if($("#total_users_verified_count").val() < 400)
                                {
                                    if(confirm($("#MainnetLinkId1").text()))
                                        window.location.href="/pinetwork";
                                }
                            }*/
                        }
                    });
                });
            }).catch(function(error) {
                //Pi.openShareDialog("Error", error);
                //alert(err);
                console.error(error);
            });
        } catch (err) {
            //Pi.openShareDialog("Error", err);
            //alert(err);
            console.error(err);
            // Not able to fetch the user
        }
    }
    $(".referrer_username").html("");
    
    async function transfer() {
        try {
            var pi_user_referred = "rockcesar";
            const payment = Pi.createPayment({
              // Amount of π to be paid:
              amount: parseFloat($("#pi_donate").val()),
              // An explanation of the payment - will be shown to the user:
              memo: "Tip to support LatinChain", // e.g: "Digital kitten #1234",
              // An arbitrary developer-provided metadata object - for your own usage:
              metadata: { paymentType: "tip", pi_user_referred_by: pi_user_referred /* ... */ }, // e.g: { kittenId: 1234 }
            }, {
              // Callbacks you need to implement - read more about those in the detailed docs linked below:
              onReadyForServerApproval: function(paymentId) {
                  var data = {
                            'action': 'approve',
                            'paymentId': paymentId,
                            'txid': '',
                            'app_client': 'auth_platform',
                            'csrf_token': odoo.csrf_token,
                            'accessToken': accessToken,
                            'pi_user_code': pi_user_code,
                            'pi_user_id': pi_user_id,
                        };
                    
                    setConfirmUnload(true);
                  return $.post( "/pi-api", data).done(function(data) {
                        setConfirmUnload(false);
                        $("#button_tip").prop( "disabled", false );
                        try{
                            data = JSON.parse(data);
                            if(data.result && data.approved)
                            {
                                if(data.complete_found)
                                {
                                    alert($("#payment_message").text());
                                    window.location.reload(true);
                                }
                            }
                        } catch (e) {
                            }
                    }).fail(function() {
                        setConfirmUnload(false);
                        $("#button_tip").prop( "disabled", false );
                    });
              },
              onReadyForServerCompletion: function(paymentId, txid) {
                    var data = {
                        'action': 'complete',
                        'paymentId': paymentId,
                        "txid": txid,
                        'app_client': 'auth_platform',
                        'csrf_token': odoo.csrf_token,
                        'accessToken': accessToken,
                        'pi_user_code': pi_user_code,
                        'pi_user_id': pi_user_id,
                    };
                    
                    $("#button_tip").prop( "disabled", true );
                    
                    setConfirmUnload(true);
                    return $.post( "/pi-api", data).done(function(data) {
                        setConfirmUnload(false);
                        
                        $("#button_tip").prop( "disabled", false );
                        
                        data = JSON.parse(data);
                        
                        if(data.result && data.completed)
                        {
                            get_user_rewarded();
                            
                            var gemini_image = getGeminiImage();
                            
                            if(data.x2_game)
                                showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 150px; max-height: 150px'/>" + $(".modal-body").text() + "<br/>" + $("#modal_x2_game_message").text());
                            else
                                showModalAllAppsHTML("<img src='" + gemini_image + "' class='rounded' style='max-width: 150px; max-height: 150px'/>" + $("#modal_reward_message").text() + new Intl.NumberFormat('en-US').format(data.points_latin) + " Latin points.");
                            
                            $('.darkmode-toggle').css('display', 'block');
                            if($('.darkmode-toggle--white').length === 0)
                                $('.darkmode-layer--button').css('display', 'block');
                            else
                                $('.darkmode-toggle--white').css('display', 'block');
                            document.getElementById('blockingOverlay').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                            document.getElementById('paying-message').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                            document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                        }
                    }).fail(function() {
                        setConfirmUnload(false);
                        $("#button_tip").prop( "disabled", false );
                    });
              },
              onCancel: function(paymentId) { 
                  setConfirmUnload(false);
                  $("#button_tip").prop( "disabled", false ); /* ... */ },
              onError: function(error, payment) { 
                  setConfirmUnload(false);
                  $("#button_tip").prop( "disabled", false ); /* ... */ },
            });
        } catch(err) {
            setConfirmUnload(false);
            $("#button_tip").prop( "disabled", false );
            console.error(err);
            // Technical problem (eg network failure). Please try again
        }
    }
    
    function executepayment(){
        if($("#pi_donate").val().trim() == "" || parseFloat($("#pi_donate").val()) == 0)
        {
            alert("You need to set a value to send a tip.");
            return false;
        }
        
        if(parseFloat($("#pi_donate").val()) < parseFloat(0.01))
        {
            $("#pi_donate").val("0.01");
        }else if(parseFloat($("#pi_donate").val()) > parseFloat(6.28))
        {
            $("#pi_donate").val("6.28");
        }
        
        $("#button_tip").prop( "disabled", true );
        
        transfer();
    }
    
    $( "#button_tip" ).click(function() {
        if(pi_user_id != "" && pi_user_code != "")
        {
            executepayment();
        }else
        {
            alert("Access from Pi Browser to give us a tip.");
        }
    });
    
    $('.giving-tip').click(function() {
        $('#button_tip').click();
    });
    
    // you usually would check the ads support ahead of time and store the information
    (async () => {
        /*
        document.getElementById('blockingOverlay').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
        */
        
        try{
            await Pi.init({ version: "2.0", sandbox: $("#sandbox").val() });
        }catch(e){
        }
        
        $('.openUrlInSystemBrowserLC').click(function(e) {
            try{
                if(pi_user_id == "" && pi_user_code == "")
                {
                    $(this).prop("href", "https://ecosystem.pinet.com/apps/62e0897afd5e7a022ac34e5a");
                }else
                {
                    e.preventDefault();
                    
                    Pi.openUrlInSystemBrowser("https://ecosystem.pinet.com/apps/62e0897afd5e7a022ac34e5a");
                }
            }catch(e){
            }
        });
        
        $('.openUrlInSystemBrowserMEXCSignUp').click(function(e) {
            try{
                if(pi_user_id == "" && pi_user_code == "")
                {
                    $(this).prop("href", "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-latinchain");
                }else
                {
                    e.preventDefault();
                    
                    Pi.openUrlInSystemBrowser("https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-latinchain");
                }
            }catch(e){
            }
        });
        
        $('.openUrlInSystemBrowserMEXCTrade').click(function(e) {
            try{
                if(pi_user_id == "" && pi_user_code == "")
                {
                    $(this).prop("href", "https://www.mexc.com/exchange/Pi_USDT?shareCode=mexc-latinchain");
                }else
                {
                    e.preventDefault();
                    
                    Pi.openUrlInSystemBrowser("https://www.mexc.com/exchange/Pi_USDT?shareCode=mexc-latinchain");
                }
            }catch(e){
            }
        });
        
        document.getElementById('blockingOverlay').style.display = 'flex'; // Use 'flex' instead of 'block'
        document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('loading-message').style.display = 'flex'; // Use 'flex' instead of 'block'
        
        (async () => {
            if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
            {
                const nativeFeaturesList = await Pi.nativeFeaturesList();
                const adNetworkSupported = nativeFeaturesList.includes("ad_network");
                
                if(!adNetworkSupported)
                    alert("Update Pi Browser version, please!.");
            }
          // store adNetworkSupported for later use
        })();
    
        if(localStorage.getItem("loggedIn"))
        {
            auth();
            
            setTimeout(function ()
            {
                if(pi_user_id == "" && pi_user_code == "")
                    auth();
                    
                setTimeout(function ()
                {
                    if(!unblocked && !showing_paying)
                    {
                        //alert($("#pi_prowser_message").text());
                        
                        //document.getElementById('PayPiLinkId1').style.display = 'none';
                        /*$('.darkmode-toggle').css('display', 'none');
                        if($('.darkmode-toggle--white').length === 0)
                            $('.darkmode-layer--button').css('display', 'none');
                        else
                            $('.darkmode-toggle--white').css('display', 'none');
                        */
                        
                        if(!is_open_tab && !is_open_tab_ads)
                        {
                            document.getElementById('blockingOverlay').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                            document.getElementById('paying-message').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                            document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                        }

                        colorboxLoadedMainnet();
                    }
                }, 10000);
            }, 10000);
            $(".loggedin").show();
        }else{
            await delayAsync(1000);
            
            if(confirm($("#modal_login_latinchain_v2_message").text()))
            {
                auth();
                localStorage.setItem("loggedIn", true);
            
                setTimeout(function ()
                {
                    if(pi_user_id == "" && pi_user_code == "")
                        auth();
                    
                    setTimeout(function ()
                    {
                        if(!unblocked && !showing_paying)
                        {
                            //alert($("#pi_prowser_message").text());
                            
                            //document.getElementById('PayPiLinkId1').style.display = 'none'
                            /*$('.darkmode-toggle').css('display', 'none');
                            if($('.darkmode-toggle--white').length === 0)
                                $('.darkmode-layer--button').css('display', 'none');
                            else
                                $('.darkmode-toggle--white').css('display', 'none');
                            */
                            if(!is_open_tab && !is_open_tab_ads)
                            {
                                document.getElementById('blockingOverlay').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                                document.getElementById('paying-message').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                                document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                                document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            }

                            colorboxLoadedMainnet();
                        }
                    }, 10000);
                }, 10000);
                $(".loggedin").show();
            }else
            {
                //document.getElementById('PayPiLinkId1').style.display = 'none';
                if(!is_open_tab && !is_open_tab_ads)
                {
                    $('.darkmode-toggle').css('display', 'block');
                    if($('.darkmode-toggle--white').length === 0)
                        $('.darkmode-layer--button').css('display', 'block');
                    else
                        $('.darkmode-toggle--white').css('display', 'block');
                    document.getElementById('blockingOverlay').style.display = 'none'; // Use 'flex' instead of 'block'
                    document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
                    document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                    document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                }
                
                $(".loggedout").show();
                
                $(".getverified").show();
                $(".isverified").hide();
                $(".isverified-username").hide();
                
                if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                {
                    colorboxLoadedMainnet();
                }
            }
        }
        
        if(["Testnet ON", "Testnet OFF"].includes($("#mainnet").val()))
        {
            colorboxLoaded();
        }
        
        /*if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
        {
            $('.showInterstitialAd').find('a.btn').click(function(e) {
                if($(this).attr('target') != "_blank")
                {
                    if($('#pi_ad_automatic').is(':checked') && !unblocked) {
                        if(!$(this).hasClass("href-external"))
                        {
                            e.preventDefault();
                            showPiInterstitialAds(Pi, $(this).attr('href'));
                        }
                    }
                }
            });
            
            $('.showInterstitialAd').find('button.btn').click(function(e) {
                if($('#pi_ad_automatic').is(':checked') && !unblocked) {
                    if(!$(this).hasClass("href-external"))
                    {
                        showPiInterstitialAds(Pi, false);
                    }
                }
            });
        }*/
    
    })();
    
    $(".close_latinchain").click(function(){
        is_open_tab = false;
        is_open_tab_ads = false;
        
        //document.getElementById('PayPiLinkId1').style.display = 'none';
        $('.darkmode-toggle').css('display', 'block');
        if($('.darkmode-toggle--white').length === 0)
            $('.darkmode-layer--button').css('display', 'block');
        else
            $('.darkmode-toggle--white').css('display', 'block');
        
        document.getElementById('goforward-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('GoForwardShow1').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('GoForwardShow2').style.display = 'none'; // Use 'flex' instead of 'block'
        //document.getElementById('GoForwardShow3').style.display = 'none'; // Use 'flex' instead of 'block'
            
        document.getElementById('blockingOverlay').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('all-messages').style.display = 'flex'; // Use 'flex' instead of 'block'
        
    });
    
    $(".logout_latinchain").click(function(){
        if(confirm($("#modal_logout_latinchain_v2_message").text()))
        {
            //document.getElementById('PayPiLinkId1').style.display = 'none';
            $('.darkmode-toggle').css('display', 'block');
            if($('.darkmode-toggle--white').length === 0)
                $('.darkmode-layer--button').css('display', 'block');
            else
                $('.darkmode-toggle--white').css('display', 'block');
            document.getElementById('blockingOverlay').style.display = 'none'; // Use 'flex' instead of 'block'
            document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
            document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
            document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
            
            localStorage.removeItem("loggedIn");
            try {
                Cache.delete();
            } catch (err) {
                console.error(err);
            }
            try {
                window.location.reload(true);
            } catch (err) {
                console.error(err);
            }
        }
    });
    
    $(".login_latinchain").click(function(){
        //document.getElementById('PayPiLinkId1').style.display = 'none';
        /*$('.darkmode-toggle').css('display', 'none');
        if($('.darkmode-toggle--white').length === 0)
            $('.darkmode-layer--button').css('display', 'none');
        else
            $('.darkmode-toggle--white').css('display', 'none');
        */
        document.getElementById('blockingOverlay').style.display = 'flex'; // Use 'flex' instead of 'block'
        document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
        document.getElementById('loading-message').style.display = 'flex'; // Use 'flex' instead of 'block'
        
        auth();
        localStorage.setItem("loggedIn", true);
    
        setTimeout(function ()
        {
            if(pi_user_id == "" && pi_user_code == "")
                auth();
            
            setTimeout(function ()
            {
                if(!unblocked && !showing_paying)
                {
                    //alert($("#pi_prowser_message").text());
                    
                    if(!is_open_tab && !is_open_tab_ads)
                    {
                        //document.getElementById('PayPiLinkId1').style.display = 'none';
                        $('.darkmode-toggle').css('display', 'block');
                        if($('.darkmode-toggle--white').length === 0)
                            $('.darkmode-layer--button').css('display', 'block');
                        else
                            $('.darkmode-toggle--white').css('display', 'block');
                        document.getElementById('blockingOverlay').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                        document.getElementById('paying-message').style.display = 'none'; //'flex'; // Use 'flex' instead of 'block'
                        document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                        document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                    }
                }
            }, 10000);
        }, 10000);
        $(".loggedin").show();
        $(".loggedout").hide();
    });
    
    $( "#test_app" ).click(async function() {
        if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
        {
            if(pi_user_id != "" && pi_user_code != "")
            {
                if(pi_ad_new)
                {
                    (async () => {
                        showRewardedPiAd();
                    })();
                }
                else if(show_pi_ad_user_time == 0 && pi_ad_max == 0)
                {
                    alert("Pi ads not fully loaded. Try again.");
                }
                else
                {
                    alert($("#piad_not_available").text().trim());
                }
            }else if(!localStorage.getItem("loggedIn"))
            {
                alert("This button only works if you're logged in, inside Pi Browser. Reload this page to login.");
            }else
            {
                //$(".PiBrowserLink").show();
                alert("This button only works inside Pi Browser.");
            }
        }
        else
        {
            alert("This button only works on Mainnet inside Pi Browser.");
        }
    });
    
    /*
    if(localStorage.getItem("loggedIn"))
    {
        auth();
    
        setTimeout(function ()
        {
            if(pi_user_code == "" && pi_user_code == "")
                auth();
        }, 10000);
    }else
    {
        $(".login_latinchain").click(function(){
            auth();
        
            setTimeout(function ()
            {
                if(pi_user_code == "" && pi_user_code == "")
                    auth();
            }, 10000);
        });
        
        $(".modal-body-login").html($("#modal_login_latinchain_message").text());
        $("#open_modal_login").click();
    }*/

    //$("#social_div").css("visibility", "visible");
    const btn = $('.button-share');
    //const resultPara = document.querySelector('.result');
    
    // Must be triggered some kind of "user activation"
    btn.click(async () => {
        shareReferrerMessage();
    });
    
    const share_video = $('#share_video');
    //const resultPara = document.querySelector('.result');
    
    if(share_video)
    {
        // Must be triggered some kind of "user activation"
        share_video.click(async () => {
            const shareData = {
                title: 'LatinChain Platform',
                text: $("#share_message").text() + "\n\nVideo:\n" + $(".open_streaming").attr("videourl") + "\nMainnet:\nhttps://latinchain.pinet.com/\nTestnet:\nhttps://latinchaintest9869.pinet.com/",
                //url: 'https://latin-chain.com/',
            }
            
            if (!navigator.share) {
                Pi.openShareDialog(shareData.title, shareData.text);
            }else
            {
              try {
                await navigator.share(shareData);
                //resultPara.textContent = 'MDN shared successfully'
              } catch(err) {
                //alert('Error: ' + err);
              }
            }
        });
    }
    
    
    $('.latinchain-specs').on('click', function() {
        showImageModal($("#latinchain_specs").val(), 'LatinChain Specs');
    });
    
    $( ".pi-hackathon-info" ).click(function() {
        $.colorbox({fixed: true, href:"/modal-vote", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".rules_button" ).click(function() {
        $.colorbox({fixed: true, href:"/modal-rules", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#leaderboard" ).click(function() {
        $.colorbox({fixed: true, href:leaderboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#generalranking" ).click(function() {
        $.colorbox({fixed: true, href:generalranking, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#winnerboard" ).click(function() {
        $.colorbox({fixed: true, href:winnerboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".winnerzoneboard" ).click(function() {
        $.colorbox({fixed: true, href:winnerzoneboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".streamerzoneboard" ).click(function() {
        $.colorbox({fixed: true, href:streamerzoneboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".readingclub" ).click(function() {
        $.colorbox({fixed: true, href:"/reading-club", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#credits" ).click(function() {
        $.colorbox({fixed: true, href:"/get-credits", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    /*$( ".fans-shopping-club" ).click(function() {
        window.location.href = "https://club.latin-chain.com";
    });*/
    
    /*
    $( ".trends-news" ).click(function() {
        window.location.href = "https://trends.latin-chain.com/?v=1.101"+hashLatinChainGoogleTranslate;
    });*/
    
    /*
    $( ".tetris" ).click(function() {
        $.colorbox({href:"/tetris", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    
    /*$( ".stellarium" ).click(function() {
        $.colorbox({href:"https://stellarium-web.org/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".latin-search" ).click(function() {
        $.colorbox({fixed: true, href:"https://www.metacrawler.com/serp?q=LatinChain+Platform&sc=iLjHiOa0KXCr10", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    */
    /*
    $( ".latin-dictionary" ).click(function() {
        $.colorbox({fixed: true, href:"https://www.wiktionary.org", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    */
    /*
    $( ".latin-books" ).click(function() {
        $.colorbox({fixed: true, href:"https://www.wikibooks.org", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    */
    /*
    $( ".latin-university" ).click(function() {
        $.colorbox({fixed: true, href:"https://www.wikiversity.org/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    */
    /*
    $( ".latin-academy" ).click(function() {
        $.colorbox({fixed: true, href:"https://www.odoo.com/slides", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    */
    
    /*
    $( ".mahjong" ).click(function() {
        $.colorbox({href:"/mahjong", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".bubble-shooter" ).click(function() {
        $.colorbox({href:"/bubble-shooter", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".test-your-brain" ).click(function() {
        $.colorbox({href:"/test-your-brain", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".15-puzzle" ).click(function() {
        $.colorbox({href:"/fifteen-puzzle", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".pingpong" ).click(function() {
        $.colorbox({href:"/pingpong", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".checkers" ).click(function() {
        $.colorbox({href:"/checkers", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".domino" ).click(function() {
        $.colorbox({href:"/domino", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    /*
    $( ".latincrush" ).click(function() {
        $.colorbox({href:"/latincrush", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });*/
    
    $( ".show_status" ).click(function() {
        $.colorbox({fixed: true, href:"/latinchain_x", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".chessinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Rules_of_chess", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".sudokuinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Sudoku", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".snakeinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Snake_(video_game_genre)", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".tetrisinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Tetris", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".mahjonginfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Mahjong", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".solitaireinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Klondike_(solitaire)", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".bubble-shooterinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Puzzle_Bobble", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".test-your-braininfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Concentration_(card_game)", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".15-puzzleinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/15_puzzle", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".pingponginfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.m.wikipedia.org/wiki/Table_tennis", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".checkersinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.m.wikipedia.org/wiki/Checkers", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".xiangqiinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.m.wikipedia.org/wiki/Xiangqi", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".dominoinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Dominoes", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".latincrushinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Candy_Crush_Saga", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".soccer-penaltyinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Penalty_kick_%28association_football%29", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".rpggameinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/Dungeons_%26_Dragons", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".webtorrentinfo" ).click(function() {
        $.colorbox({fixed: true, href:"https://en.wikipedia.org/wiki/WebTorrent", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".cointelegraph" ).click(function() {
        $.colorbox({fixed: true, href:"https://cointelegraph.com", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".latinchain-ecosystem" ).click(function() {
        //window.location.href = "https://ecosystem.latin-chain.com";
        $.colorbox({fixed: true, href:"https://ecosystem.latin-chain.com?v=1.101", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".search-apps" ).keyup(function() {
        var search_apps_val = $( ".search-apps" ).val().trim();

        if(search_apps_val == "")
        {
            $(".search-apps-li").show();
            if(pi_user_id != "" && pi_user_code != "")
            {
                $(".search-apps-li-pibrowser").show();
            }
        }
        else
        {
            $(".search-apps-li").hide();
            $(".search-apps-li").each(function() {
                // 'this' refers to the current DOM element in the loop
                // You can wrap 'this' in $() to use jQuery methods on it

                if($(this).text().trim().toLowerCase().includes(search_apps_val.toLowerCase()))
                {
                    $(this).show(); // Example: hide each element
                }else
                {
                    $(this).hide();
                }
                //console.log($(this).text()); // Example: log the text content of each element
            });
            
            if(pi_user_id != "" && pi_user_code != "")
            {
                $(".search-apps-li-pibrowser").hide();
                $(".search-apps-li-pibrowser").each(function() {
                    // 'this' refers to the current DOM element in the loop
                    // You can wrap 'this' in $() to use jQuery methods on it

                    if($(this).text().trim().toLowerCase().includes(search_apps_val.toLowerCase()))
                    {
                        $(this).show(); // Example: hide each element
                    }else
                    {
                        $(this).hide();
                    }
                    //console.log($(this).text()); // Example: log the text content of each element
                });
            }
        }
    });
    
    $( ".clear_cache" ).click(function() {
        var result = confirm($( "#clear_cache_message" ).text());
        if(result)
        {
            try {
                Cache.delete();
            } catch (err) {
                console.error(err);
            }
            try {
                window.location.reload(true);
            } catch (err) {
                console.error(err);
            }
        }
    });
    
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');

    // --- 1. FILTER VISIBLE SLIDES ONLY ---
    const originalVisibleSlides = Array.from(document.querySelectorAll('.carousel-slide'))
        .filter(slide => {
            const style = window.getComputedStyle(slide);
            return style.display !== 'none' && slide.offsetWidth > 0;
        });

    // Safety check: A carousel is only needed if there are 2 or more slides.
    if (originalVisibleSlides.length <= 1) return;

    const intervalTime = 10000;
    let autoPlayTimer;
    let isTransitioning = false; 

    // --- 2. Create the Clones ---
    const firstClone = originalVisibleSlides[0].cloneNode(true);
    const lastClone = originalVisibleSlides[originalVisibleSlides.length - 1].cloneNode(true);

    firstClone.classList.add('carousel-clone');
    lastClone.classList.add('carousel-clone');

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalVisibleSlides[0]);

    // --- 3. Update arrays and track indices ---
    const allSlides = Array.from(document.querySelectorAll('.carousel-slide'));
    
    const allVisibleSlides = allSlides.filter(slide => {
        const style = window.getComputedStyle(slide);
        return style.display !== 'none' && slide.offsetWidth > 0;
    });

    const totalRealSlides = originalVisibleSlides.length;

    // --- 4. Initial Setup ---
    requestAnimationFrame(() => {
        track.scrollLeft = allVisibleSlides[1].offsetLeft;
    });

    // --- 5. The Dynamic Width Calculation ---
    const getSlideWidth = () => {
        if(allVisibleSlides.length < 3) return track.clientWidth;
        return allVisibleSlides[2].offsetLeft - allVisibleSlides[1].offsetLeft;
    };

    // --- 6. The Boundary Loop Function ---
    const handleInfiniteLoopJumps = () => {
        isTransitioning = false;
        const currentScroll = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const buffer = 2; 

        if (currentScroll <= buffer) {
            track.style.scrollSnapType = 'none';
            requestAnimationFrame(() => {
                track.scrollLeft = allVisibleSlides[totalRealSlides].offsetLeft;
                requestAnimationFrame(() => {
                    track.style.scrollSnapType = 'x mandatory'; 
                });
            });
        }
        else if (currentScroll >= maxScroll - buffer) {
            track.style.scrollSnapType = 'none';
            requestAnimationFrame(() => {
                track.scrollLeft = allVisibleSlides[1].offsetLeft;
                requestAnimationFrame(() => {
                    track.style.scrollSnapType = 'x mandatory'; 
                });
            });
        }
    };

    // --- 7. Listen for `scrollend` ---
    if ('onscrollend' in track) {
        track.addEventListener('scrollend', handleInfiniteLoopJumps);
    } else {
        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(handleInfiniteLoopJumps, 60); 
        });
    }

    // --- 8. AutoPlay Logic ---
    const moveToNextSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        track.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
    };

    const startAutoPlay = () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(moveToNextSlide, intervalTime);
    };

    // --- 9. Window Resizing ---
    window.addEventListener('resize', () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        
        const currentScroll = track.scrollLeft;
        let closestIndex = 1;
        let minDiff = Infinity;
        
        for (let i = 1; i <= totalRealSlides; i++) {
            const diff = Math.abs(allVisibleSlides[i].offsetLeft - currentScroll);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }
        
        track.style.scrollSnapType = 'none';
        track.scrollLeft = allVisibleSlides[closestIndex].offsetLeft;
        track.style.scrollSnapType = null;
        startAutoPlay();
    });

    // Start the autoplay timer!
    startAutoPlay();
});
