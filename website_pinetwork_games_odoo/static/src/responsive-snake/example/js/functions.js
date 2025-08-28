var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";
var passkey = "";
var amount = 0;
const Pi = window.Pi;
var totalpoints = 0;
var startTime=new Date(), endTime=new Date(), seconds=0;
var unblocked = false;
var show_pi_ad_user = true;

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
    unloadMessage(on);
}

function setConfirmUnloadPoints(on) {
    unloadMessage(on);
}

function press(key)
{
    var e = jQuery.Event( "keydown", { which: key, keyCode: key } );
    jQuery( "body" ).trigger( e );
}

function release(key)
{
    var e = jQuery.Event( "keyup", { which: key, keyCode: key } );
    jQuery( "body" ).trigger( e );
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
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
            'app_client': 'auth_snake',
            'passkey': passkey,
            'accessToken': accessToken,
            'csrf_token': odoo.csrf_token,
        };
        //$.ajaxSetup({async: false});
        setConfirmUnloadPoints(true);
        return $.post( "/pi-points", data).done(function(data) {
            setConfirmUnloadPoints(false);
            data = JSON.parse(data);
            if(data.result && data.points > 0)
            {
                if(data.x2_game)
                {
                    $("#x2_game").show();
                }else
                {
                    $("#x2_game").hide();
                }
                totalpoints += data.points;
                $("#score-points").html("<strong>+" + data.points + " <i class='fa fa-level-up'></i></strong>. " + $("#session_points_message").text() + "<strong>" + totalpoints + "</strong>");
                //alert("+" + points + $("#points_message").text());
            }
        }).fail(function() {
            setConfirmUnloadPoints(false);
        });
    }
}

function get_user(pause) {
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
                
                if(data.x2_game)
                {
                    $("#x2_game").show();
                }else
                {
                    $("#x2_game").hide();
                }
                
                if(data.unblocked)
                {
                    unblocked = data.unblocked;
                    
                    $("#reset_pause_controls").show();
                    $("#plus_minus_controls").show();
                    $("#pause").show();
                    $("#reset").show();
                    $("#minus").show();
                    $("#plus").show();
                    if($("#disable_dragging").is(":hidden"))
                    {
                        $("#enable_dragging").show();
                        $('#disable_dragging').hide();
                    }
                    $("#pi_donate").hide();
                    $("#button_click").hide();
                    
                    if(pause)
                        press(80);
                        
                    $("#test_game").hide();
                }else if(["Mainnet OFF"].includes($("#mainnet").val()))
                {
                    alert("You can use Snake, for testing purposes, until Pi OpenMainnet. No points will be shared for this game by now.");
                    $("#reset_pause_controls").show();
                    $("#plus_minus_controls").show();
                    $("#pause").show();
                    $("#reset").show();
                    $("#minus").show();
                    $("#plus").show();
                    if($("#disable_dragging").is(":hidden"))
                    {
                        $("#enable_dragging").show();
                        $('#disable_dragging').hide();
                    }
                    $("#pi_donate").hide();
                    $("#button_click").hide();
                    
                    if(pause)
                        press(80);
                    
                    $("#test_game").hide();
                }
                else
                {
                    $("#reset_pause_controls").hide();
                    $("#plus_minus_controls").hide();
                    $("#pause").hide();
                    $("#reset").hide();
                    $("#minus").hide();
                    $("#plus").hide();
                    if($("#disable_dragging").is(":hidden"))
                    {
                        $("#enable_dragging").show();
                        $('#disable_dragging').hide();
                    }
                    $("#pi_donate").hide();
                    $("#button_click").show();
                    
                    $("#test_game").prop( "disabled", false );
                    $("#test_game").click(function(){
                        alert("You can use Snake, for testing purposes, until you unblock the game. No points will be shared for this game on testing mode.");
                        $("#reset_pause_controls").show();
                        $("#plus_minus_controls").show();
                        $("#pause").show();
                        $("#reset").show();
                        $("#minus").show();
                        $("#plus").show();
                        if($("#disable_dragging").is(":hidden"))
                        {
                            $("#enable_dragging").show();
                            $('#disable_dragging').hide();
                        }
                        $("#pi_donate").hide();
                        $("#button_click").show();
                        
                        if(pause)
                            press(80);
                        $("#test_game").hide();
                    });
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
        //alert(err);
        // Not able to fetch the user
    }
}

$( document ).ready(function() {
    
    $(document).ajaxStop(function() {
                $("#loading_word").hide();
            });
    
    amount = $("#amount").val();
    
    $("#x2_game").click(function(){
        alert($("#modal_x2_game_message").text());
    });
    
    async function auth() {
        $("#pause").hide();
        $("#reset").hide();
        $("#pi_donate").hide();
        $("#button_click").show();
        
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
                
                var data={
                        'action': 'complete',
                        'paymentId': payment.identifier,
                        'txid': txid,
                        'app_client': 'auth_snake',
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
                
                //get_user(false);
                set_points(0).always(function(){
                    get_user(true).always(function(){
                        //if(show_pi_ad_user && ["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                        //    showPiAds(Pi);
                        
                        $( "#button_click" ).click(function() {
                            if(parseFloat($("#pi_donate").val()) >= parseFloat(amount))
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
                setConfirmUnload(false);
                //Pi.openShareDialog("Error", error);
                //alert(err);
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
              memo: "Donate to unlock LatinChain Games (Snake)", // e.g: "Digital kitten #1234",
              // An arbitrary developer-provided metadata object - for your own usage:
              metadata: { paymentType: "donation" /* ... */ }, // e.g: { kittenId: 1234 }
            }, {
                  // Callbacks you need to implement - read more about those in the detailed docs linked below:
                  onReadyForServerApproval: function(paymentId) { 
                        var data={
                                'action': 'approve',
                                'paymentId': paymentId,
                                "txid": '',
                                'app_client': 'auth_snake',
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
                        var data={
                                'action': 'complete',
                                'paymentId': paymentId,
                                "txid": txid,
                                'app_client': 'auth_snake',
                                'accessToken': accessToken,
                                'pi_user_code': pi_user_code,
                                'pi_user_id': pi_user_id,
                                'csrf_token': odoo.csrf_token,
                            };
                        setConfirmUnload(true);
                        return $.post( "/pi-api", data).done(function(data) {
                                    setConfirmUnload(false);
                                    $("#button_click").prop( "disabled", false );
                                    data = JSON.parse(data);
                                    if(data.result && data.completed)
                                        get_user(true);
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
    
    // you usually would check the ads support ahead of time and store the information
    (async () => {
        await Pi.init({ version: "2.0", sandbox: $("#sandbox").val() });
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
            }, 10000);
        }else if(confirm($("#modal_login_latinchain_v2_message").text()))
        {
            auth();
            localStorage.setItem("loggedIn", true);
        
            setTimeout(function ()
            {
                if(pi_user_id == "" && pi_user_code == "")
                    auth();
            }, 10000);
        }
    
    })();
    
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
