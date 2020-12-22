const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examDirectorySchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId, 
    ref: 'CourseAppearance', 
    required: true
  },
  uploadDate: {
    type: String,
    default: Date.now
  },
  pathUrl: {
    type: String,
    required: false
  },summaries:[{
        type: Schema.Types.ObjectId, 
        ref: 'Summary' 
 }]
  ,
  owner:{
     type: Schema.Types.ObjectId, 
     ref: 'User',
     required:true
  }
  
});

module.exports = mongoose.model('ExamDirectory', examDirectorySchema);
