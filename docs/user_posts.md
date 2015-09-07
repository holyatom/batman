## User posts

### Create

Request:
```json
POST /api/user/posts

{
   "description": "Cool post",
    "image_url": "http://image.jpg",
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
  "image_url": "http://image.jpg",
  "address": "Astana, Kazakhstan",
  "_id": "55ecd83658a9af1e547c4e5d"
}
```
