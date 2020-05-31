const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    }, 
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'Active'
    }, 
    no_of_orders: {
      type: Number,
      default: 0
    }, 
  },
  { timestamps: true }
);


module.exports = mongoose.model('Users', userSchema);