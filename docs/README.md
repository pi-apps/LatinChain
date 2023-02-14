# Interaction with LatinChain Platform (LatinChain API docs)

Watch these docs also at: https://latin-chain.com/api-docs/

You can play games at https://latin-chain.com, but you can also browse data as developer, as easy as send a request to:

https://latin-chain.com/api/get-external-user

Sending by POST {pi_user_code}, example:

```
$.post("https://latin-chain.com/api/get-external-user", data={'pi_user_code': 'rockcesar'}, function(data, status){
  alert("Data: " + data.pi_user_code + "\nStatus: " + status);
});
```

Or you can browse at the following, to get the winners:

https://latin-chain.com/api/get-external-winners

## Usage

### Find an user

Please refer to:
* [the LatinChain API documentation](./latinchain_API.md) to learn how to interact as developer with the platform.
