## Posts

### Create :lock:

Request:
```json
POST /api/users/profile/posts

{
  "description": "Cool post",
  "image_urls": ["http://image.jpg"],
  "address": "Astana, Kazakhstan",
  "location_name": "Bayterek"
}
```

Response:
```json
{
  "__v": 0,
  "user": {
    "id": "55ea0a9f95164eb41cec6d51",
    "full_name": "Chuck Norris",
    "image_url": "/images/default_avatar.jpg"
  },
  "created": "2015-09-07T00:20:06.915Z",
  "description": "Cool post",
  "image_urls": ["http://image.jpg"],
  "address": "Astana, Kazakhstan",
  "location_name": "Bayterek",
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
      "user": {
        "id": "55ea0a9f95164eb41cec6d51",
        "full_name": "Chuck Norris",
        "image_url": "/images/default_avatar.jpg"
      },
      "created": "2015-09-07T00:20:06.915Z",
      "description": "Cool post",
      "image_urls": ["http://image.jpg"],
      "address": "Astana, Kazakhstan",
      "location_name": "Bayterek",
      "_id": "55ecd83658a9af1e547c4e5d"
    }
  ]
}
```
