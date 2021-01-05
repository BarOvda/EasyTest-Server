const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');

const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect
chai.use(chaiHttp);
const request = require('request');
const UsersController = require('../controllers/users');
const ExamsController = require('../controllers/examDirectories');
const CoursesController = require('../controllers/courseAppearances');

const user =  new User({
    email: 'test@test.com',
    password: 'tester',
    name: 'Test',
    imageUrl:'Dummy-Path',
    _id: '5c0f66b979af55031b34728a'
});
const courseTag =  new Course({
    name: 'tester_users_tests',
    _id:'5c0f66b979af55031b34728b'
});

const course =  new CourseAppearance({
    name: 'tester_users_tests',
    couresId: '5c0f66b979af55031b34728b',
    examsDateA: Date.now(),
    examsDateB:Date.now(),
    _id:'5c0f66b979af55031b34726d'
});

const directory =  new ExamDirectory({
    owner: '5c0f66b979af55031b34728a',
    couresId:'5c0f66b979af55031b34726d',
    _id: '5c0f66b979af55031b34728d'
});


describe('ExamsController', function() {
  before(async function() {
    try{

   await mongoose.connect("mongodb+srv://my_user1:1234@cluster0.9h1vb.mongodb.net/easy_test_tests?retryWrites=true&w=majority",{ useNewUrlParser: true 
, useUnifiedTopology: true});
    console.log('succ');
    await user.save();
    await courseTag.save();

   await course.save();
   
    await directory.save();
    console.log(directory);
    console.log(course);
    
    }catch(err){
      console.log(err);
    }
  });

  beforeEach(function() {});

  afterEach(function() {});

  it('add student to course and get directory'
  ,async function() {
    try{
      const req = {
        params: {
          courseAppId: course._Id,
          userId: user._id
        }
      };
   let res = await CoursesController.addStudent(req, {}, () => {});
   
   console.log(res);
    expect(res.statusCode).to.be.equal(200);
    }catch(err){
      console.log(err);

    }
});    


  after(async function() {
    try{

    await User.findByIdAndDelete(user._id);  
    await CourseAppearance.findByIdAndDelete(course._id);  
    await Course.findByIdAndDelete(courseTag._id);  
    await ExamDirectory.findByIdAndDelete(directory._id);  
    await mongoose.disconnect();
    
    }catch(err){
      console.log(err);

    }
  });
});

