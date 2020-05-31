// const newrelic=require('newrelic'),
const mongoose = require('mongoose'),
      server = require("./src/server"),
      https = require('https'),
      environment = require('./src/config/environment'),     
      config =environment.config(), 
      path = require('path'),
      fs= require('fs'),
      connection=require('./src/config/mongoose-connection'),
      port=process.env.NODE_ENV === 'production' ? 9092 : config.http_port;

// TODO: ssl files
var options={
  'key':fs.readFileSync('./https/key.pem') ,
  'cert':fs.readFileSync('./https/cert.pem')
}

mongoose.Promise = Promise

mongoose.connection.on('connected', () => {
  console.log('Connection Established')
//TODO: http server 
  server.listen(port);
    console.log(`Server is running on: http://localhost:${port}`);

//TODO: https server 
https.createServer(options, server)
  .listen(config.https_port, function () {
    console.log(`Server is running on: https://localhost:${config.https_port}`)
})
})

mongoose.connection.on('reconnected', () => {
  console.log('Connection Reestablished')
})

mongoose.connection.on('disconnected', () => {
  console.log('Connection Disconnected')
})

mongoose.connection.on('close', () => {
  console.log('Connection Closed')
})

mongoose.connection.on('error', (error) => {
  console.log('ERROR: ' + error)
}) 

connection();

server.close = function (callback) {
  server.close(callback);
};

module.exports=server;
