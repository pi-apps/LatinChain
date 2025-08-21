var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";

var passkey = "";
var unblocked = false;
var show_pi_ad_user = true;
const Pi = window.Pi;

var myData ={};

function copyToClipboard(text) {
    var sampleTextarea = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = text; //save main text in it
    sampleTextarea.select(); //select textarea contenrs
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
}
$(document).ready( function () {
    window.addEventListener('unhandledrejection', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    });

    //(adsbygoogle = window.adsbygoogle || []).push({});

    myData.pi_user_code = pi_user_code;
    myData.pi_user_id = pi_user_id;
    myData.accessToken = accessToken;

    var table = $('#transactions').DataTable( {
        responsive: true,
        //ajax: '/get-transactions-data',
        ajax: {
            'type': 'POST',
            'url': '/get-transactions-data/latinchain',
            'data': function ( d ) {
               return  $.extend(d, myData);
            }
        },
        processing: true,
        serverSide: true,
        serverMethod: 'post',
        columns: [
            { data: 'memo', width: '40%' },
            { data: 'amount', width: '30%' },
            { data: 'txid', width: '30%' },
        ],
        ordering: false,
        scrollCollapse: true,
        scrollX: false,
        autoWidth: false
    } );

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
                    if(data.complete_found)
                        alert($("#payment_message").text());
                        
                    show_pi_ad_user = data.show_pi_ad;
                    
                    passkey=data.passkey;
                    if(data.unblocked)
                    {
                        unblocked = data.unblocked;
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
                
                $('#username').html(" " + auth.user.username);
                
                myData.pi_user_code = pi_user_code;
                myData.pi_user_id = pi_user_id;
                myData.accessToken = accessToken;
                table.ajax.reload();
                
                set_points(0).always(function(){
                    get_user().always(function(){
                        //if(show_pi_ad_user && ["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
                        //    showPiAds(Pi);
                    });
                });
            }).catch(function(error) {
                console.error(error);
            });
        } catch (err) {
            console.error(err);
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

    $( "#clear_cache" ).click(function() {
        /*var result = confirm($( "#clear_cache_message" ).text());
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
        }*/
        
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
    });

    $( "#back" ).click(function() {
        /*var result = confirm($( "#back_message" ).text());
        if(result)
        {
            //history.back();
            location.href="/";
        }*/
        location.href="/";
    });
});
