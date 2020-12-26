const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const usersRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses');
const courseAppRoutes = require('./routes/courseAppearances');
const examDirectoriesRoutes = require('./routes/examDirectories');

const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); 
app.use( multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
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

app.use((req, res, next) => {res.status(404).json({ message: 'Page not found' });});
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message||'Server error';
  const data =error.data||' ';
  res.status(status).json({ message: message,data:data });
});

mongoose.connect("mongodb+srv://my_user1:1234@cluster0.9h1vb.mongodb.net/easy_test?retryWrites=true&w=majority",{ useNewUrlParser: true 
, useUnifiedTopology: true})
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));


