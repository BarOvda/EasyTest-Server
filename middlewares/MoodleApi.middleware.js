const request = require('request');

exports.getUsersFromMoodleSite = async (req, res, next) => {
    const moodleUrl = req.body.url;
    const apiKey = req.body.key;
    request(`${moodleUrl}/blocks/moodleapi/run.php?key=${apiKey}&func=all_users`
        , { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body.response);
            res.body.users = body.response;
        });
}

exports.getCoursesFromMoodleSite = async (req, res, next) => {
    const moodleUrl = req.body.url;
    const apiKey = req.body.key;

    request(`${moodleUrl}/blocks/moodleapi/run.php?key=${apiKey}&func=all_courses_exam`
        , { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body.response);
            res.body.courses = body.response;
        });

}


exports.getEnrolledUsersForCourses = async (req, res, next) => {
    const moodleUrl = req.body.url;
    const apiKey = req.body.key;

    request(`${moodleUrl}/blocks/moodleapi/run.php?key=${apiKey}&func=courses_for_all_users`
        , { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body.response);
            res.body.data = body.response;
        });

}


