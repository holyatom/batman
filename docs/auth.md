## Auth

### Log in

Request:
```json
POST /api/auth

{
   "username": "atomiomi",
   "password": "123456"
}
```
Response:

```json
{
  "_id": "55ea0a9f95164eb41cec6d51",
  "created": "2015-09-04T21:18:23.681Z",
  "username": "atomiomi",
  "__v": 0,
  "image_url": "/images/default_avatar.jpg",
  "token": {
    "value": "asdasldmasd;mas;dmas;dlmas;ldma;slmdas;ldm",
    "expires": "2015-09-07T04:16:41.081Z"
  }
}
```
