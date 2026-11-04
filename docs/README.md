# NEW: Now you can set LatinChain Ads inside of your webpage

It's a simple iframe not competition of Pi Ads of course. Because we don't pay you for setting it. It's only if you want to have LatinChain inside your app.

How to add it:

```
<div class="latinchain-ads" style="display: flex; justify-content: center; align-items: center; width: 100%;">
    <iframe src="https://rockcesar.github.io/latinchain-ads" width="100%" height="300" frameborder="0" align="center" style="max-width: 300px; height: 300px; border: none; text-align: center; border-radius: 20px;" />
</div>
```

# Interaction with LatinChain Platform (LatinChain API docs)

A working example. Watch your LatinChain Mainnet profile, here: https://latin-chain.com/pi-sign-in/

Watch these docs also at: https://latin-chain.com/api-docs/

You can play games at https://latin-chain.com, but you can also browse data as developer, as easy as send a request to:

https://latin-chain.com/api/get-external-user

Sending by POST {pi_user_code}, example:

```
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<script>
  $.post("https://latin-chain.com/api/get-external-user", data={'pi_user_code': 'rockcesar'}, function(data, status){
    alert("Result: " + data.result + "\nStatus: " + status + "\nData: " + JSON.stringify(data));
  });
</script>
```

Or you can browse at the following, to get the winners:

https://latin-chain.com/api/get-external-winners

```
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<script>
  $.post("https://latin-chain.com/api/get-external-winners", function(data, status){
    alert("Result: " + data.result + "\nStatus: " + status + "\nData: " + JSON.stringify(data));
  });
</script>
```

## Usage

### Find an user

Please refer to:
* [the LatinChain API documentation](./latinchain_API.md) to learn how to interact as developer with the platform.
