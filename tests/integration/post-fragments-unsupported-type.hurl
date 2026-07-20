# tests/integration/post-fragments-unsupported-type.hurl
# Confirm that posting an unsupported Content-Type produces a 415 error
POST http://localhost:8080/v1/fragments
Content-Type: application/xml
[BasicAuth]
user1@email.com:password1
`<test></test>`

HTTP/1.1 415
