const mongoose = require('mongoose');

const meterSchema = new mongoose.Schema({
  type:{type:String, default:"YWGWater"},
  meterNumber:String,
  deletedAtDate:Date,
  reminderSchedulePeriod:{type:Number, default:(1000*60*60*24*365)/4},
  user: { type: Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

const Meter = mongoose.model('Meter', meterSchema);

module.exports = Meter;
