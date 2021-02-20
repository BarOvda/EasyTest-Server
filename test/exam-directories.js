const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');
const Summary = require('../models/summary');


const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect
chai.use(chaiHttp);
const request = require('request');
const UsersController = require('../controllers/users');
const ExamsController = require('../controllers/examDirectories');
const CoursesController = require('../controllers/courseAppearances');

let user = new User({
  email: 'bar-test-hash@gmail.com',
  password: '$2y$12$NM9BXE5eB..vpPiV.lpnH.1l6YgAhdGXDtvrtpSLIcN0SEFBRGWba',
  name: 'Bar Ovda',
  imageUrl: 'Dummy-Path',
  //_id: '5c0f66b979af55031b34728a'
});
let courseTag = new Course({
  name: 'Social Networks For Developers',
  //_id:'5c0f66b979af55031b34728b'
});

let course = new CourseAppearance({
  name: 'Social Networks For Developers 2019 A',
  //couresId: '5c0f66b979af55031b34728b',
  examsDateA: Date.now(),
  examsDateB: Date.now(),
  //_id:'5c0f66b979af55031b34726d'
});

let directory = new ExamDirectory({
  // owner: '5c0f66b979af55031b34728a',
  // couresId:'5c0f66b979af55031b34726d',
  // _id: '5c0f66b979af55031b34728d'
});


describe('ExamsController', function () {
  before(async function (done) {
    try {
      mongoose.connect("mongodb+srv://my_user1:1234@cluster0.9h1vb.mongodb.net/easy_test?retryWrites=true&w=majority", {
        useNewUrlParser: true
        , useUnifiedTopology: true
      });

      // // expect(1).to.be.equal(1);
      done();

      // console.log('succ');


    } catch (err) {
      // console.log(err);
    }
  });

  beforeEach(function () { });

  afterEach(function () { });

  // it('add student to course and get directory'
  //   , async function () {
  //     try {
  //       const req = {
  //         params: {
  //           courseAppId: course._Id,
  //           userId: user._id
  //         }
  //       };
  //       let res = await CoursesController.addStudent(req, {}, () => { });

  //       console.log(res);
  //       expect(res.statusCode).to.be.equal(200);
  //     } catch (err) {
  //       console.log(err);

  //     }
  //   });

  it('create new DB'
    , async () => {
      try {
        await User.deleteMany({});
        await Course.deleteMany({});
        await CourseAppearance.deleteMany({});
        await ExamDirectory.deleteMany({});
        await Summary.deleteMany({});
        let userRe = await user.save();

        let courseRe = await courseTag.save();
        course.couresId = courseRe._id;
        course.students.push(userRe._id);

        const courseAppRe = await course.save();
        courseRe.appearances.push(courseAppRe._id);
        courseRe = await courseRe.save();

        directory.owner = userRe._id;
        directory.courseId = courseAppRe._id;

        let directoryRe = await directory.save();
        
        userRe.examsDirectories.push(directoryRe._id);

        userRe = await userRe.save();

        console.log(directoryRe);
        console.log(courseAppRe);
        console.log(userRe);
        console.log(courseRe);
        expect(1).to.be.equal(1);
        done();

      } catch (err) {
        // console.log(err);

      }
    });





  after(async function () {
    try {

      // await User.findByIdAndDelete(user._id);
      // await CourseAppearance.findByIdAndDelete(course._id);
      // await Course.findByIdAndDelete(courseTag._id);
      // await ExamDirectory.findByIdAndDelete(directory._id);
      // await mongoose.disconnect();

    } catch (err) {
      console.log(err);

    }
  });
});

