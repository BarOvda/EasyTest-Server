const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userConstants = require('../constants/users.json');
const Role = userConstants.Role;
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Role,
    default: Role.USER,
  },
  imageUrl: {
    type: String,
    required: true
  },
  isLoggedToExam: {
    type: Boolean,
    required: false
  }
  ,
  uploadedSummaries:[{
    type: Schema.Types.ObjectId, 
    ref: 'Summary' 
 }],
 examsDirectories:[{
   type:Schema.Types.ObjectId,
   ref:'ExamDirectory'
 }]
, followedCourses:[{
  type:Schema.Types.ObjectId,
   ref:'Course'
 }]
});

module.exports = mongoose.model('User', userSchema);
