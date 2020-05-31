process.env.NODE_ENV = 'development';


const request = require("supertest"),
server = require("../index"),
mongoose = require('mongoose'),
chai = require('chai'),
chaiHttp = require('chai-http'),
connection=require('../src/config/mongoose-connection'),
environment = require('../src/config/environment'),     
config =environment.config(),   
DBurl1=config.DBurl+'Origa',
DBurl2='mongodb+srv://chowdary:qyWwFj7bDJhJD7Pb@cluster0-h8j8p.mongodb.net/smartML1?retryWrites=true&w=majority',
base_url = "http://localhost:9009/api";

let should = chai.should();
chai.use(chaiHttp);

describe('Check Uer Login', () => {
    // beforeEach((done) => {
    //     connection();       
    // });

  describe('User API', () => {
      it('it should login', (done) => {
        chai.request(server)
            .get('/api/users/getusers')
            .end((err, res) => {
                  res.should.have.status(200); 
              done();
            });
      });
  });
  /*
  * Test the /POST route
  */
  describe('Enroll new User', () => {
      it('it should POST a new user', (done) => { 
          var random=Math.floor((Math.random() * 1000) + 1);
        chai.request(server) 
            .post('/api/user/newuser')
            .send({ email: `admin${random}@origa.com`, password: "Origa@123", name:"hello00" })    
            .end((err, res) => {
                  res.should.have.status(201);
                //   res.body.should.be.a('object');
                //   res.body.should.have.property('errors');
                //   res.body.errors.should.have.property('pages');
                //   res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
  });
  
});
