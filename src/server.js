const path = require('path'),
      fs= require('fs'),
      express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      environment = require('./config/environment'),
      connection=require('./config/mongoose-connection'),
      checkAuth = require('./middleware/auth'),
      errorHandler = require('./middleware/error-handler'),
      requestHandler= require('./middleware/request-handler'),
      config =environment.config(),
      compression = require('compression'),
      helmet = require('helmet');
const server = express();

server.use(bodyParser.json({ limit: '500mb' })); 

server.use(bodyParser.urlencoded({ extended: false }));
server.use(compression())
server.use(helmet())

server.use(cors());

server.use(requestHandler);

var morgan = require('morgan');

//TODO: create a write stream (in append mode)

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//TODO: setup the logger

server.use(morgan('combined', { stream: accessLogStream }))

//TODO: Serve Static Files/Images

server.use('/images', express.static(path.join(__dirname, 'images')));
server.use('/files', express.static(path.join(__dirname, 'files')));
server.use('/uploads', express.static(path.join(__dirname, '../uploads')));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '4d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

server.use(express.static(path.resolve(__dirname, "dist/Origa")));

server.use(checkAuth);

server.use(errorHandler);

//TODO: Routing

server.use("/api/users", checkAuth, require("./routes/user"));
server.use("/api/orders", checkAuth, require("./routes/orders"));

//TODO: Boot Scripts/Jobs

let mongo_backup= require('./boot/mongo_backup.js')();


server.get('/api/*', function(req, res) {
 res.status(404).json({
    status: false,
    message: "API not there",
  });
});

server.all('/*', (req, res) => {
   res.sendFile(path.resolve(__dirname, "dist/Origa/index.html"));
});

// connection();
module.exports=server;
