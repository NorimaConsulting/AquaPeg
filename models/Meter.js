const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meterSchema = new Schema({
  type:{type:String, default:"YWGWater"},
  meterNumber:String,
  deletedAtDate:{type:Date, default:null},
  reminderSchedulePeriod:{type:Number, default:(1000*60*60*24*365)/4},
  owner: { type: Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

meterSchema.index({ meterNumber: 1, owner: 1, deletedAtDate:1}, { unique: true });
const Meter = mongoose.model('Meter', meterSchema);

module.exports = Meter;
