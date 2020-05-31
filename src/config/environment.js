
const config = require('./config.json');

var env={};

env.node_env=process.env.NODE_ENV

env.config=(next) =>{
  return config[env.node_env];
 next()
}

module.exports= env;
