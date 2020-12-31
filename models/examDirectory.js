const mongoose = require('mongoose');
const courseAppearance = require('./courseAppearance')
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
  }
  ,summaries:[{
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
// examDirectorySchema.statics.findByCourseDateBetween =  function (start,callback) {
//     var query = this.find()

//     courseAppearance.find({'name':'my-appareance-test'}, function (error, course) {
//       query.where(
//         {courseId:  mongoose.Types.ObjectId(course._id)}
//       ).exec(callback);
//     })
//     return query

// }

module.exports = mongoose.model('ExamDirectory', examDirectorySchema);
