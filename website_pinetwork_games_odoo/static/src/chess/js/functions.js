var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";
var passkey = "";
var amount = 0;
const Pi = window.Pi;
var startTime=new Date(), endTime=new Date(), seconds=0;
var unblocked = false;
var show_pi_ad_user = true;

function showConfetti(duration){
    const end = Date.now() + duration * 1000;

    // go Buckeyes!
    const colors = ["#bb0000", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
}

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

function set_points(points) {
    if(pi_user_id != "" && pi_user_code != "")
    {
        end();
        if(seconds <= 5)
            points = 0;
        start();
        var data = {
            'pi_user_id': pi_user_id,
            'pi_user_code': pi_user_code,
            'points': points,
            'app_client': 'auth_platform',
            'passkey': passkey,
            'accessToken': accessToken,
            'csrf_token': odoo.csrf_token,
        };
        //$.ajaxSetup({async: false});
        setConfirmUnloadPoints(true);
        return $.post( "/pi-points", data).done(function(data) {
            setConfirmUnloadPoints(false);
            data = JSON.parse(data);
            if(data.result && points > 0)
            {
                end();
                $("#gained_points").show();
                $("#gained_points").html("+" + points);
                showConfetti(10);
                setTimeout(function() {
                    $("#gained_points").hide();
                }, 15000);
                //alert("+" + points + $("#points_message").text());
                start();
            }
        }).fail(function() {
            setConfirmUnloadPoints(false);
        });
    }
}

function load_all_boards()
{
    if(all_was_loaded_lib == "mobile")
    {
        if(all_was_loaded)
        {
            setTimeout(function() {
                setMobileBoard();
            }, 1000);
        }else{
            setTimeout(function() {
                load_all_boards();
            }, 5000);
        }
    }else if(all_was_loaded_lib == "desktop")
    {
        if(all_was_loaded)
        {
            setTimeout(function() {
                setDesktopBoard();
            }, 1000);
        }else{
            setTimeout(function() {
                load_all_boards();
            }, 5000);
        }
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
                
                passkey=data.passkey;
                if(data.unblocked)
                {
                    unblocked = data.unblocked;
                    
                    $("#pi_donate").hide();
                    $("#button_click").hide();
                    $(".hide_when_unblock").hide();
                    $("#loading_word").hide();
                    $('#chess-tab').show();
                    $("#home-tab").prop( "disabled", true );
                    $('#chess-tab').click();
                    /*setTimeout(function() {
                      (adsbygoogle = window.adsbygoogle || []).push({});
					}, 1000);*/
                    
                    setTimeout(function() {
                      load_all_boards();
                      setTimeout(function() {
                        $("#home-tab").prop( "disabled", false );
                      }, 2000);
					}, 1000);
                }
                else
                {
                    $(".hide_when_unblock").show();
                    $("#loading_word").hide();
                    $("#pi_donate").hide();
                    $("#button_click").show();
                    $('#chess-tab').hide();
                    $("#home-tab").click();
                }
            }
        }).fail(function() {
            
        });
    }
}

