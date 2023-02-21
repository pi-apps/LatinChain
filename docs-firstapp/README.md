# How to develop a First Pi Network App

I used Odoo to develop this Pi App:

Mainnet: https://latin-chain.com

Testnet: https://test.latin-chain.com

You maybe could use your Framework election.

This is the official documentation to build a Pi App with Pi API Platform:
https://developers.minepi.com/

Official Pi App Demo example code:
https://github.com/pi-apps/demo

# Simplest example

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

Check here:
https://dev-rockcesar.blogspot.com/2022/10/how-to-develop-pi-app.html
