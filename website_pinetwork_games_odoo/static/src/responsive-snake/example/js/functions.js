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
            'app_client': 'auth_snake',
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
                passkey=data.passkey;
                if(data.unblocked)
                {
                    $("#pause").show();
                    $("#reset").show();
                    $("#minus").show();
                    $("#plus").show();
                    $("#enable_dragging").show();
                    $('#disable_dragging').hide();
                    $("#pi_donate").hide();
                    $("#button_click").hide();
                    
                    if(pause)
                        $("#pause").click();
                }
                else
                {
                    $("#pause").hide();
                    $("#reset").hide();
                    $("#minus").hide();
                    $("#plus").hide();
                    $("#enable_dragging").hide();
                    $('#disable_dragging').hide();
                    $("#pi_donate").hide();
                    $("#button_click").show();
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
            const scopes = ['username', 'payments'];
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
                    get_user(true).always(function(){
                        $( "#button_click" ).click(function() {
                            if(parseFloat($("#pi_donate").val()) >= parseFloat($("#amount").val()))
                            {
                                $("#button_click").prop( "disabled", true );
                                /*setTimeout(function ()
                                {
                                    $("#button_click").prop( "disabled", false );
                                }, 10000);*/
                                transfer();
                            }else{
                                alert("You can't pay less than " + $("#amount").val() + " Pi.");
                            }
                        });
                        $("#button_click").prop( "disabled", false );
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
    
    async function transfer() {
        try {
            const payment = Pi.createPayment({
              // Amount of π to be paid:
              amount: parseFloat($("#pi_donate").val()),
              // An explanation of the payment - will be shown to the user:
              memo: "Pay to unlock LatinChain Games (Snake)", // e.g: "Digital kitten #1234",
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
                        
                        return $.post( "/pi-api", data).done(function(data) {
                                    $("#button_click").prop( "disabled", false );
                                }).fail(function() {
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
                        
                        return $.post( "/pi-api", data).done(function(data) {
                                    $("#button_click").prop( "disabled", false );
                                    get_user(true);
                                }).fail(function() {
                                    $("#button_click").prop( "disabled", false );
                                });
                  },
                  onCancel: function(paymentId) { $("#button_click").prop( "disabled", false ); /* ... */ },
                  onError: function(error, payment) { $("#button_click").prop( "disabled", false ); /* ... */ },
                });
        } catch(err) {
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
