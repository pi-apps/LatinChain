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

    def initialize(self, api_key, wallet_private_key):
        if not self.validate_private_seed_format(wallet_private_key):
            print("Not valid private seed")
        self.api_key = api_key
        self.account = self.load_account(wallet_private_key)
        self.base_url = "https://api.minepi.com"

        self.open_payments = {}

    def get_payment(self, payment_id):
        url = base_url + "/v2/payments/" + payment_id
        
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
            
            print(str(obj))
            
            url = self.base_url + "/v2/payments"

            re = requests.post(url,data=obj,json=obj,headers=self.get_http_headers())

            parsed_response = self.handle_http_response(re)

            identifier = parsed_response["identifier"]
            self.open_payments[identifier] = parsed_response

            return identifier
        except:
            return ""

    def submit_payment(self, payment_id):
        payment = self.open_payments[payment_id]

        self.set_horizon_client(payment["network"])
        from_address = payment["from_address"]

        transaction_data = {
          "amount": payment["amount"],
          "identifier": payment["identifier"],
          "recipient": payment["to_address"]
        }

        transaction = self.build_a2u_transaction(transaction_data)
        txid = self.submit_transaction(transaction)

        self.open_payments.delete(payment_id)

        return txid

    def complete_payment(self, identifier, txid):
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
        url = base_url + "/v2/payments/incomplete_server_payments"
        
        re = requests.get(url,headers=self.get_http_headers())

        res = self.handle_http_response(re)
        res["incomplete_server_payments"]

    def get_http_headers(self):
        return {'Authorization': "Key " + self.api_key, "Content-Type": "application/json"}

    def handle_http_response(self, re):
        try:
            print(str(re))
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            print(str(result_dict))
            if re.status == 200:
                result = re.json()
            
                result_dict = json.loads(str(json.dumps(result)))
                
                parsed_response = result_dict
                return parsed_response
            else:
                return False
        except:
            return False

    def set_horizon_client(self, network):
        if network == "Pi Network":
            host = "api.mainnet.minepi.com"
            horizon = "https://api.mainnet.minepi.com"
        else:
            host = "api.testnet.minepi.com"
            horizon = "https://api.testnet.minepi.com"
            
        client = s_sdk.Client(host=host, horizon=horizon)
        s_sdk.default_network = network

        client = client

    def load_account(self, private_seed):
        keypair = s_sdk.Keypair.from_secret(private_seed)
        
        server = s_sdk.Server("https://api.testnet.minepi.com")
        self.account = server.load_account(keypair.public_key)

    def build_a2u_transaction(self, transaction_data):
        #raise StandardError.new("You should use a private seed of your app wallet!") if self.from_address != self.account.address

        if not self.validate_payment_data(transaction_data):
            print("Not valid transaction")

        amount = s_sdk.Amount(transaction_data[amount])
        # TODO: get this from horizon
        fee = 100000 # 0.01π
        recipient = s_sdk.Keypair.from_address(transaction_data[recipient])
        memo = s_sdk.Memo(memo_text, transaction_data[identifier])

        payment_operation = s_sdk.Operation.payment({
          destination: recipient,
          amount: amount.to_payment
        })

        my_public_key = self.account.address
        sequence_number = self.client.account_info(my_public_key).sequence.to_i
        transaction_builder = s_sdk.TransactionBuilder(
          source_account = self.account.keypair,
          sequence_number = sequence_number + 1,
          base_fee = fee,
          memo = memo
        )

        transaction = transaction_builder.add_operation(payment_operation).set_timeout(180000).build

    def submit_transaction(self, transaction):
        envelope = transaction.to_envelope(self.account.keypair)
        response = self.client.submit_transaction(tx_envelope= envelope)
        txid = response._response.body["id"]

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
pi.initialize(api_key, wallet_private_seed)

user_uid = ""
payment_data = {
  "amount": 1,
  "memo": "From app to user test",
  "metadata": {"test": "your metadata"},
  "uid": user_uid
}
payment_id = pi.create_payment(payment_data)

print(payment_id)

txid = pi.submit_payment(payment_id)

payment = pi.complete_payment(payment_id, txid)
