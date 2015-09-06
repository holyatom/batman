# API reference

All API resource can have basic CRUD methods, for example:
  - `GET /api/v1/items` returns paginated collection of resources;
  - `POST /api/v1/items` creates a new resource;
  - `GET /api/v1/items/123` returns a particular resource with `id=123`;
  - `PUT /api/v1/items/123` updates a particular resource with `id=123`;
  - `DELETE /api/v1/items/123` deletes a particular resource with `id=123`.

All requests with body (POST, PUT) should have `application/json` content type.

Authentication is passed by providing a valid value in `X-Access-Token` HTTP header of the request.

## Errors format

If the request is failed, server returns the response with error.
Response's HTTP status code signify the type of the error:
  - 400: validation error
  - 401: authentication required
  - 403: access denied
  - 404: resource not found
  - 500: internal server error

All error responses have the same JSON format:
```json
{
  "error": {
    "code": "not_found",
    "message": "Resource not found",
  }
}
```

You can handle `code` automatically or show `message` to user directly.

Validation errors already have detailed information about fails:
```json
{
  "error": {
    "code": "validation_failed",
    "message": "Validation failed",
    "fields": {
      "name": {
        "code": "required",
        "message": "Name is required"
      },
      "email": {
        "code": "bad_value",
        "message": "Email has invalid format"
      },
      "city": {
        "code": "longer_than_allowed",
        "message": "City is longer than allowed",
        "max_length": 255
      }
    }
  }
}
```

Also you can sort and filter collection by fields specified on API's backed.
For example: `GET /api/v1/users?_name=vasya&order=-created`.

`Order` parameter specifies a field for sorting, `-` means a descending sort.

Filtering by exact value is not
only possibility. You can use the next operations by adding it after field's
name with double undescore separator: `not`, `lt`, `lte`, `gt`, `gte`, `in`,
`not_in`, `startswith` (for `string` type only). For example,
`GET /api/v1/users?_age__gt=18&_age__lt=70&_status__in=active,disabled`.
