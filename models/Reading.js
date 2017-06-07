const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  readingString:String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  meter: { type: Schema.Types.ObjectId, ref: 'Meter' },
  confirmation: { type: Schema.Types.ObjectId, ref: 'Confirmation' }

}, { timestamps: true });

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;
