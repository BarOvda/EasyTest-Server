const sinon = require('sinon');
const mongoose = require('mongoose');
//const app = require('../app');
const User = require('../models/user');
const chai = require("chai")
const chaiHttp = require("chai-http")

const expect = chai.expect
chai.use(chaiHttp)
const request = require('request');
const UsersController = require('../controllers/users');

describe('Users Controller', function() {
  before(async function(done) {
    mongoose.connect("mongodb+srv://my_user1:1234@cluster0.9h1vb.mongodb.net/easy_test?retryWrites=true&w=majority",{ useNewUrlParser: true 
, useUnifiedTopology: true});

    const user = new User({
        email: 'test@test.com',
        password: 'tester',
        name: 'Test',
        imageUrl:'Dummy-Path',
        _id: '5c0f66b979af55031b34728a'
    });
    console.log('succ');
    await user.save();
    done();
  });

  beforeEach(function() {});

  afterEach(function() {});

  it('should throw an error with code 500 if accessing the database fails',async function(done) {

    const user = new User({
        email: 'test@test.com',
        password: 'tester',
      });   
   let res =await request(app).get('/users/login')
    .send(user);
    expect(res.status).to.equal(200);

});    


  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});

