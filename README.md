# Origa
Origa

*project structure*

```
.
|
|
└────── src
│       |
|       |── angular /*client files*/
|       |
|       |── config
|       │       ├── config.json /*dev,test,production*/
|       |       |
|       │       └── environment.js  
|       |
|       └── controllers
|       │       ├── orders.js
|       │       └── users.js          
|       |
|       ├── middleware
|       │     ├── auth.js
|       │     └── check-auth.js
|       |
|       ├── models
|       │     ├── orders.js
|       │     └── user.js
|       |
|       ├── routes
|       │     ├── orders.js 
|       │     └── user.js
|       |
|       └── server.js
|── index.js
|
├── README.md
|
└── package.json

```
---

*Run server*

* sudo NODE_ENV=development npm start || sudo NODE_ENV=development node app.js
