This is where the MongoDB database is stored.

# API Endpoints

## GET /proxy/<website_url_with_pathname>

### Description

Downloads a proxied version of <website_url_with_pathname> where:

- UUIDs have been added to every element
- Replace all links with a proxied version of the link
- Injectables.js has been added

### Arguments

None

### Response

(the proxied webpage with aforementioned changes. If it's a 404 or 500 or anything else, it should return those)

### Examples

- GET /proxy/localhost/index.html
- GET /proxy/www.google.com

## POST /save/

### Description

An endpoint that the injectables.js file uses to send a list of changes that should be made on a remote server backend.

### Arguments

```
{
    "url": "localhost/index.html",
    "ftp_username": "root",
    "ftp_password": "password",
    "changes": [
        {
            "uuid": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", // UUID v4 (see Npm package README)
            "old_inner_html": "Example old text", // Not technically needed but a good thing to pass if it's easy to get
            "new_inner_html": "Example new text"
        },
        ...
    ]
}
```

### Response

If it's good, 200 response code and no text response. Otherwise a 500 error and pure text response, not enclosed in JSON. Example error string "Could not login"
