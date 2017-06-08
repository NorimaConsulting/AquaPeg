const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const confirmationSchema = new Schema({
  reading : { type: Schema.Types.ObjectId, ref: 'Reading' },
  transcript : String,
  audio : Buffer

}, { timestamps: true });

const Confirmation = mongoose.model('Confirmation', confirmationSchema);
module.exports = Confirmation;
