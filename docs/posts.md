## Posts

### Create :lock:

Request:
```json
POST /api/users/profile/posts

{
  "description": "Cool post",
  "image_urls": ["http://image.jpg"],
  "address": "Astana, Kazakhstan"
}
```

Response:
```json
{
  "__v": 0,
  "user_id": "55ea0a9f95164eb41cec6d51",
  "created": "2015-09-07T00:20:06.915Z",
  "description": "Cool post",
  "image_urls": ["http://image.jpg"],
  "address": "Astana, Kazakhstan",
  "_id": "55ecd83658a9af1e547c4e5d"
}
```

### Get list :lock:

Request:
```json
GET /api/users/:username/posts
```

Response:
```json
{
  "collection": [
    {
      "__v": 0,
      "user_id": "55ea0a9f95164eb41cec6d51",
      "created": "2015-09-07T00:20:06.915Z",
      "description": "Cool post",
      "image_urls": ["http://image.jpg"],
      "address": "Astana, Kazakhstan",
      "_id": "55ecd83658a9af1e547c4e5d"
    }
  ]
}
```
