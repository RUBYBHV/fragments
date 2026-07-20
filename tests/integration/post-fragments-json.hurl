# tests/integration/post-fragments-json.hurl
# Confirm that posting a JSON fragment works, and doing a GET for the same fragment returns the expected result
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
```json
{
  "key": "value"
}
```

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "application/json"

[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
[Asserts]
jsonpath "$.key" == "value"
