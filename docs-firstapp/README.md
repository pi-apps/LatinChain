# Check these resources

Udemy Course:
https://latin-chain.com/piapps-course

Amazon Book:
https://latin-chain.com/piapps-book

# How to develop a First Pi Network App

I used Odoo to develop this Pi App:

Mainnet: https://latinchain.pinet.com

Testnet: https://latinchaintest9869.pinet.com

You maybe could use your Framework election.

This is the official documentation to build a Pi App with Pi API Platform:
https://developers.minepi.com/

Official Pi App Demo example code:
https://github.com/pi-apps/demo

New ways to do Pi Payments (this is a 10 minutes guide from Pi Core Team, where they are implementing a new way to do payments, based in classes as in Oriented Object Programming):
https://minepi.com/blog/10-minutes-pi-payments/

# Simplest example for User2App payment

And the following is my Working Example for receiving Payments in Pi Platform:

This is for client side (HTML, JavaScript):
https://github.com/rockcesar/PiNetworkDevelopments/tree/master/piapp-example

This is for server side (PHP):
https://github.com/rockcesar/PiNetworkDevelopments/blob/master/server1.php

To make it works, in server1.php, you need to change the app code as auth_app1
by the one coming from client request. Example: if you have auth_example
in client JavaScript side, you must set it in server1.php.

And you need to implement authentication:
https://github.com/pi-apps/pi-platform-docs/blob/master/authentication.md

Plus, you can implement the Sharing Social Network dialog in JavaScript:
https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#share-dialog

Check here:
https://dev-rockcesar.blogspot.com/2022/10/how-to-develop-pi-app.html

# Official PiAds docs

https://github.com/pi-apps/pi-platform-docs/blob/master/ads.md

# PiAds interstitial example

This is for client side (HTML, JavaScript):
https://github.com/rockcesar/LatinChainDevelopments/tree/master/piapp-example/piads.html

# For functional PiAds rewarded example, check the following file

For the Frontend, find the code: async function showRewardedPiAd()

https://github.com/rockcesar/LatinChainDevelopments/blob/master/website_pinetwork_games_odoo/static/src/js/functions.js

Then, in the Backend, find the code: @http.route('/set-latin-points', type='http', auth="public", website=True, csrf=False, methods=['POST'])

https://github.com/rockcesar/LatinChainDevelopments/blob/master/website_pinetwork_odoo/controllers/main.py

# App2User payment made by Core Team

Ruby: https://github.com/pi-apps/pi-ruby

NodeJS: https://github.com/pi-apps/pi-nodejs

# App2User payment made by Community

Python: https://github.com/pi-apps/pi-python

Go: https://github.com/pi-apps/pi-go

Blazor: https://github.com/pi-apps/pi-blazor

C#: https://github.com/pi-apps/pi-csharp

# Creating a new Token on The Pi Network (My version)

Official DOCS: https://github.com/pi-apps/pi-platform-docs/blob/master/tokens.md

INSTALL:

    nmp install @stellar/stellar-sdk

PREREQUISITES:

You need two different wallet addresses. First for issuer and the second for distributor.

Consider use these tools to get secret key from the wallets:
    
https://github.com/rockcesar/LatinChainDevelopments/tree/master/Pi_A2U_payment/mnemonicToSecret

And this is my code version (run it in a .cjs file):

CREATE TOKEN (TRUST LINE):

https://github.com/rockcesar/LatinChainDevelopments/tree/master/Pi_A2U_payment/newToken/createTrustLine.js
    
MINTING TOKEN:

https://github.com/rockcesar/LatinChainDevelopments/tree/master/Pi_A2U_payment/newToken/mintingToken.js

SETTING HOME DOMAIN (FOR THE TOML FILE):

https://github.com/rockcesar/LatinChainDevelopments/tree/master/Pi_A2U_payment/newToken/settingHomeDomain.js

TOML FILE CONTENT:

https://github.com/rockcesar/LatinChainDevelopments/tree/master/Pi_A2U_payment/newToken/pi.toml

# External Login (pi-sign-in, My version)

Official DOCS: https://github.com/pi-apps/pi-platform-docs/blob/master/pi-sign-in.md

THIS IS MY WAY.

LOGIN PAGE: Click in button to login.

Use this file:

https://github.com/rockcesar/LatinChainDevelopments/blob/master/website_pinetwork_games_odoo/views/website_pinetwork_templates_external_login_step.xml

SHOW DATA AFTER LOGIN: Receive the login data.

Use this file:

https://github.com/rockcesar/LatinChainDevelopments/blob/master/website_pinetwork_games_odoo/views/website_pinetwork_templates_external_login.xml
