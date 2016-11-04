# pro-xy-ws-api

Plugin for pro-xy, that allows to define url replace rules.

If replacing of values of some response headers that contains URLs back to original ones, define them in 'replaceBackHeaders' parameter.

Sample configuration

```
{
    "port": 8000,
    "logLevel": "INFO",
    "plugins": [
        "pro-xy-url-replace"
    ],
    "pro-xy-url-replace": {
        "disabled": false,
        "replaces": [
            {
                "name": "dev-server",
                "pattern": "//localhost:[0-9]{4}/",
                "replacement": "//dev.mycompany.com/",
                "disabled": false
            },
            {
                "name": "prod-server",
                "pattern": "//localhost:3000"/,
                "replacement": "//prod.mycompany.com:3000/",
                "disabled": true
            }
        ],
        "replaceBackHeaders": [
            "location",
            "link"
        ]
    }
}
```
