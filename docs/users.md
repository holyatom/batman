## Users

### Create

Request:
```json
POST /api/users

{
   "username": "chuck",
   "password": "123456",
   "full_name": "Chuck Norris"
}
```

Response:
```json
{
  "__v": 0,
  "created": "2015-09-06T04:21:35.453Z",
  "username": "chuck",
  "full_name": "Chuck Norris",
  "_id": "55ebbf4fc32d706a1e283c10",
  "image_url": "/images/default_avatar.jpg"
}
```

### Get :lock:

Request:
```json
GET /api/users/:username
```

Response:
```json
{
  "_id": "55ea0a9f95164eb41cec6d51",
  "created": "2015-09-04T21:18:23.681Z",
  "username": "atomiomi",
  "__v": 0,
  "image_url": "/images/default_avatar.jpg"
}
```

### Get current user :lock:

Request:
```json
GET /api/users/profile
```

Response:
```json
{
  "_id": "55ea0a9f95164eb41cec6d51",
  "created": "2015-09-04T21:18:23.681Z",
  "username": "atomiomi",
  "__v": 0,
  "image_url": "/images/default_avatar.jpg"
}
```

