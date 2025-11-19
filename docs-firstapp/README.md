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
https://github.com/rockcesar/PiNetworkDevelopments/tree/master/piapp-example/piads.html

# For functional PiAds rewarded example, check the following file

For the Frontend, find the code: $( "#button_reward_ad" ).click(async function() {

https://github.com/rockcesar/LatinChainDevelops/blob/master/website_pinetwork_games_odoo/static/src/js/functions.js

Then, in the Backend, find the code: @http.route('/set-latin-points', type='http', auth="public", website=True, csrf=False, methods=['POST'])

https://github.com/rockcesar/LatinChainDevelops/blob/master/website_pinetwork_odoo/controllers/main.py

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

    //Create Token (Trust line)
    async function creatingToken()
    {
        const StellarSDK = require("@stellar/stellar-sdk");

        const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
        const NETWORK_PASSPHRASE = "Pi Testnet";

        // prepare keypairs
        const issuerKeypair = StellarSDK.Keypair.fromSecret(""); // use actual secret key here
        const distributorKeypair = StellarSDK.Keypair.fromSecret(""); // use actual secret key here

        // define a token
        // token code should be alphanumeric and up to 12 characters, case sensitive
        //CHANGE THIS (TOKEN NAME)
        const customToken = new StellarSDK.Asset("TokenName", issuerKeypair.publicKey());

        const distributorAccount = await server.loadAccount(distributorKeypair.publicKey());

        // look up base fee
        const response = await server.ledgers().order("desc").limit(1).call();
        const latestBlock = response.records[0];
        const baseFee = latestBlock.base_fee_in_stroops;
        
        // prepare a transaction that establishes trustline
        const trustlineTransaction = new StellarSDK.TransactionBuilder(distributorAccount, {
          fee: baseFee,
          networkPassphrase: NETWORK_PASSPHRASE,
          timebounds: await server.fetchTimebounds(90),
        })
        //CHANGE THIS (LIMIT)
          .addOperation(StellarSDK.Operation.changeTrust({ asset: customToken, limit: "100000000" }))
          .build();

        trustlineTransaction.sign(distributorKeypair);

        // submit a tx
        await server.submitTransaction(trustlineTransaction);
        console.log("Trustline created successfully");
    }
    
MINTING TOKEN:

    //Mint Token
    async function mintingToken()
    {
        const StellarSDK = require("@stellar/stellar-sdk");
        
        const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
        const NETWORK_PASSPHRASE = "Pi Testnet";

        // prepare keypairs
        const issuerKeypair = StellarSDK.Keypair.fromSecret(""); // use actual secret key here
        const distributorKeypair = StellarSDK.Keypair.fromSecret(""); // use actual secret key here

        // define a token
        // token code should be alphanumeric and up to 12 characters, case sensitive
        //CHANGE THIS (TOKEN NAME)
        const customToken = new StellarSDK.Asset("TokenName", issuerKeypair.publicKey());

        const distributorAccount = await server.loadAccount(distributorKeypair.publicKey());

        // look up base fee
        const response = await server.ledgers().order("desc").limit(1).call();
        const latestBlock = response.records[0];
        const baseFee = latestBlock.base_fee_in_stroops;

        //====================================================================================
        // now mint LatinChain by sending from issuer account to distributor account

        const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());

        const paymentTransaction = new StellarSDK.TransactionBuilder(issuerAccount, {
          fee: baseFee,
          networkPassphrase: NETWORK_PASSPHRASE,
          timebounds: await server.fetchTimebounds(90),
        })
          .addOperation(
            StellarSDK.Operation.payment({
              destination: distributorKeypair.publicKey(),
              asset: customToken,
              //CHANGE THIS (AMOUNT, NO MORE THAN LIMIT IN TOKEN CREATION)
              amount: "100000000", // amount to mint
            })
          )
          .build();

        paymentTransaction.sign(issuerKeypair);

        // submit a tx
        await server.submitTransaction(paymentTransaction);
        console.log("Token issued successfully");

        // checking new balance of the distributor account
        const updatedDistributorAccount = await server.loadAccount(distributorKeypair.publicKey());
        updatedDistributorAccount.balances.forEach((balance) => {
          if (balance.asset_type === "native") {
            console.log(`Test-Pi Balance: ${balance.balance}`);
          } else {
            console.log(`${balance.asset_code} Balance: ${balance.balance}`);
          }
        });
    }

SETTING HOME DOMAIN (FOR THE TOML FILE):

    //Setting Home Domain (TOML file should be at https://yourdomain.com/.well-known/pi.toml)
    async function settingHomeDomainTOMLToken()
    {
        const StellarSDK = require("@stellar/stellar-sdk");

        const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
        const NETWORK_PASSPHRASE = "Pi Testnet";

        // prepare keypairs
        const issuerKeypair = StellarSDK.Keypair.fromSecret(""); // use actual secret key here

        const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
        
        // look up base fee
        const response = await server.ledgers().order("desc").limit(1).call();
        const latestBlock = response.records[0];
        const baseFee = latestBlock.base_fee_in_stroops;

        const setOptionsTransaction = new StellarSDK.TransactionBuilder(issuerAccount, {
          fee: baseFee,
          networkPassphrase: NETWORK_PASSPHRASE,
          timebounds: await server.fetchTimebounds(90),
        })
        //CHANGE THIS (HOME DOMAIN)
          .addOperation(StellarSDK.Operation.setOptions({ homeDomain: "yourdomain.com" })) // replace with your actual domain
          .build();

        setOptionsTransaction.sign(issuerKeypair);

        await server.submitTransaction(setOptionsTransaction);
        console.log("Home Domain is set successfully.");
    }
