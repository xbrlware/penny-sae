{
    "AUTHENTICATION" : {
      "STRATEGY" : "local"
    },    
    "CLEAR_USERS_ON_RESTART" : false,
    "COMPANY_INDEX" : "companies_restore",
    "DEMO_FLAG" : true,
    "ES" : {
        "HOST" : "http://localhost:9205",
        "INDEX" : {
          "AUTH" : ""
        }
    },
    "HTTPS":{
        "ENABLED": false,
        "CERTIFICATES": {
            "PEM" : "authentication/nodesec.pem",
            "CRT": "authentication/nodesec.crt"
        }
    },
    "NETWORK_INDEX" : "petwork",
    "SERVER" : {
        "PORT" : 8090
    },
    "TIMEOUT_AMOUNT": 2,
    "TIMEOUT_UNITS" : "hours",
    "TTS_TYPE"      : "js"
}
