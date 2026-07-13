# -*- coding: utf-8 -*-
"""
For more information visit https://github.com/pi-apps/pi-python
"""

import requests
import json
import stellar_sdk as s_sdk

import logging
_logger = logging.getLogger(__name__)

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
    fee = ""

    def initialize(self, api_key, wallet_private_key, network):
        try:
            if not self.validate_private_seed_format(wallet_private_key):
                print("No valid private seed!")
            self.api_key = api_key
            self.load_account(wallet_private_key, network)
            self.base_url = "https://api.minepi.com"
            self.open_payments = {}        
            self.network = network
            self.fee = self.server.fetch_base_fee()
            #self.fee = fee
        except:
            return False

    def get_balance(self):
        try:
            balances = self.server.accounts().account_id(self.keypair.public_key).call()["balances"]
            balance_found = False
            for i in balances:
                if i["asset_type"] == "native":
                    return float(i["balance"])
                
            return 0
        except:
            return 0

    def get_payment(self, payment_id):
        url = self.base_url + "/v2/payments/" + payment_id
        re = requests.get(url,headers=self.get_http_headers())
        self.handle_http_response(re)

    def create_payment(self, payment_data):
        try:
            if not self.validate_payment_data(payment_data):
                if __debug__:
                    print("No valid payments found. Creating a new one...")
            
            balances = self.server.accounts().account_id(self.keypair.public_key).call()["balances"]
            balance_found = False
            for i in balances:
                if i["asset_type"] == "native":
                    balance_found = True
                    if (float(payment_data["amount"]) + (float(self.fee)/10000000)) > float(i["balance"]):
                        return ""
                    break
                    
            if balance_found == False:
                return ""

            obj = {
                'payment': payment_data,
            }

            obj = json.dumps(obj)
            url = self.base_url + "/v2/payments"
            res = requests.post(url, data=obj, json=obj, headers=self.get_http_headers())
            parsed_response = self.handle_http_response(res)

            identifier = ""
            identifier_data = {}

            if 'error' in parsed_response:
                identifier = parsed_response['payment']["identifier"]
                identifier_data = parsed_response['payment']
            else:
                identifier = parsed_response["identifier"]
                identifier_data = parsed_response

            self.open_payments[identifier] = identifier_data

            return identifier
        except:
            return ""

    def submit_payment(self, payment_id, pending_payment):
        if payment_id not in self.open_payments:
            return False
        if pending_payment == False or payment_id in self.open_payments:
            payment = self.open_payments[payment_id]
        else:
            payment = pending_payment
        
        balances = self.server.accounts().account_id(self.keypair.public_key).call()["balances"]
        balance_found = False
        for i in balances:
            if i["asset_type"] == "native":
                balance_found = True
                if (float(payment["amount"]) + (float(self.fee)/10000000)) > float(i["balance"]):
                    return ""
                break
                
        if balance_found == False:
            return ""
        
        if __debug__:
            print("Debug_Data: Payment information\n" + str(payment))

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
        if not res:
            res = {"incomplete_server_payments": []}
        return res["incomplete_server_payments"]

    def get_http_headers(self):
        return {'Authorization': "Key " + self.api_key, "Content-Type": "application/json"}

    def handle_http_response(self, re):
        try:
           
            result = re.json()
            
            result_dict = json.loads(str(json.dumps(result)))
            if __debug__:
                print("HTTP-Response: " + str(re))
                print("HTTP-Response Data: " + str(result_dict))
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


    def build_a2u_transaction(self, transaction_data):
        if not self.validate_payment_data(transaction_data):
            print("No valid transaction!")
            
        amount = str(transaction_data["amount"])
        
        # TODO: get this from horizon
        fee = self.fee # 100000 # 0.01π
        to_address = transaction_data["to_address"]
        memo = transaction_data["identifier"]
        
        if __debug__:
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
            .set_timeout(180)
            .build()
        )
        
        return transaction

    def submit_transaction(self, transaction):
        transaction.sign(self.keypair)
        response = self.server.submit_transaction(transaction)
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

