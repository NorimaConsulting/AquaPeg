const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const randToken = require('rand-token');


const TimeToLivePeriodms = 1000 * 60 * 60 * 24 * 7 //One Week

const reminderSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  meter: { type: Schema.Types.ObjectId, ref: 'Meter' },
  used:{type:Date, default:null},
  timeToLive:{
  		type:Date,
  		default: function () {
  			return new Date(Date.now()+ TimeToLivePeriodms);
  		}
  },
  accessCode: {
        type: String,
        default: function() {
            return randToken.generate(64);
        }
  }

}, { timestamps: true });

reminderSchema.methods.active = function active() {

	var currT = new Date();
	var ttlIsGood = currT <= this.timeToLive;
	var isUnUsed = !used;

	return isUnUsed && ttlIsGood;

};



const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
