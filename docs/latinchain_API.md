# LatinChain API

The platform API allows you to read data on the LatinChain Servers related.

## Overview

### Base path:

The latest version of the LatinChain API is available at `latin-chain.com/api`.

### Authorization

You only are going to read info, no authorization required.

## API Reference

### Users

Base path: `/api/get-external-user`.

#### Get an user:

Get information about an user.

```
POST /api/get-external-user

$.post("https://latin-chain.com/api/get-external-user", data={'pi_user_code': 'rockcesar'}, function(data, status){
  alert("Data: " + data.result + "\nStatus: " + status);
});
```

* Response type: [UserDTO](#UserDTO)

* In case the user doesn't exists, the response is type: [FailDTO](#FailDTO)

### Winner users

Base path: `/api/get-external-winners`.

#### Get winners:

Get information about winners.

```
POST /api/get-external-winners

$.post("https://latin-chain.com/api/get-external-winners", function(data, status){
  alert("Data: " + data.result + "\nStatus: " + status);
});
```

* Response type: [WinnerDTO](#WinnerDTO)

* In case the user doesn't exists, the response is type: [FailDTO](#FailDTO)

## Resource types

### `UserDTO`

```typescript
{
"result": boolean, // Result: True is ok, False is fail
"pi_user_code": string, // Pi code of the user
"points": float, // Total points in games
"points_chess": float, // Total points in chess
"points_sudoku": float, // Total points in sudoku
"points_snake": float, // Total points in snake
"points_datetime": string, // Datetime of the last update of points in any game
"unblocked": boolean, // If the user is verified: True is verified, False is not verified
"unblocked_datetime": string, // Datetime of user verification
"days_available": string, // Days available since the last unblocking
"is_winner": boolean // If the user is winner: True is winner, False is not winner
}
```

### `WinnerDTO`

```typescript
{
"result": boolean, // Result: True is ok, False is fail
"pi_winner_list": [ // List of winners
    { // For each winner:
        "pi_user_code": string, // Pi code of the user
        "points": float, // Total points in games
        "points_chess": float, // Total points in chess
        "points_sudoku": float, // Total points in sudoku
        "points_snake": float, // Total points in snake
        "points_datetime": string, // Datetime of the last update of points in any game
        "unblocked": boolean, // If the user is verified: True is verified, False is not verified
        "unblocked_datetime": string, // Datetime of user verification
        "days_available": string, // Days available since the last unblocking
        "is_winner": boolean // If the user is winner: True is winner, False is not winner
    }
]
}
```

### `FailDTO`

```typescript
{
"result": boolean // Result: True is ok, False is fail
}
```
