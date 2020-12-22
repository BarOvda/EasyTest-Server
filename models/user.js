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

});

// userSchema.methods.uploadsummary = function(summary) {
//   const cartProductIndex = this.uploadedSummaries.summaryId.findIndex(cp => {
//     return cp.productId.toString() === product._id.toString();
//   });
//   let newQuantity = 1;
//   const updatedCartItems = [...this.cart.items];

//   if (cartProductIndex >= 0) {
//     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//   } else {
//     updatedCartItems.push({
//       productId: product._id,
//       quantity: newQuantity
//     });
//   }
//   const updatedCart = {
//     items: updatedCartItems
//   };
//   this.cart = updatedCart;
//   return this.save();
// };

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};
module.exports = mongoose.model('User', userSchema);
