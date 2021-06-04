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
      required: true
   },

   exams: {
      exam: {
         type: Date,
         default: Date.now() //onlyForTesting!
      },
      remake: {
         type: Date
         , default: Date.now() //onlyForTesting!
      },
      withMaterials: {
         type: Boolean,
         default: false
      },
      duration: {
         type: Number,
         default: 0
      }
   }
   ,
   students: [{
      student: {
         type: Schema.Types.ObjectId,
         ref: 'User'
      },
      loggedIn: {
         type: Boolean,
         default: false
      },
      loginCounts:{
         type: Number,
         default: 0
      },
      loginDates:[{
         type: Date
         , default: Date.now() //onlyForTesting!

      }]
   }
   ]

});

module.exports = mongoose.model('CourseAppearance', courseAppearanceSchema);