async function showPiAds(Pi) {
    try {
        const nativeFeaturesList = await Pi.nativeFeaturesList();
        const adNetworkSupported = nativeFeaturesList.includes("ad_network");
        
        const ready = await Pi.Ads.isAdReady("interstitial");
        
        if (ready === false) {
            const requestAdResponse = await Pi.Ads.requestAd("interstitial");
            
            if (requestAdResponse === "AD_NOT_AVAILABLE") {
                // display modal to update Pi Browser
                // showAdsNotSupportedModal()
                alert("Update Pi Browser, please!.");
                return;
            }
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
        //alert(err);
        // Not able to fetch the user
    }
}

$( document ).ready(function() {
    $('.timer_white').countimer({
			autoStart : false
			});
    
    $('.timer_black').countimer({
			autoStart : false
			});
    
    $(document).ajaxStop(function() {
                $("#loading_word").hide();
            });
            
    Pi.init({ version: "2.0", sandbox: $("#sandbox").val() });
    
    amount = $("#amount").val();
    
    async function auth() {
        $("#pi_donate").hide();
        $("#button_click").show();
        $('#chess-tab').hide();
        $("#home-tab").click();
        
        $("#loading_word").show();
                                
        setTimeout(function() {
          $("#loading_word").hide();
        }, 5000);
        
        try {
            // Identify the user with their username / unique network-wide ID, and get permission to request payments from them.
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
                        'app_client': 'auth_platform',
                        'accessToken': accessToken,
                        'pi_user_code': pi_user_code,
                        'pi_user_id': pi_user_id,
                        'csrf_token': odoo.csrf_token,
                    };
                    setConfirmUnloadPoints(true);
                  return $.post( "/pi-api", data).done(function(data) {
                                    setConfirmUnloadPoints(false);
                                    $("#button_click").prop( "disabled", false );
                                    try {
                                        data = JSON.parse(data);
                                        if(data.result && data.completed)
                                        {
                                            alert($("#payment_message").text());
                                        }
                                    } catch (e) {
                                    }
                                }).fail(function() {
                                    setConfirmUnloadPoints(false);
                                    $("#button_click").prop( "disabled", false );
                                });
            }; // Read more about this in the SDK reference

            Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                pi_user_id = auth.user.uid;
                pi_user_code = auth.user.username;
                accessToken = auth.accessToken;
                
                //get_user();
                set_points(0).always(function(){
                    get_user().always(function(){
                        
                        if(show_pi_ad_user && ["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                            showPiAds(Pi);
                        
                        $( "#button_click" ).click(function() {
                            if(parseFloat($("#pi_donate").val()) == parseFloat(amount))
                            {
                                $("#button_click").prop( "disabled", true );
                                /*setTimeout(function ()
                                {
                                    $("#button_click").prop( "disabled", false );
                                }, 10000);*/
                                transfer();
                            }else{
                                alert($("#payment_lessthan_message").text() + amount + " Pi.");
                            }
                        });
                        $("#button_click").prop( "disabled", false );
                    });
                });
            }).catch(function(error) {
                //Pi.openShareDialog("Error", error);
                //alert(err);
                
                setConfirmUnload(false);
                
                console.error(error);
            });
        } catch (err) {
            setConfirmUnload(false);
            //Pi.openShareDialog("Error", err);
            //alert(err);
            console.error(err);
            // Not able to fetch the user
        }        
    }
    
    async function transfer() {
        try {
            const payment = Pi.createPayment({
              // Amount of π to be paid:
              amount: parseFloat($("#pi_donate").val()),
              // An explanation of the payment - will be shown to the user:
              memo: "Donate to unlock LatinChain Games (Chess)", // e.g: "Digital kitten #1234",
              // An arbitrary developer-provided metadata object - for your own usage:
              metadata: { paymentType: "donation" /* ... */ }, // e.g: { kittenId: 1234 }
            }, {
                  // Callbacks you need to implement - read more about those in the detailed docs linked below:
                  onReadyForServerApproval: function(paymentId) {
                        
                    var data = {
                                'action': 'approve',
                                'paymentId': paymentId,
                                "txid": '',
                                'app_client': 'auth_platform',
                                'csrf_token': odoo.csrf_token,
                                'accessToken': accessToken,
                                'pi_user_code': pi_user_code,
                                'pi_user_id': pi_user_id,
                            };
                        setConfirmUnload(true);
                      return $.post( "/pi-api", data).done(function(data) {
                                    setConfirmUnload(false);
                                    $("#button_click").prop( "disabled", false );
                                    try{
                                        data = JSON.parse(data);
                                        if(data.result && data.approved)
                                        {
                                            if(data.complete_found)
                                            {
                                                alert($("#payment_message").text());
                                            }
                                        }
                                    } catch (e) {
                                        }
                                }).fail(function() {
                                    setConfirmUnload(false);
                                    $("#button_click").prop( "disabled", false );
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
                        setConfirmUnload(true);
                      return $.post( "/pi-api", data).done(function(data) {
                                    setConfirmUnload(false);
                                    $("#button_click").prop( "disabled", false );
                                    data = JSON.parse(data);
                                    if(data.result && data.completed)
                                        location.reload();
                                }).fail(function() {
                                    setConfirmUnload(false);
                                    $("#button_click").prop( "disabled", false );
                                });
                  },
                  onCancel: function(paymentId) { 
                      setConfirmUnload(false);
                      $("#button_click").prop( "disabled", false ); /* ... */ },
                  onError: function(error, payment) { 
                      setConfirmUnload(false);
                      $("#button_click").prop( "disabled", false ); /* ... */ },
                });
        } catch(err) {
            setConfirmUnload(false);
            //Pi.openShareDialog("Error", err);
            // alert(err);
            $("#button_click").prop( "disabled", false );
            console.error(err);
            // Technical problem (eg network failure). Please try again
        }
    }

    auth();
    
    $(".numeric-decimal").on("keypress keyup blur",function (event) {
        //this.value = this.value.replace(/[^0-9\.]/g,'');
        //$(this).val($(this).val().replace(/[^0-9\.]/g,''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    
    $(".numeric").on("keypress keyup blur",function (event) {
        var val = $(this).val().replace(/[^\d].+/, "");
        if(val.length > 1)
            val = val.substring(0, 1);
        $(this).val(val);
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    
    $(".sudoku-list").on("keypress keyup blur",function (event) {
        //this.value = this.value.replace(/[^0-9\.]/g,'');
        //$(this).val($(this).val().replace(/[^0-9\.]/g,''));
        if ((event.which != 46) && (event.which < 49 || event.which > 57)) {
            event.preventDefault();
        }
    });
    
    
});
