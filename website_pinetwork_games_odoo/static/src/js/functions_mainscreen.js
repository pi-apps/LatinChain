var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";
var passkey = "";
const Pi = window.Pi;
var unblocked = false;
var show_pi_ad_user = true;
var show_pi_ad_user_time = 0;
var pi_ad_new = false;

var leaderboard = "/get-points/";
var winnerboard = "/get-top10-zone/";
var winnerzoneboard = "/get-winners-zone/";
var streamerzoneboard = "/get-streamers-zone/";
var generalranking = "/get-general-ranking/";

var colorbox_count = 0;
var colorbox_opened = false;
async function colorboxLoaded()
{
    if(["Testnet ON", "Testnet OFF"].includes($("#mainnet").val()) && $("#nopopup").val() == false)
    {
        if($.colorbox && !colorbox_opened)
        {
            $.colorbox({href:"/latinchain-mainnet-redirect", closeButton:false, overlayClose:false, escKey:false, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
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
    }
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
                if(data.unblocked)
                {
                    unblocked = data.unblocked;
                    
                    $("#user_points").html(data.points);
                    $("#user_points_per_game").html('<div>Latin points: ' + data.points_latin + '</div>' +
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
                                                      '<td>' + data.points_chess + '</td>' +
                                                      '<td>' + data.points_snake + '</td>' +
                                                      '<td>' + data.points_sudoku + '</td>' +
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
                                                      '<td>' + data.points_chess_last + '</td>' +
                                                      '<td>' + data.points_snake_last + '</td>' +
                                                      '<td>' + data.points_sudoku_last + '</td>' +
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
                                                      '<td>' + data.points_chess_wins + '</td>' +
                                                      '<td>' + data.points_snake_wins + '</td>' +
                                                      '<td>' + data.points_sudoku_wins + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_datetime").html(data.points_datetime);
                }else{
                
                    $("#user_points").html(data.points);
                    $("#user_points_per_game").html('<div>Latin points: ' + data.points_latin + '</div>' +
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
                                                      '<td>' + data.points_chess + '</td>' +
                                                      '<td>' + data.points_snake + '</td>' +
                                                      '<td>' + data.points_sudoku + '</td>' +
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
                                                      '<td>' + data.points_chess_last + '</td>' +
                                                      '<td>' + data.points_snake_last + '</td>' +
                                                      '<td>' + data.points_sudoku_last + '</td>' +
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
                                                      '<td>' + data.points_chess_wins + '</td>' +
                                                      '<td>' + data.points_snake_wins + '</td>' +
                                                      '<td>' + data.points_sudoku_wins + '</td>' +
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
                    alert($("#payment_message").text());
                    
                show_pi_ad_user = data.show_pi_ad;
                show_pi_ad_user_time = data.show_pi_ad_time;
                pi_ad_new = data.pi_ad_new;
                
                $(".show-tetris").show();
                $(".show-mahjong").show();
                $(".show-tvonline").show();
                $(".show-sport-results").show();
                $(".show-cointelegraph").show();
                $(".show-streamerzoneboard").show();
                $(".show-stellarium").show();
                $(".show-latin-search").show();
                $(".show-latin-dictionary").show();
                $(".show-latin-university").show();
                
                passkey=data.passkey;
                if(data.unblocked)
                {
                    unblocked = data.unblocked;
                
                    $("#verified").html(" (" + $("#verified_message").html() + ", " + data.unblocked_datetime + ")");
                    $("#verified").show();
                    
                    winner = ""
                    if(data.im_winner)
                        winner = $("#winner_message").html();
                    
                    $("#user_logged").html(data.pi_user_code);
                    $(".div_user_status").addClass("p-3 mb-2 bg-secondary bg-gradient text-white rounded");
                    $(".user_status").html("(" + $("#verified_message").html() + ", " + data.unblocked_datetime + "). " + $("#available_days_message").text() + data.days_available + winner);
                    $(".user_status_account").html("(" + $("#verified_message").html() + ", " + data.unblocked_datetime + "). " + $("#available_days_message").text() + data.days_available + winner);
                    $( "<br/>" ).insertAfter( ".user_status_account" );
                    $("#user_points").html(data.points);
                    $("#user_points_per_game").html('<div>Latin points: ' + data.points_latin + '</div>' +
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
                                                      '<td>' + data.points_chess + '</td>' +
                                                      '<td>' + data.points_snake + '</td>' +
                                                      '<td>' + data.points_sudoku + '</td>' +
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
                                                      '<td>' + data.points_chess_last + '</td>' +
                                                      '<td>' + data.points_snake_last + '</td>' +
                                                      '<td>' + data.points_sudoku_last + '</td>' +
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
                                                      '<td>' + data.points_chess_wins + '</td>' +
                                                      '<td>' + data.points_snake_wins + '</td>' +
                                                      '<td>' + data.points_sudoku_wins + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_datetime").html(data.points_datetime);
                    //$("#pi_wallet_address").val(data.pi_wallet_address);
                    $("#streaming_url").val(data.streaming_url);
                    $("#referrer_code").val(data.referrer_code);
                    
                    $("#button_click").prop( "disabled", false );
                    //$("#pi_wallet_address").prop( "disabled", false );
                    $("#streaming_url").prop( "disabled", false );
                    
                    $("#button_click_referrer").prop( "disabled", false );
                    $("#referrer_code").prop( "disabled", false );
                    
                    $("#button_click_memo").prop( "disabled", false );
                    $("#memo_id").prop( "disabled", false );
                }else{
                    $("#user_logged").html(data.pi_user_code);
                    $(".div_user_status").addClass("p-3 mb-2 bg-secondary bg-gradient text-white rounded");
                    $(".user_status").html($("#not_verified_1_message").text() + data.amount + " Pi. " + $("#not_verified_2_message").text());
                    $(".user_status_account").html($("#not_verified_1_message").text() + data.amount + " Pi. " + $("#not_verified_2_message").text());
                    $( "<br/>" ).insertAfter( ".user_status_account" );
                    $("#user_points").html(data.points);
                    $("#user_points_per_game").html('<div>Latin points: ' + data.points_latin + '</div>' +
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
                                                      '<td>' + data.points_chess + '</td>' +
                                                      '<td>' + data.points_snake + '</td>' +
                                                      '<td>' + data.points_sudoku + '</td>' +
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
                                                      '<td>' + data.points_chess_last + '</td>' +
                                                      '<td>' + data.points_snake_last + '</td>' +
                                                      '<td>' + data.points_sudoku_last + '</td>' +
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
                                                      '<td>' + data.points_chess_wins + '</td>' +
                                                      '<td>' + data.points_snake_wins + '</td>' +
                                                      '<td>' + data.points_sudoku_wins + '</td>' +
                                                    '</tr>' +
                                                  '</tbody>' +
                                                '</table>');
                    $("#user_points_datetime").html(data.points_datetime);
                    //$("#pi_wallet_address").val(data.pi_wallet_address);
                    $("#streaming_url").val(data.streaming_url);
                    $("#referrer_code").val(data.referrer_code);
                    
                    $("#button_click").prop( "disabled", true );
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

async function showPiAds(Pi) {
    try {
        const isAdReadyResponse = await Pi.Ads.isAdReady("interstitial");
        
        if (isAdReadyResponse.ready === false) {
            await Pi.Ads.requestAd("interstitial");
        }
        
        const showAdResponse = await Pi.Ads.showAd("interstitial");
        
        if(showAdResponse.result == "AD_CLOSED")
        {
            if(pi_user_id != "" && pi_user_code != "")
            {
                var data = {
                            'pi_user_id': pi_user_id,
                            'pi_user_code': pi_user_code,
                            'accessToken': accessToken,
                            'csrf_token': odoo.csrf_token,
                        };
                //$.ajaxSetup({async: false});
                return $.post( "/set-pi-ad-datetime", data).done(function(data) {
                    data = JSON.parse(data);
                    if(data.result)
                    {
                    }
                }).fail(function() {
                    
                });
            }
        }
    } catch (err) {
        //alert("Error: " + err);
        // Not able to fetch the user
    }
}

$( document ).ready(function() {
    colorboxLoaded();
    
    window.addEventListener('unhandledrejection', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    });
    
    $(".open_streaming").click(function(){
        var streaming_url = validateYouTubeUrl($(this).attr("videourl"));
        streaming_url = streaming_url[1];
        $.colorbox({width: "80%", height: "80%", maxWidth: "80%", maxHeight: "80%", html:'<iframe id="latin-chain" width="100%" height="100%" src="https://www.youtube.com/embed/' + streaming_url + '?autoplay=1&amp;loop=1" frameborder="0" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe>'});
    });
    
    $(".open_streaming_playlist").click(function(){
        var streaming_url = $(this).attr("videourl");
        $.colorbox({width: "80%", height: "80%", maxWidth: "80%", maxHeight: "80%", html:'<iframe id="latin-chain" width="100%" height="100%" src="' + streaming_url + '&amp;autoplay=1&amp;loop=1" frameborder="0" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe>'});
    });
    
    $( ".askanexpert" ).click(function() {
        $.colorbox({href:"/askanexpert/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".partners" ).click(function() {
        $.colorbox({href:"/latinchain-partners/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
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
    $("#latinchain-tv").prop('src', 'https://www.youtube.com/embed/videoseries?si=Jad786J0eb5c4NoN&amp;list=PLmedLgLFYxR3oFeslBQfZ0zb8GJuU3VQG');
    
    //$("#latinchain-tv").prop('src', 'https://www.youtube.com/embed/videoseries?si=Jad786J0eb5c4NoN&amp;list=PLmedLgLFYxR3oFeslBQfZ0zb8GJuU3VQG');

    var status_audio = false;
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/website_pinetwork_games_odoo/static/src/music/music.mp3');
    audioElement.addEventListener('ended', function() {
        this.play();
    }, false);
    
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
            $.post( "/set-streaming-url", data).done(function(data) {
                data = JSON.parse(data);
                if(data.result)
                    alert($("#streaming_url_saved").text());
                //$("#refresh").click();
                $("#button_click").prop( "disabled", false );
                $("#streaming_url").prop( "disabled", false );
            }).fail(function() {
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
            $.post( "/validate-memo", data).done(function(data) {
                data = JSON.parse(data);
                if(data.result)
                    alert($("#memo_saved").text());
                else
                    alert($("#memo_not_saved").text());
                //$("#refresh").click();
                $("#button_click_memo").prop( "disabled", false );
                $("#memo_id").prop( "disabled", false );
            }).fail(function() {
                $("#button_click_memo").prop( "disabled", false );
                $("#memo_id").prop( "disabled", false );
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
            $.post( "/set-referrer-code", data).done(function(data) {
                data = JSON.parse(data);
                if(data.result)
                    alert($("#referrer_code_saved").text());
                else
                    $("#referrer_code").val("");
                    
                //$("#refresh").click();
                $("#button_click_referrer").prop( "disabled", false );
                $("#referrer_code").prop( "disabled", false );
            }).fail(function() {
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
    });

    $("#verified").hide();
    
    function setConfirmUnload(on) {
        if(on)
        {
            //alert($("#notclose_message").text());
        }
         window.onbeforeunload = on ? unloadMessage : null;
    }

    function setConfirmUnloadPoints(on) {
         window.onbeforeunload = on ? unloadMessage : null;
    }

    function unloadMessage() {
        return true;
    }
    
    Pi.init({ version: "2.0", sandbox: $("#sandbox").val() });
    
    async function auth() {
        try {
            if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
            {
                const nativeFeaturesList = await Pi.nativeFeaturesList();
                const adNetworkSupported = nativeFeaturesList.includes("ad_network");
                
                if(!adNetworkSupported)
                    alert("Update Pi Browser version, please!.");
            }
            
            // Identify the user with their username / unique network-wide ID, and  qget permission to request payments from them.
            const scopes = ['username', 'payments', 'wallet_address'];
            function onIncompletePaymentFound(payment) {
                
            }; // Read more about this in the SDK reference

            $("#loading_word").show();
            
            setTimeout(function() {
              $("#loading_word").hide();
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
                    $.colorbox({href:"/latinchain-certification/" + auth.user.username, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
                });
                
                $( ".div-certification" ).show();
                
                /*$("#leaderboard").attr("href", "/get-points/" + auth.user.username);
                $("#winnerboard").attr("href", "/get-top10-zone/" + auth.user.username);
                $("#winnerzoneboard").attr("href", "/get-winners-zone/" + auth.user.username);*/

                //get_user();
                set_points(0).always(function(){
                    get_user().always(function(){
                        
                        if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                        {
                            if(show_pi_ad_user || pi_ad_new)
                            {
                                $("#button_reward_ad").show();
                                $("#piad_not_available").hide();
                                $("#button_reward_ad").prop( "disabled", false );
                            }else
                            {
                                $("#button_reward_ad").hide();
                                $("#piad_not_available").show();
                            }
                                    
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
                            
                            $( "#button_reward_ad" ).click(async function() {
                                end();
                                if(seconds < 5 && start_flag)
                                {
                                    start();
                                    return;
                                }
                                start();
                                
                                if(!start_flag)
                                    start_flag = true;
                                
                                if(pi_user_id != "" && pi_user_code != "" && pi_ad_new)
                                {
                                    try {
                                        $("#button_reward_ad").prop( "disabled", true );
                                        
                                        const isAdReadyResponse = await Pi.Ads.isAdReady("rewarded");
                                        if (isAdReadyResponse.ready === false) {
                                            
                                            const requestAdResponse = await Pi.Ads.requestAd("rewarded");
                                            if (requestAdResponse.result === "ADS_NOT_SUPPORTED") {
                                                // display modal to update Pi Browser
                                                // showAdsNotSupportedModal()
                                                alert("Update Pi Browser version, please!.");
                                                $("#button_reward_ad").prop( "disabled", false );
                                                return;
                                            }
                                            if (requestAdResponse.result !== "AD_LOADED") {
                                                // display modal ads are temporarily unavailable and user should try again later
                                                // showAdUnavailableModal()
                                                alert("Ads are temporarily unavailable, try again later!.");
                                                $("#button_reward_ad").prop( "disabled", false );
                                                return;
                                            }
                                        }
                                        
                                        const showAdResponse = await Pi.Ads.showAd("rewarded");
                                        
                                        if (showAdResponse.result === "AD_REWARDED") {
                                            if(pi_user_id != "" && pi_user_code != "" && showAdResponse.adId)
                                            {
                                                $("#button_reward_ad").prop( "disabled", true );
                                                var btnvalue = $("#button_reward_ad").html();
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
                                                        $("#button_reward_ad").prop( "disabled", true );
                                                        $("#button_reward_ad").html("+" + data.points_latin + " Latin points.");
                                                        $(".modal-body").html($("#modal_reward_message").text() + data.points_latin + " Latin points.");
                                                        $("#open_modal").click();
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
                                                                $("#button_reward_ad").html(btnvalue);
                                                                $("#button_reward_ad").prop( "disabled", false );
                                                            }, 5000);
                                                        }else
                                                        {
                                                            $("#button_reward_ad").hide();
                                                            $("#piad_not_available").show();
                                                            setTimeout(function ()
                                                            {
                                                                $("#button_reward_ad").html(btnvalue);
                                                            }, 5000);
                                                        }
                                                        
                                                        get_user_rewarded();
                                                    }else{
                                                        $("#button_reward_ad").html("Error, try again...");
                            
                                                        setTimeout(function ()
                                                        {
                                                            $("#button_reward_ad").html(btnvalue);
                                                            $("#button_reward_ad").prop( "disabled", false );
                                                        }, 5000);
                                                    }
                                                    start();
                                                }).fail(function() {
                                                    $("#button_reward_ad").html("Fail, try again...");
                            
                                                    setTimeout(function ()
                                                    {
                                                        $("#button_reward_ad").html(btnvalue);
                                                        $("#button_reward_ad").prop( "disabled", false );
                                                    }, 5000);
                                                    setConfirmUnloadPoints(false);
                                                });
                                            }
                                        } else {
                                            $("#button_reward_ad").prop( "disabled", false );
                                            // fallback logic
                                            // showAdErrorModal()
                                        }
                                        
                                    } catch (err) {
                                        $("#button_reward_ad").prop( "disabled", false );
                                        // good practice to handle any potential errors
                                    }
                                }
                            });
                            if(show_pi_ad_user && ["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                                $( "#button_reward_ad" ).click();
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
    $(".referrer_username").html("<strong>--</strong>");
    auth();
    
    setTimeout(function ()
    {
        if(pi_user_code == "" && pi_user_code == "")
            auth();
    }, 10000);

    //$("#social_div").css("visibility", "visible");
    const btn = document.querySelector('#button1');
    //const resultPara = document.querySelector('.result');
    
    // Must be triggered some kind of "user activation"
    btn.addEventListener('click', async () => {
        const shareData = {
            title: 'LatinChain Platform',
            text: $("#share_message").text() + "\n\nMainnet:\nhttps://latinchain7588.pinet.com/\nTestnet:\nhttps://latinchaintest9869.pinet.com/\nCrypto news:\nhttps://news.latin-chain.com/",
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
    
    const share_video = document.querySelector('#share_video');
    //const resultPara = document.querySelector('.result');
    
    if(share_video)
    {
        // Must be triggered some kind of "user activation"
        share_video.addEventListener('click', async () => {
            const shareData = {
                title: 'LatinChain Platform',
                text: $("#share_message").text() + "\n\nVideo:\n" + $(".open_streaming").attr("videourl") + "\nMainnet:\nhttps://latinchain7588.pinet.com/\nTestnet:\nhttps://latinchaintest9869.pinet.com/",
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
    
    $( "#vote" ).click(function() {
        $.colorbox({href:"/modal-vote", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".rules_button" ).click(function() {
        $.colorbox({href:"/modal-rules", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#leaderboard" ).click(function() {
        $.colorbox({href:leaderboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#generalranking" ).click(function() {
        $.colorbox({href:generalranking, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#winnerboard" ).click(function() {
        $.colorbox({href:winnerboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".winnerzoneboard" ).click(function() {
        $.colorbox({href:winnerzoneboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".streamerzoneboard" ).click(function() {
        $.colorbox({href:streamerzoneboard, iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".readingclub" ).click(function() {
        $.colorbox({href:"/reading-club", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( "#credits" ).click(function() {
        $.colorbox({href:"/get-credits", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".cryptonews" ).click(function() {
        $.colorbox({href:"https://news.latin-chain.com/?v=1.101", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".tetris" ).click(function() {
        $.colorbox({href:"/tetris", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".stellarium" ).click(function() {
        $.colorbox({href:"https://stellarium-web.org/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".latin-search" ).click(function() {
        $.colorbox({href:"https://www.metacrawler.com/serp?q=LatinChain+Platform&sc=iLjHiOa0KXCr10", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".latin-dictionary" ).click(function() {
        $.colorbox({href:"https://www.wiktionary.org", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".latin-university" ).click(function() {
        $.colorbox({href:"https://www.wikiversity.org/", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".sport-results" ).click(function() {
        $.colorbox({href:"https://sports.latin-chain.com/?v=1.103", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".mahjong" ).click(function() {
        $.colorbox({href:"/mahjong", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".show_status" ).click(function() {
        $.colorbox({href:"/latinchain_x", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".chessinfo" ).click(function() {
        $.colorbox({href:"https://en.wikipedia.org/wiki/Rules_of_chess", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".sudokuinfo" ).click(function() {
        $.colorbox({href:"https://en.wikipedia.org/wiki/Sudoku", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".snakeinfo" ).click(function() {
        $.colorbox({href:"https://en.wikipedia.org/wiki/Snake_(video_game_genre)", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".tetrisinfo" ).click(function() {
        $.colorbox({href:"https://en.wikipedia.org/wiki/Tetris", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".mahjonginfo" ).click(function() {
        $.colorbox({href:"https://en.wikipedia.org/wiki/Mahjong", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
    });
    
    $( ".cointelegraph" ).click(function() {
        if(unblocked) 
        {
            $.colorbox({href:"https://cointelegraph.com", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
        }else if(["Mainnet OFF"].includes($("#mainnet").val()))
        {
            alert($("#modal_use_anytime").text());
            $.colorbox({href:"https://cointelegraph.com", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
        }else
        {
            if(confirm($("#modal_unlock_use_anytime").text()))
            {
                location.href = "/pinetwork";
            }
        }
    });
    
    $( ".tvonline" ).click(function() {
        if(unblocked) 
        {
            $.colorbox({href:"https://pluto.tv/latam/live-tv/6320d80a66666000086712d7?lang=en", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
        }else if(["Mainnet OFF"].includes($("#mainnet").val()))
        {
            alert($("#modal_use_anytime").text());
            $.colorbox({href:"https://pluto.tv/latam/live-tv/6320d80a66666000086712d7?lang=en", iframe:true, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%"});
        }else
        {
            if(confirm($("#modal_unlock_use_anytime").text()))
            {
                location.href = "/pinetwork";
            }
        }
    });
    
    
    $( "#clear_cache" ).click(function() {
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
