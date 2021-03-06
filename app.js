const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const usersRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses');
const courseAppRoutes = require('./routes/courseAppearances');
const examDirectoriesRoutes = require('./routes/examDirectories');
const summariesRoutes = require('./routes/summaries');
const feedRoutes = require('./routes/feed');
const adminRoutes = require('./routes/admin');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use('/users', usersRoutes);
app.use('/courses', coursesRoutes);
app.use('/course-appearances', courseAppRoutes);
app.use('/exam-directories', examDirectoriesRoutes);
app.use('/summaries', summariesRoutes);
app.use('/feed', feedRoutes);
app.use('/admin', adminRoutes)

app.use((req, res, next) => { res.status(404).json({ message: 'Page not found' }); });
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Server error';
  const data = error.data || ' ';
  res.status(status).json({ message: message, data: data });
});

mongoose.connect("mongodb+srv://my_user1:1234@cluster0.9h1vb.mongodb.net/easy_test?retryWrites=true&w=majority"
  , {
    useNewUrlParser: true
    , useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(result => {
    app.listen(8082);
  })
  .catch(err => console.log(err));