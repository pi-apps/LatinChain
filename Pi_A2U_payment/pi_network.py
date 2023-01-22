#gem_dir = Gem::Specification.find_by_name("pi_network").gem_dir
#require "#{gem_dir}/lib/errors"

import requests
import json
import stellar_sdk as s_sdk

class PiNetwork:    

    api_key = ""
    client = ""
    account = ""
    base_url = ""
    from_address = ""
    open_payments = {}
    network = ""
    server = ""
    keypair = ""

    def initialize(self, api_key, wallet_private_key, network):
        if not self.validate_private_seed_format(wallet_private_key):
            print("Not valid private seed")
        self.api_key = api_key
        self.load_account(wallet_private_key, network)
        self.base_url = "https://api.minepi.com"

        self.open_payments = {}
        
        self.network = network

    def get_payment(self, payment_id):
        url = self.base_url + "/v2/payments/" + payment_id
        
        re = requests.get(url,headers=self.get_http_headers())

        #if response.status == 404
        #    raise Errors::PaymentNotFoundError.new("Payment not found", payment_id)

        self.handle_http_response(re)

    def create_payment(self, payment_data):
        try:
            if not self.validate_payment_data(payment_data):
                print("Not valid create")

            obj = {
              'payment': payment_data,
            }
            
            #print(str(json.dumps(obj)))
            
            obj = json.dumps(obj)
            
            #print(str(obj))
            
            url = self.base_url + "/v2/payments"

            re = requests.post(url,data=obj,json=obj,headers=self.get_http_headers())

            parsed_response = self.handle_http_response(re)

            identifier = parsed_response["identifier"]
            self.open_payments[identifier] = parsed_response

            return identifier
        except:
            return ""

    def submit_payment(self, payment_id, pending_payment):
        if pending_payment == False or payment_id in self.open_payments:
            payment = self.open_payments[payment_id]
        else:
            payment = pending_payment
            
        print(str(payment))
        #return False

        self.set_horizon_client(payment["network"])
        from_address = payment["from_address"]

        transaction_data = {
          "amount": payment["amount"],
          "identifier": payment["identifier"],
          "recipient": payment["to_address"]
        }

        transaction = self.build_a2u_transaction(payment)
        txid = self.submit_transaction(transaction)

        if payment_id in self.open_payments:
            del self.open_payments[payment_id]

        return txid

    def complete_payment(self, identifier, txid):
        if not txid:
            obj = {}
        else:
            obj = {"txid": txid}
        
        obj = json.dumps(obj)
            
        url = self.base_url + "/v2/payments/" + identifier + "/complete"
        
        re = requests.post(url,data=obj,json=obj,headers=self.get_http_headers())

        self.handle_http_response(re)

    def cancel_payment(self, identifier):
        obj = {}
        
        obj = json.dumps(obj)
            
        url = self.base_url + "/v2/payments/" + identifier + "/cancel"
        
        re = requests.post(url,data=obj,json=obj,headers=self.get_http_headers())

        self.handle_http_response(re)

    def get_incomplete_server_payments(self):
        url = self.base_url + "/v2/payments/incomplete_server_payments"
        
        re = requests.get(url,headers=self.get_http_headers())

        res = self.handle_http_response(re)
        return res["incomplete_server_payments"]

    def get_http_headers(self):
        return {'Authorization': "Key " + self.api_key, "Content-Type": "application/json"}

    def handle_http_response(self, re):
        try:
            print(str(re))
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            print(str(result_dict))
            
            return result_dict
        except:
            return False

    def set_horizon_client(self, network):
        self.client = self.server
        pass

    def load_account(self, private_seed, network):
        self.keypair = s_sdk.Keypair.from_secret(private_seed)
        
        if network == "Pi Network":
            host = "api.mainnet.minepi.com"
            horizon = "https://api.mainnet.minepi.com"
        else:
            host = "api.testnet.minepi.com"
            horizon = "https://api.testnet.minepi.com"
        
        self.server = s_sdk.Server(horizon)
        self.account = self.server.load_account(self.keypair.public_key)
        
        #print("HOLAAA " + str(self.account))

    def build_a2u_transaction(self, transaction_data):
        #raise StandardError.new("You should use a private seed of your app wallet!") if self.from_address != self.account.address

        print("MEMO ")
        if not self.validate_payment_data(transaction_data):
            print("Not valid transaction")
            
        amount = str(transaction_data["amount"])
        
        # TODO: get this from horizon
        fee = 100000 # 0.01π
        to_address = transaction_data["to_address"]
        memo = transaction_data["identifier"]
        
        print("MEMO " + str(memo))
        
        from_address = transaction_data["from_address"]
            
        transaction = (
            s_sdk.TransactionBuilder(
                source_account=self.account,
                network_passphrase=self.network,
                base_fee=fee,
            )
            .add_text_memo(memo)
            .append_payment_op(to_address, s_sdk.Asset.native(), amount)
            .set_timeout(30)
            .build()
        )
        
        return transaction

    def submit_transaction(self, transaction):
        #print(str(self.keypair))
        transaction.sign(self.keypair)
        response = self.server.submit_transaction(transaction)
        
        #envelope = transaction.to_envelope(self.keypair)
        #response = self.server.submit_transaction(transaction)
        
        
        #envelope = transaction.to_envelope(self.account.keypair)
        #response = self.client.submit_transaction(tx_envelope= envelope)
        
        #print(str(response["id"]))
        txid = response["id"]
        
        return txid

    def validate_payment_data(self, data):
        if "amount" not in data:
            return False
        elif "memo" not in data:
            return False
        elif "metadata" not in data:
            return False
        elif "uid" not in data:
            return False
        elif "identifier" not in data:
            return False
        elif "recipient" not in data:
            return False
        return True

    def validate_private_seed_format(self, seed):
        if not seed.upper().startswith("S"):
            return False
        elif len(seed) != 56:
            return False
        return True

# DO NOT expose these values to public
api_key = ""
wallet_private_seed = "" # starts with S

pi = PiNetwork()
pi.initialize(api_key, wallet_private_seed, "Pi Testnet")

user_uid = ""
payment_data = {
  "amount": 1,
  "memo": "From app to user test",
  "metadata": {"test": "your metadata"},
  "uid": user_uid
}

incomplete_payments = pi.get_incomplete_server_payments()

print("INCOMPLETE")
print(str(incomplete_payments))

from typing import Union

for i in incomplete_payments:
    r = s_sdk.HashMemo(str("From app to user test"), str(i["identifier"]))
    print(str(r))
    if i["transaction"] == None:
        txid = pi.submit_payment(i["identifier"], i)
        pi.complete_payment(i["identifier"], txid)
    else:
        pi.complete_payment(i["identifier"], i["transaction"]["txid"])

payment_id = pi.create_payment(payment_data)

txid = pi.submit_payment(payment_id, False)
#txid = pi.submit_payment("jGCjzZqgg78B6Pf1wzYHFSBTqNIv")

payment = pi.complete_payment(payment_id, txid)
