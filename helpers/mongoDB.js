
const mongoose = require('mongoose');
const DBAutomationConsts = require('../constants/mongo-db-automation.json');

const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const Summary = require('../models/summary');
const awsAPI = require('../helpers/awsAPI');
const img_dir_path = "C:\\Git\\MongoAutomation\\imgs"
const docs_dir_path = "C:\\Git\\MongoAutomation\\docs"
var docs_names = [];
const fs = require("fs");

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function (filename) {
            var path = dirname + "\\" + filename
            var file = { filename: filename, path: path }

            awsAPI.uploadFile(file, 'images');
        });
    });
}

function readDocs(dirname, onFileContent, onError) {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }

        docs_names.push(...filenames)
        docs_names.forEach(doc => {

            docs_names[docs_names.indexOf(doc)] = doc.split('.')[0]

        })

        filenames.forEach(function (filename) {
            var path = dirname + "\\" + filename
            var file = { filename: filename, path: path }

            // awsAPI.uploadFile(file, 'files');
        });
    });
}
function loadDocs() {

    console.log("--loading docs --")

    var data = {};
    readDocs(docs_dir_path, function (filename, content) {
        // docs.push(filename);
    }, function (err) {
        throw err;
    });




}
function loadUsersImages() {

    console.log("--loading users images--")

    var data = {};
    readFiles(img_dir_path, function (filename, content) {
        data[filename] = content;
    }, function (err) {
        throw err;
    });

}


exports.insertData = async (req, res, next) => {


    //prepare Data in S3
    loadUsersImages();
    loadDocs();

    console.log("--Deleting DBs Records")
    try {
        await Course.deleteMany();
        await CourseAppearance.deleteMany();
        await User.deleteMany();
        await ExamDirectory.deleteMany();
        await Summary.deleteMany();
    } catch (err) {
        console.log("----Failed to drop Collections----")
        console.log(err)
    }
    console.log("--Finished Deleting DBs Records")





    var courses = DBAutomationConsts.courses;
    var apps = DBAutomationConsts.courseAppearances;
    var users = DBAutomationConsts.users;
    var dirs = []

    //generate Ids
    courses.forEach(course => {
        course["_id"] = mongoose.Types.ObjectId();

    })
    users.forEach(user => {
        user["_id"] = mongoose.Types.ObjectId();

    })
    apps.forEach(app => {
        app["_id"] = mongoose.Types.ObjectId();

    })

    //connect courses to apps
    var i, j = 0;
    if (courses.length > apps.length) {
        for (i = 0; i < courses.length; i++) {
            if (j >= apps.length)
                j = 0;

            courses[i]["appearances"].push(apps[j]._id)
            apps[j]["couresId"] = courses[i]._id
            j++;
        }
    } else {
        for (i = 0; i < apps.length; i++) {
            if (j >= courses.length)
                j = 0;

            courses[j]["appearances"].push(apps[i]._id)
            apps[i]["couresId"] = courses[j]._id
            j++;
        }
    }
    let summs = []

    try {
        //create summs objects
        j = 0;
        let x = 0;
        for (i = 0; i < docs_names.length; i++) {
            let current_doc_name = docs_names[i];
            if (j >= users.length)
                j = 0;
            if (x >= apps.length)
                x = 0;

            let title = current_doc_name;
            let pathUrl = `https://easy-test-s3.s3.amazonaws.com/files/${current_doc_name}`
            let owner = users[j]._id;
            let courseAppearance = apps[x]._id;
            var usersRank = [];
            var min = Math.ceil(1);
            var max = Math.floor(6);
            let avg_ranks = 0
            users.forEach(user => {
                let rank = Math.floor(Math.random() * (max - min) + min)
                var userRank = {
                    user: user._id,
                    rank: rank,
                }
                avg_ranks += rank;
                usersRank.push(userRank)
            })
            avg_ranks = avg_ranks / users.length
            var sum = {
                _id: mongoose.Types.ObjectId(),
                title: title,
                pathUrl: pathUrl,
                owner: owner,
                courseAppearance: courseAppearance,
                usersRank: usersRank,
                rank: avg_ranks
            }

            users[j].uploadedSummaries.push(sum._id)
            summs.push(sum)
            j++;
            x++;


        }
    } catch (err) {
        console.log("----Failed to Create Summs objects----")

        console.log(err)
    }

    //connect users to apps
    // var usersIds = users.map(user => user._id);
    // apps.forEach(app => {
    //     app.students.push(...usersIds)
    // })

    //Save data
    try {
        await Course.insertMany(courses)
        await CourseAppearance.insertMany(apps)
        await User.insertMany(users)
        await Summary.insertMany(summs)


    } catch (err) {
        console.log("----Failed to Save Data----")
        console.log(err)
    }






    // console.log(courses)
    res
        .status(201)
        .json({});
}


