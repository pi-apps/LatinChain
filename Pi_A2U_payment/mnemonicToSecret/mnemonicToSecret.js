/*
Install these packages:

sudo npm install stellar-sdk
sudo npm install bip39
sudo npm install @hawkingnetwork/ed25519-hd-key-rn

To execute, is like this:

node mnemonicToSeed.js
*/

const StellarSdk = require('stellar-sdk');
const bip39 = require('bip39');
const {derivePath} = require('@hawkingnetwork/ed25519-hd-key-rn');

const testnetApiEndpoint = 'https://api.testnet.minepi.com/';
const server = new StellarSdk.Server(testnetApiEndpoint);

const mnemonic_passphrase = ""; // Set here your passphrase seed. Don't share it with anyone.

async function getApplicationPrivateKey() {
  const seed = await bip39.mnemonicToSeed(mnemonic_passphrase);
  const derivedSeed = derivePath("m/44'/314159'/0'", seed); //derivation path of Pi Network mnemonic

  const key = StellarSdk.Keypair.fromRawEd25519Seed(derivedSeed.key)

  return {'publicKey': key.publicKey(), 'secret': key.secret()}
}

async function printKeys(){
    const result = await getApplicationPrivateKey();

    console.log(result);
}

printKeys();
