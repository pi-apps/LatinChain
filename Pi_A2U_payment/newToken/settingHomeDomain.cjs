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
