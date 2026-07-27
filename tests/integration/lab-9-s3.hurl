# 1. POST a new text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# 2. Confirm 201 and capture Location
HTTP/1.1 201
[Captures]
url: header "Location"

# 3. GET the fragment
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 4. Confirm 200, type, and body
HTTP/1.1 200
Content-Type: text/plain
`Hello S3!`

# 5. DELETE the fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# 6. Confirm 200
HTTP/1.1 200

# 7. GET the fragment again
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 8. Confirm 404
HTTP/1.1 404
