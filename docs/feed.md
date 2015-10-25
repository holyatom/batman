## Feed

### Get list :lock:

Returns list of current user's followees' posts sorted by `created` descending by default.

Request:
```json
GET /api/feed
```

Response:
```json
{
  "total": 1,
  "page": 1,
  "per_page": 20,
  "collection": [
    {
      "__v": 0,
      "_id": "55ecd83658a9af1e547c4e5d",
      "created": "2015-09-07T00:20:06.915Z",
      "user": {
        "id": "55ea0a9f95164eb41cec6d51",
        "full_name": "Chuck Norris",
        "image_url": "/images/default_avatar.jpg"
      },
      "description": "Cool post",
      "image_urls": ["http://image.jpg"],
      "address": "Astana, Kazakhstan",
      "location_name": "Bayterek"
    }
  ]
}
```
