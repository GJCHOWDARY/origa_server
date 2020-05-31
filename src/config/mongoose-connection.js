const mongoose = require('mongoose'),
environment = require('./environment'),     
config =environment.config(), 
DBurl1=config.DBurl+config.database,
DBurl2='mongodb+srv://chowdary:r7p2ZfVMNc2DOkfg@cluster0-h8j8p.mongodb.net/smartML1?retryWrites=true&w=majority';
const run = async () => {
try{
  await mongoose.connect(DBurl1, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
} catch (err) {
    console.error(err)
  }
}

// run().catch(error => console.error(error))

module.exports=run;
