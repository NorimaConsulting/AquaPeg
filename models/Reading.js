const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readingSchema = new Schema({
  readingString:{type:String,
    validate: {
        validator: function(v) {
          var n = Math.floor(Number(v));
          return !isNaN(v) && n >= 0 && (v.length == 5 || v.length == 6);
        },
        message: '{VALUE} did not meet the spec'
      }},
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  meter: { type: Schema.Types.ObjectId, ref: 'Meter' },
  confirmation: { type: Schema.Types.ObjectId, ref: 'Confirmation', default:null}

}, { timestamps: true });

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;
