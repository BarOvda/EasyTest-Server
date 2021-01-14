const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
  imageUrl: {
    type: String,
    required: true
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
