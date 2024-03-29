## User Following

### List followers of a user :lock:

Request for a specific user:
```js
GET /api/users/:username/followers
```

Request for an authorized user:
```js
GET /api/users/profile/followers
```

Response:
```json
{
  "total": 1,
  "page": 1,
  "per_page": 20,
  "collection": [
    {
      "_id": "55ec37acedce5c0016801f8e",
      "full_name": "Dmitriy Melnik",
      "username": "mitro",
      "image_url": "/images/default_avatar.jpg"
    }
  ]
}
```

### Count followers of a user :lock:

Request for a specific user:
```js
GET /api/users/:username/followers/count
```

Request for an authorized user:
```js
GET /api/users/profile/followers/count
```

Response:
```json
{
  "count": 1
}
```

### List users followed by another user :lock:

Request for a specific user:
```js
GET /api/users/:username/following
```

Request for an authorized user:
```js
GET /api/users/profile/following
```

Response:
```json
{
  "total": 1,
  "page": 1,
  "per_page": 20,
  "collection": [
    {
      "_id": "55f9a3779d41eeda31674c8b",
      "full_name": "Ivan Ivanov",
      "username": "ivan",
      "image_url": "/images/default_avatar.jpg"
    }
  ]
}
```

### Count users followed by another user :lock:

Request for a specific user:
```js
GET /api/users/:username/following/count
```

Request for an authorized user:
```js
GET /api/users/profile/following/count
```

Response:
```json
{
  "count": 1
}
```

### Follow a user :lock:

Request:
```js
POST /api/users/profile/following/:username
```

Response in case of success:
```json
{
  "success": true
}
```

Response in case target user does not exist:

```HTTP
Status: 404 Not Found
```

### Unfollow a user :lock:

Request:
```js
DELETE /api/users/profile/following/:username
```

Response in case of success:
```json
{
  "success": true
}
```

Response in case target user does not exist:

```HTTP
Status: 404 Not Found
```
