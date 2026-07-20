"use strict";

var pi_user_id = "";
var pi_user_code = "";
var accessToken = "";

var passkey = "";
var unblocked = false;
var show_pi_ad_user = true;
const Pi = window.Pi;

var myData = {};

function copyToClipboard(text) {
    var sampleTextarea = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = text; // save main text in it
    sampleTextarea.select(); // select textarea contents
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
}

// Utility delay function if not globally defined
const delayAsync = (ms) => new Promise(resolve => setTimeout(resolve, ms));

$(document).ready(function () {
    window.addEventListener('unhandledrejection', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    });

    myData.pi_user_code = pi_user_code;
    myData.pi_user_id = pi_user_id;
    myData.accessToken = accessToken;

    var table = $('#transactions').DataTable({
        responsive: true,
        ajax: {
            'type': 'POST',
            'url': '/get-transactions-data/latinchain',
            'data': function (d) {
                return $.extend(d, myData);
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
    });

    function set_points(points) {
        if (pi_user_id !== "" && pi_user_code !== "") {
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'points': points,
                'passkey': passkey,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            return $.post("/pi-points", data).done(function (data) {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    console.error("Error parsing points response:", err);
                }
            }).fail(function (err) {
                console.error("Failed to set points:", err);
            });
        }
        return $.Deferred().resolve().promise();
    }

    function get_user() {
        if (pi_user_id !== "" && pi_user_code !== "") {
            var data = {
                'pi_user_id': pi_user_id,
                'pi_user_code': pi_user_code,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            return $.post("/get-user", data).done(function (data) {
                try {
                    data = JSON.parse(data);
                    if (data.result) {
                        if (data.complete_found) {
                            alert($("#payment_message").text());
                        }
                        show_pi_ad_user = data.show_pi_ad;
                        passkey = data.passkey;
                        if (data.unblocked) {
                            unblocked = data.unblocked;
                        }
                    }
                } catch (err) {
                    console.error("Error parsing user data:", err);
                }
            }).fail(function (err) {
                console.error("Failed to fetch user:", err);
            });
        }
        return $.Deferred().resolve().promise();
    }

    async function showPiAds(Pi) {
        try {
            const isAdReadyResponse = await Pi.Ads.isAdReady("interstitial");

            if (isAdReadyResponse.ready === false) {
                await Pi.Ads.requestAd("interstitial");
            }

            const showAdResponse = await Pi.Ads.showAd("interstitial");

            if (showAdResponse.result === "AD_CLOSED") {
                if (pi_user_id !== "" && pi_user_code !== "") {
                    var data = {
                        'pi_user_id': pi_user_id,
                        'pi_user_code': pi_user_code,
                        'accessToken': accessToken,
                        'csrf_token': odoo.csrf_token,
                    };
                    return $.post("/set-pi-ad-datetime", data).done(function (data) {
                        try {
                            data = JSON.parse(data);
                        } catch (err) {
                            console.error("Error parsing ad datetime response:", err);
                        }
                    }).fail(function (err) {
                        console.error("Failed to set ad datetime:", err);
                    });
                }
            }
        } catch (err) {
            console.error("Ad error:", err);
        }
    }

    /**
     * Handle Incomplete Payments found during Authentication
     */
    function onIncompletePaymentFound(payment) {
        console.warn("Incomplete payment detected:", payment);
        if (payment) {
            var data = {
                'payment_id': payment.identifier,
                'txid': payment.transaction ? payment.transaction.txid : '',
                'pi_user_id': pi_user_id,
                'accessToken': accessToken,
                'csrf_token': odoo.csrf_token,
            };
            return $.post("/complete-incomplete-payment", data).done(function (res) {
                console.log("Incomplete payment submitted to server:", res);
            }).fail(function (err) {
                console.error("Failed to complete pending payment:", err);
            });
        }
    }

    async function auth() {
        try {
            const scopes = ['username', 'payments', 'wallet_address'];

            Pi.authenticate(scopes, onIncompletePaymentFound).then(function (auth) {
                pi_user_id = auth.user.uid;
                pi_user_code = auth.user.username;
                accessToken = auth.accessToken;

                $('#username').html(" " + auth.user.username);

                myData.pi_user_code = pi_user_code;
                myData.pi_user_id = pi_user_id;
                myData.accessToken = accessToken;
                table.ajax.reload();

                set_points(0).always(function () {
                    get_user().always(function () {
                        if (show_pi_ad_user && ["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val())) {
                            showPiAds(Pi);
                        }
                    });
                });
            }).catch(function (error) {
                console.error("Pi Authentication failed:", error);
            });
        } catch (err) {
            console.error("Auth Exception:", err);
        }
    }

    // Pi SDK Initialization and Auto-Login logic
    (async () => {
        try {
            const isSandbox = $("#sandbox").val() === "true" || $("#sandbox").val() === true;
            await Pi.init({ version: "2.0", sandbox: isSandbox });
        } catch (e) {
            console.error("Pi Init error:", e);
        }

        try {
            if (["Mainnet ON", "Mainnet OFF"].includes($("#mainnet").val())) {
                const nativeFeaturesList = await Pi.nativeFeaturesList();
                const adNetworkSupported = nativeFeaturesList.includes("ad_network");

                if (!adNetworkSupported) {
                    alert("Please update your Pi Browser version.");
                }
            }
        } catch (e) {
            console.error("Native features check error:", e);
        }

        if (localStorage.getItem("loggedIn")) {
            auth();

            setTimeout(function () {
                if (pi_user_id === "" && pi_user_code === "") {
                    auth();
                }
            }, 10000);
        } else {
            await delayAsync(5000);

            if (confirm($("#modal_login_latinchain_v2_message").text())) {
                auth();
                localStorage.setItem("loggedIn", "true");

                setTimeout(function () {
                    if (pi_user_id === "" && pi_user_code === "") {
                        auth();
                    }
                }, 10000);
            }
        }
    })();

    $("#clear_cache").click(function () {
        try {
            if (window.caches) {
                caches.keys().then(function (names) {
                    for (let name of names) caches.delete(name);
                });
            }
        } catch (err) {
            console.error("Cache clearance error:", err);
        }
        try {
            window.location.reload(true);
        } catch (err) {
            console.error(err);
        }
    });

    $("#back").click(function () {
        location.href = "/";
    });
});