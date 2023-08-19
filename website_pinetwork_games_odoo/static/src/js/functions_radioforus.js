var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";
var passkey = "";
const Pi = window.Pi;

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
            if(data.result && points > 0)
                alert("You won " + points + " points");
        }).fail(function() {
            
        });
    }
}

function get_user(donation) {
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
                passkey=data.passkey;
                if(data.unblocked)
                {
                    if(donation)
                        alert("Thank you for your donation. User " + pi_user_code + " unblocked.");
                }
            }
        }).fail(function() {
            
        });
    }
}

$( document ).ready(function() {
    $(document).ajaxStop(function() {
                $("#loading_word").hide();
            });
    
    Pi.init({ version: "2.0", sandbox: $("#sandbox").val() });

    //alert(PiNetworkClient);

    async function auth() {
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
                        'app_client': 'auth_example',
                        'csrf_token': odoo.csrf_token,
                        'accessToken': accessToken,
                        'pi_user_code': pi_user_code,
                        'pi_user_id': pi_user_id,
                    };
                return $.post( "/pi-api", data).done(function(data) {
                    $("#button_click").prop( "disabled", false );
                    try {
                        data = JSON.parse(data);
                        if(data.result && data.completed)
                        {
                            alert("A payment was registered. Reload the page to view the changes.");
                        }
                    } catch (e) {
                    }
                }).fail(function() {
                    $("#button_click").prop( "disabled", false );
                });
            }; // Read more about this in the SDK reference

            Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                pi_user_id = auth.user.uid;
                pi_user_code = auth.user.username;
                accessToken = auth.accessToken;
              
                //get_user(false);
                set_points(0).always(function(){
                    get_user(false).always(function(){
                        $( "#button_click" ).click(function() {
                            if((parseFloat($("#pi_donate").val()) >= parseFloat($("#amount").val())) && 
                                (parseFloat($("#pi_donate").val()) <= (parseFloat($("#amount").val())*10)))
                            {
                                $("#button_click").prop( "disabled", true );
                                /*setTimeout(function ()
                                {
                                    $("#button_click").prop( "disabled", false );
                                }, 10000);*/
                                transfer();
                            }else{
                                alert("You only can pay from " + $("#amount").val() + " Pi to " + (parseFloat($("#amount").val())*10) + " Pi.");
                            }
                        });
                        $("#button_click").prop( "disabled", false );
                    });
                });
            
              
                //alert('Hello ' + auth.user.username);
            }).catch(function(error) {
              console.error(error);
            });
        } catch (err) {
            alert(err);
            // Not able to fetch the user
        }
    }

    async function transfer() {
        try {
            const payment = Pi.createPayment({
              // Amount of π to be paid:
              amount: parseFloat($("#pi_donate").val()),
              // An explanation of the payment - will be shown to the user:
              memo: "Pay to unlock RadioForUs", // e.g: "Digital kitten #1234",
              // An arbitrary developer-provided metadata object - for your own usage:
              metadata: { paymentType: "donation" /* ... */ }, // e.g: { kittenId: 1234 }
            }, {
              // Callbacks you need to implement - read more about those in the detailed docs linked below:
              onReadyForServerApproval: function(paymentId) {
                  var data = {
                            'action': 'approve',
                            'paymentId': paymentId,
                            'txid': '',
                            'app_client': 'auth_example',
                            'csrf_token': odoo.csrf_token,
                            'accessToken': accessToken,
                            'pi_user_code': pi_user_code,
                            'pi_user_id': pi_user_id,
                        };
                  return $.post( "/pi-api", data).done(function(data) {
                        $("#button_click").prop( "disabled", false );
                    }).fail(function() {
                        $("#button_click").prop( "disabled", false );
                    });
              },
              onReadyForServerCompletion: function(paymentId, txid) {
                    var data = {
                        'action': 'complete',
                        'paymentId': paymentId,
                        "txid": txid,
                        'app_client': 'auth_example',
                        'csrf_token': odoo.csrf_token,
                        'accessToken': accessToken,
                        'pi_user_code': pi_user_code,
                        'pi_user_id': pi_user_id,
                    };
                    return $.post( "/pi-api", data).done(function(data) {
                        $("#button_click").prop( "disabled", false );
                        
                        data = JSON.parse(data);
                        if(data.result && data.completed)
                            get_user(true);
                    }).fail(function() {
                        $("#button_click").prop( "disabled", false );
                    });
              },
              onCancel: function(paymentId) { $("#button_click").prop( "disabled", false ); /* ... */ },
              onError: function(error, payment) { $("#button_click").prop( "disabled", false ); /* ... */ },
            });
        } catch(err) {
            $("#button_click").prop( "disabled", false );
            alert(err);
            // Technical problem (eg network failure). Please try again
        }
    }

    auth();

});
