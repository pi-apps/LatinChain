# -*- coding: utf-8 -*-
"""
For more information visit https://github.com/pi-apps/pi-python
"""

from pi_python import PiNetwork

""" 
    Your SECRET Data 
    Visit the Pi Developer Portal to get these data
    
     DO NOT expose these values to public
"""
api_key = "Enter Here Your API Key" 
wallet_private_seed = "SecretWalletSeed" 

""" Initialization """
pi = PiNetwork()
pi.initialize(api_key, wallet_private_seed, "Pi Testnet")

""" 
    Example Data
    Get the user_uid from the Frontend
"""
user_uid = "GET-THIS-SECRET-DATA-FROMFRONTEND" #unique for every user


""" Build your payment """
payment_data = {
  "amount": 1,
  "memo": "Test - Greetings from MyApp",
  "metadata": {"internal_data": "My favorite ice creame"},
  "uid": user_uid
}

""" Check for incomplete payments """
incomplete_payments = pi.get_incomplete_server_payments()

if __debug__:
    if len(incomplete_payments) > 0:
        print("Found incomplete payments: ")
        print(str(incomplete_payments))

""" Handle incomplete payments first """
if len(incomplete_payments) > 0:
    for i in incomplete_payments:
        if i["transaction"] == None:
            txid = pi.submit_payment(i["identifier"], i)
            pi.complete_payment(i["identifier"], txid)
        else:
            pi.complete_payment(i["identifier"], i["transaction"]["txid"])

""" Create an payment """
payment_id = pi.create_payment(payment_data)

""" 
    Submit the payment and receive the txid
    
    Store the txid on your side!
"""
if payment_id and len(payment_id) > 0:
    txid = pi.submit_payment(payment_id, False)

    """ Complete the Payment """
    if txid and len(txid) > 0:
        payment = pi.complete_payment(payment_id, txid)
