const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    sub_total: {
      type: Number,
      required: true
    }, 
    order_date: {
      type: Date,
      default: new Date()
    },  
    status: {
      type: String,
      default: 'Active'
    }, 
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    }, 
  },
  { timestamps: true }
);


module.exports = mongoose.model('Orders', orderSchema);