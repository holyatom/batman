## User Following

### List followers of a user

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

### Count followers of a user

Request for a specific user:
```js
GET /api/users/:username/followers/count
```

Request for an authorized user:
```js
GET /api/users/profile/followers/count
```

Response:
```HTTP
1
```

### List users followed by another user

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

### Count users followed by another user

Request for a specific user:
```js
GET /api/users/:username/following/count
```

Request for an authorized user:
```js
GET /api/users/profile/following/count
```

Response:
```HTTP
1
```

### Check if one user follows another

Request for a specific user:
```js
GET /api/users/:username/following/:followee_username
```

Request for an authorized user:
```js
GET /api/users/profile/following/:followee_username
```

Response in case user follows another:
```HTTP
Status: 204 No Content
```

Response in case user does not follow another:

```HTTP
Status: 404 Not Found
```

### Follow a user :lock:

Request:
```js
PUT /api/users/profile/following/:username
```

Response in case of success:
```HTTP
Status: 204 No Content
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
```HTTP
Status: 204 No Content
```

Response in case target user does not exist:

```HTTP
Status: 404 Not Found
```