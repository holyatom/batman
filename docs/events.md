## Events

### Create :lock:

Request:
```json
POST /api/users/profile/events

{
  "description": "first event",
  "date": "Sat Sep 12 2015 20:02:19 GMT+0600",
  "image_urls": ["http://image.jpg"],
  "address": "Astana, Kazakhstan"
}
```

Response:
```json
{
   "__v": 0,
    "user_id": "55ec39bd8c6037e000d4f365",
    "created": "2015-09-12T14:22:30.726Z",
    "date": "2015-09-12T14:02:19.000Z",
    "description": "first event",
    "image_urls": ["http://image.jpg"],
    "_id": "55f43526da3c9bb82a89db1b"
}
```

### Get list :lock:

Request:
```json
GET /api/users/:username/events
```

Response:
```json
{
  "total": 1,
  "page": 1,
  "per_page": 20,
  "collection": [
    {
      "_id": "55f43526da3c9bb82a89db1b",
      "user_id": "55ec39bd8c6037e000d4f365",
      "created": "2015-09-12T14:22:30.726Z",
      "date": "2015-09-12T14:02:19.000Z",
      "image_urls": ["http://image.jpg"],
      "description": "first event",
      "__v": 0
      }
    ]
}
```
