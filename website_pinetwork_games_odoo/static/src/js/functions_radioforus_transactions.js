var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";
var unblocked = false;
var passkey = "";
const Pi = window.Pi;
var myData = {};

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
                        'app_client': 'auth_example',
                        'accessToken': accessToken,
                        'csrf_token': odoo.csrf_token,
                    };
            //$.ajaxSetup({async: false});
            return $.post( "/get-user", data).done(function(data) {
                data = JSON.parse(data);
                if(data.result)
                {
                    unblocked = data.unblocked;
                }
            }).fail(function() {
                
            });
        }
    }
    
    async function showPiAds(Pi, activated) {

        try {
            var d1 = new Date();
            var date1 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
            var date2 = new Date(date1.getTime() - 1 * 60 * 60000);
            
            if(localStorage && localStorage['pi_ad_datetime_latinchain'] > date2.getTime() && activated)
            {
                return;
            }
            
            const isAdReadyResponse = await Pi.Ads.isAdReady("interstitial");

            if (isAdReadyResponse.ready === false) {
                await Pi.Ads.requestAd("interstitial");
            }
            
            const showAdResponse = await Pi.Ads.showAd("interstitial");
            
            if(showAdResponse.result == "AD_CLOSED")
            {
                var d1 = new Date();
                var date1 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());

                localStorage['pi_ad_datetime_latinchain'] = date1.getTime();
            }
            
        } catch (err) {
        }
    }
    
    myData.pi_user_code = pi_user_code;
    myData.pi_user_id = pi_user_id;
    myData.accessToken = accessToken;
    
    var table = $('#transactions').DataTable( {
        responsive: true,
        //ajax: '/get-transactions-data',
        ajax: {
            'type': 'POST',
            'url': '/get-transactions-data/radioforus',
            'data': function ( d ) {
               return  $.extend(d, myData);
            }
        },
        processing: true,
        serverSide: true,
        serverMethod: 'post',
        columns: [
            { data: 'memo', width: "40%" },
            { data: 'amount', width: "30%" },
            { data: 'txid', width: "30%" },
        ],
        ordering: false,
        scrollCollapse: true,
        scrollX: false,
        autoWidth: false
    } );
    
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
                
                set_points(0).always(function(){
                    get_user().always(function(){
                        if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()) && !unblocked)
                            showPiAds(Pi, true);
                    });
                });
                
                $('#username').html(" " + auth.user.username);
                
                myData.pi_user_code = pi_user_code;
                myData.pi_user_id = pi_user_id;
                myData.accessToken = accessToken;
                table.ajax.reload();
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
      // store adNetworkSupported for later use
    
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
        }else
        {
            if(["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val()))
            {
                showPiAds(Pi, true);
            }
        }
    
    })();
    
    var status_audio = false;
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/website_pinetwork_games_odoo/static/src/music/music.mp3');
    audioElement.addEventListener('ended', function() {
        this.play();
    }, false);
    
    $('#play_button').click(function() {
        if(!status_audio)
        {
            audioElement.play();
            status_audio = true;
            $("#play").removeClass("fa-volume-off");
            $("#play").addClass("fa-volume-up");
            //$("#play").attr('src','/website_pinetwork_games_odoo/static/src/music/music.png');
        }
        else
        {
            audioElement.pause();
            status_audio = false;
            $("#play").removeClass("fa-volume-up");
            $("#play").addClass("fa-volume-off");
            //$("#play").attr('src','/website_pinetwork_games_odoo/static/src/music/mute.png');
        }
    });
    
    $( ".clear_cache" ).click(function() {
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
    
    $( ".back" ).click(function() {
        /*var result = confirm($( "#back_message" ).text());
        if(result)
        {
            //history.back();
            var anchor = document.createElement('a');
            anchor.href = "/";
            anchor.target="_blank";
            anchor.click();
        }*/
        
        var anchor = document.createElement('a');
        anchor.href = "/";
        anchor.target="_blank";
        anchor.click();
    });
    
    $( ".back_radioforus" ).click(function() {
        /*var result = confirm($( "#back_message" ).text());
        if(result)
        {
            //history.back();
            var anchor = document.createElement('a');
            anchor.href = $("#link_back").val();
            anchor.target="_blank";
            anchor.click();
        }*/
        
        var anchor = document.createElement('a');
        anchor.href = $("#link_back").val();
        anchor.target="_blank";
        anchor.click();
    });
});
