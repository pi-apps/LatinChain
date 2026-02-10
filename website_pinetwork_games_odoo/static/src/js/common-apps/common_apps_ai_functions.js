"use strict";

var startCommonAppsAIVars = {
    'pi_user_id': '',
    'pi_user_code': '',
    'accessToken': '',
    'iq_name': '',
    'iq_result': '',
    'iq_category': '',
    'iq_date': '',
    'show_pi_ad_user': true,
    'show_pi_ad_user_time': 0,
    'pi_ad_new': false,
    'pi_ad_max': 0,
};

var startCommonAppsAI = () => {

    $( document ).ready(function() {
        
        const Pi = window.Pi;
        
        var pi_user_id = "";
        var pi_user_code = "";
        var accessToken = "";
        var passkey = "";
        
        function setConfirmAIUnload(on) {
            unloadMessage(on);
        }

        function setConfirmAIUnloadPoints(on) {
            unloadMessage(on);
        }
        
        function test_rewarded()
        {
            document.getElementById('blockingOverlay').style.display = 'none'; // Use 'flex' instead of 'block'
            document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
            document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
            document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
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
        
        async function showPiRewardedAds(Pi)
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
            
            try {
                
                const isAdReadyResponse = await Pi.Ads.isAdReady("rewarded");
                if (isAdReadyResponse.ready === false) {
                    
                    const requestAdResponse = await Pi.Ads.requestAd("rewarded");
                    if (requestAdResponse.result === "ADS_NOT_SUPPORTED") {
                        // display modal to update Pi Browser
                        // showAdsNotSupportedModal()
                        alert("Update Pi Browser version, please!.");
                        return;
                    }
                    if (requestAdResponse.result !== "AD_LOADED") {
                        // display modal ads are temporarily unavailable and user should try again later
                        // showAdUnavailableModal()
                        alert("Ads are temporarily unavailable, try again later!.");
                        return;
                    }
                }
                
                const showAdResponse = await Pi.Ads.showAd("rewarded");
                
                if (showAdResponse.result === "AD_REWARDED")
                {
                    await delayAsync(2000);
                    if(pi_user_id != "" && pi_user_code != "" && showAdResponse.adId)
                    {
                        var data = {
                            'pi_user_id': pi_user_id,
                            'pi_user_code': pi_user_code,
                            'adId': showAdResponse.adId,
                            'passkey': passkey,
                            'accessToken': accessToken,
                            'csrf_token': odoo.csrf_token,
                        };
                        //$.ajaxSetup({async: false});
                        setConfirmAIUnloadPoints(true);
                        $.post( "/set-latin-points", data).done(function(data) {
                            end();
                            setConfirmAIUnloadPoints(false);
                            data = JSON.parse(data);
                            if(data.result && data.points_latin > 0)
                            {
                            }
                            start();
                        }).fail(function() {
                            setConfirmAIUnloadPoints(false);
                        });
                    }
                    test_rewarded();
                }
            } catch (err) {
            }
        }
        
        $("#test_app").click(function(){
            if(startCommonAppsAIVars.pi_ad_new)
            {
                alert("You can use this app, for testing purposes, until you unblock the game.");
                showPiRewardedAds(Pi);
            }else
            {
                alert("Max rewarded ads number reached. " + startCommonAppsAIVars.pi_ad_max + " rewarded ads each " + startCommonAppsAIVars.show_pi_ad_user_time + "h");
            }
        });
        
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
                        startCommonAppsAIVars.iq_name = data.iq_name;
                        startCommonAppsAIVars.iq_result = data.iq_result;
                        startCommonAppsAIVars.iq_category = data.iq_category;
                        startCommonAppsAIVars.iq_date = data.iq_date;
                        startCommonAppsAIVars.show_pi_ad_user = data.show_pi_ad;
                        startCommonAppsAIVars.show_pi_ad_user_time = data.show_pi_ad_time;
                        startCommonAppsAIVars.pi_ad_new = data.pi_ad_new;
                        startCommonAppsAIVars.pi_ad_max = data.pi_ad_max;
                        
                        if(data.unblocked)
                        {
                            document.getElementById('blockingOverlay').style.display = 'none'; // Use 'flex' instead of 'block'
                            document.getElementById('paying-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                        }else
                        {
                            if(window.location.hostname == "localhost")
                            {
                                $("a.anchor-click").attr('href', window.location.origin + "/pinetwork");
                            }
                            else if(window.location.hostname == "test.latin-chain.com")
                            {
                                $("a.anchor-click").attr('href', "/pinetwork");
                            }
                            else
                            {
                                $("a.anchor-click").attr('href', "/pinetwork");
                            }
                            
                            document.getElementById('blockingOverlay').style.display = 'flex'; // Use 'flex' instead of 'block'
                            document.getElementById('paying-message').style.display = 'block'; // Use 'flex' instead of 'block'
                            document.getElementById('blocking-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                        }
                    }
                });
            }
        }
        
        async function auth() {
            try {
                // Identify the user with their username / unique network-wide ID, and  qget permission to request payments from them.
                const scopes = ['username', 'payments', 'wallet_address'];
                function onIncompletePaymentFound(payment) {
                    
                }; // Read more about this in the SDK reference
                
                Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                    pi_user_id = auth.user.uid;
                    pi_user_code = auth.user.username;
                    accessToken = auth.accessToken;
                    
                    startCommonAppsAIVars.pi_user_id = auth.user.uid;
                    startCommonAppsAIVars.pi_user_code = auth.user.username;
                    startCommonAppsAIVars.accessToken = auth.accessToken;
                    
                    set_points(0).always(function(){
                        get_user().always(function(){
                            
                            //document.getElementById('blockingOverlay').style.display = 'none';
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
        
        (async () => {
            await Pi.init({ version: "2.0", sandbox: $("#sandbox").val() });
    
            if(localStorage.getItem("loggedIn"))
            {
                await delayAsync(3000);
                
                auth();
            
                setTimeout(function ()
                {
                    if(pi_user_id == "" && pi_user_code == "")
                    {
                        auth();
                        
                        setTimeout(function ()
                        {
                            if(pi_user_id == "" && pi_user_code == "")
                            {
                                //alert($("#pi_prowser_message").text());
                                
                                if(window.location.hostname == "localhost")
                                {
                                    $("a.anchor-click").attr('href', window.location.origin);
                                }
                                else if(window.location.hostname == "test.latin-chain.com")
                                {
                                    $("a.anchor-click").attr('href', "https://latinchaintest9869.pinet.com");
                                }
                                else
                                {
                                    $("a.anchor-click").attr('href', "https://latinchain.pinet.com");
                                }
                                
                                document.getElementById('blockingOverlay').style.display = 'flex'; // Use 'flex' instead of 'block'
                                document.getElementById('blocking-message').style.display = 'block'; // Use 'flex' instead of 'block'
                                document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
                            }
                        }, 10000);
                    }
                }, 10000);
            }else
            {
                $("#blocking-message").html('<div>' + 
                '    Login in main screen' +
                '</div>' +
                '<div>' +
                '    <a class="anchor-goback" style="color: blue;" href="/" target="_self">Go back</a>' +
                '</div>');
                
                await delayAsync(5000);
                
                document.getElementById('blockingOverlay').style.display = 'flex'; // Use 'flex' instead of 'block'
                document.getElementById('blocking-message').style.display = 'block'; // Use 'flex' instead of 'block'
                document.getElementById('loading-message').style.display = 'none'; // Use 'flex' instead of 'block'
            }
            
        })();
    });
};
