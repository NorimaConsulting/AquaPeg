const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  readingNumber:String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
  meter: { type: Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;
