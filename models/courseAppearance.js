const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseAppearanceSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   couresId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required:true
   },

   exams: {
      exam: {
         type: Date,
         default:Date.now() //onlyForTesting!
      },
      remake: {
         type: Date
         ,default:Date.now() //onlyForTesting!
      },
      withMaterials:{
         type:Boolean,
         default:false
      }
      
      
   }
   ,
   students: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
   }]
   //,
   // directories:[{
   //    type: Schema.Types.ObjectId, 
   //    ref: 'ExamDirectory' 
   // }]
});

module.exports = mongoose.model('CourseAppearance', courseAppearanceSchema);
