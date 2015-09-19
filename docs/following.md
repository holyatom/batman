## User Following

### List followers of a user

Request for a specific user:
```js
GET /users/:username/followers
```

Request for an authorized user:
```js
GET /users/profile/followers
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

### List users followed by another user

Request for a specific user:
```js
GET /users/:username/following
```

Request for an authorized user:
```js
GET /users/profile/following
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

### Check if one user follows another

Request for a specific user:
```js
GET /users/:username/following/:followee_username
```

Request for an authorized user:
```js
GET /users/profile/following/:followee_username
```

Response in case user follows another:
```
Status: 204 No Content
```

Response in case user does not follow another:

```
Status: 404 Not Found
```

### Follow a user

Request for an autorized user:
```js
PUT /users/profile/following/:username
```

Response in case of success:
```
Status: 204 No Content
```

Response in case target user does not exist:

```
Status: 404 Not Found
```

### Unfollow a user

Request for an autorized user:
```js
DELETE /users/profile/following/:username
```

Response in case of success:
```
Status: 204 No Content
```

Response in case target user does not exist:

```
Status: 404 Not Found
```