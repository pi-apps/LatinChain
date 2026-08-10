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
