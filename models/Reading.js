const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readingSchema = new Schema({
  readingString:String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  meter: { type: Schema.Types.ObjectId, ref: 'Meter' },
  confirmation: { type: Schema.Types.ObjectId, ref: 'Confirmation', default:null}

}, { timestamps: true });

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;
