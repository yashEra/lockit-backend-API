# This project representing the smart lockit system BackEnd

## Available Scripts

In the project directory, you can run:

### `npm run serve`

Runs the app in the development mode.\
Open [http://127.0.0.1:5001/lockit-332b1/us-central1/app](http://127.0.0.1:5001/lockit-332b1/us-central1/app) to view it in your browser.

## Available Data collection

### userDetails

### device

## Available APIs

#### Register a new user

(POST)
@post
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/register`

Sample Request Body

```
{
    "username": "pradishan",
    "email": "sha@gmail.com",
    "phoneNumber": "1231235235",
    "password": "*******"
}
```

#### login a user

(POST)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/login`

Sample Request Body

```
{
    "email": "sha@gmail.com",
    "password": "*******"
}
```
#### logout a user

(POST)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/logout`

#### change user password

(PUT)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/user-change-password`

Sample Request Body 

```
{
    "email": "sha@gmail.com",
    "oldPassword": "******",
    "newPassword": "XXXXXXXX"
}
```

#### Get A user

(GET)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/user/:id`

#### Get All User

(GET)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app//users`

#### Delete a user

(DELETE)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app//user/:id`

#### Update a user

(PUT)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app//user/:id`

Sample Request Body 

```
{
    "username": "sharoon",
    "email": "adsadad@gmail.com",
    "phoneNumber": "349848585"
}
```

### Devices APIs

#### Add a new Device
(POST)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/add-device`

Sample Request Body

```
{
    "deviceID": "12312",
    "owner": "1707415470018"
}
```

#### Lock a device

(POST)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/lock/:deviceID`

#### Unlock a device

(POST)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/unlock/:deviceID`

#### Block a device

(POST)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/block/:deviceID`

#### UnBlock a device

(POST)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/unblock/:deviceID`

#### Get a device

(GET)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/device/:deviceID`

#### Get a device by owner

(GET)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/devices/:ownerID`

#### Get All device

(GET)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/all-devices`

#### Delete device

(DELETE)
### `http://127.0.0.1:5001/lockit-332b1/us-central1/app/device/:deviceID`

