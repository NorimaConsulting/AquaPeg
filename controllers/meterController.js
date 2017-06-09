'use strict';

const Meter = require('../models/Meter.js');
const User = require('../models/User.js');
const Reading = require('../models/Reading.js');
const Reminder = require('../models/Reminder.js');
const Confirmation = require('../models/Confirmation.js');


const emailController = require('./emailController.js');
const twilioController = require('./twilioController.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId



exports.getAllMetersWithOwnerReminderReading = (cb) => {
	//Get all !deleted;
	var q = {deletedAtDate:null};
	Meter.find( q )
	.populate("owner")
	.exec(
			(err, meters) => {

				addLatestReminderToMeter(meters,
																	(err,meters)=>{
																		addLatestReadingToMeter(meters,
																														(err,meters)=>{
																															cb(err,meters);
																														})
																	});

			}
		);

}

function addLatestReminderToMeter(meters,cb){

	var metersLeft = meters.length;

	for (var i = 0; i < meters.length; i++) {

		(function(ii) {
			Reminder.findOne({meter:meters[i]})
			.sort({createdAt: -1})
			.exec((err,reminder)=>{
				metersLeft--;
				if(reminder){
					meters[ii].latestReminder = reminder
				}

				if(metersLeft<=0){
					cb(null,meters)
				}

			});
		})(i)
	}
}

function addLatestReadingToMeter(meters,cb){

	var metersLeft = meters.length;

	for (var i = 0; i < meters.length; i++) {

		(function(ii) {
			Reading.findOne({meter:meters[i]})
			.sort({createdAt: -1})
			.exec((err,reading)=>{
				metersLeft--;
				if(reading){
					meters[ii].latestReading = reading
				}

				if(metersLeft<=0){
					cb(null,meters)
				}

			});
		})(i)

	}
}



exports.getMetersForUser = (user,cb) => {

	//Check User && !deletedAtDate
	var q = {owner:user, deletedAtDate:null};

	Meter.find( q, (err, meters)=> {
		cb(err, meters);
	});

}

exports.getMetersForUserWithLatestReading = (user,cb) => {

	//Check User && !deletedAtDate
	var q = {owner:user, deletedAtDate:null};
	Meter.find( q, (err, meters)=> {

		var waitingFor = meters.length;
		if(waitingFor<=0){
			cb(err,meters)
		}

		for (var i = 0; i < meters.length; i++) {
			var curPos = i;
			exports.getLatestReadingsForMeter(meters[i],(err,reading) => {
				if(reading){
					meters[curPos].latestReading = reading
				}

				waitingFor--;
				if(waitingFor<=0){
					cb(err,meters)
				}
			});
		}
	});

}

exports.getMeterForUser = (meterID, user,cb) => {

	//Check User && !deletedAtDate
	var q = {	_id: meterID,
		 				owner:user._id,
						deletedAtDate:null
					};

	Meter.findOne(q)
	.populate("owner")
	.exec((err, meter) => {
		cb(err, meter);
	});

}




exports.addMeterForUser = (user, meterNumber,cb) => {

	var meter = new Meter({
				meterNumber,
				owner:user
				});
	meter.save((err) => {cb(err)} );

}


exports.removeMeterForUser = (user, meterID,cb) => {

	//set deletedAtDate
	var q = {	owner:user,
						deletedAtDate:null,
						_id: meterID
					};

	Meter.findOne( q , (err, meter)=> {
		if(err){
			cb(err)
		}else{
			meter.deletedAtDate = new Date();
			meter.save((err) => { cb(err) });
		}
	});
}





//Sending A Reminder
exports.sendNewReminder = (meter,cb) =>{

	//Create a reminder in the DB
	var reminder = new Reminder({
									owner:meter.owner,
									meter
								})

	reminder.save((err) => {
		//Send Email to user
		if(err)
			cb(err)
		else
			emailController.sendReminder(meter.owner,meter,reminder, (err) => { cb(err) } );
	});


}

exports.getReminderForToken = (token,cb) => {
	var q = {accessCode:token};

	Reminder.findOne(q)
	.exec(cb);

}

exports.getMeterForActiveToken = (token,cb) => {
	var q = {	accessCode:token,
						used:null,
						timeToLive : { $gt : new Date() }
					};

	Reminder.findOne(q)
	.populate("meter")
	.exec((err, reminder) => {
		if(reminder){
			cb(err,reminder.meter)
		}else{
			cb(err,null)
		}

	});
}




//Adding A Reading
exports.addMeterReadingWithReminderToken = (readingString, reminderToken,cb) => {

	//Find Reminder with
	Reminder.findOne({accessCode:reminderToken})
	.populate("owner meter")
	.exec((err,reminder) => {
		//Call addMeterReadingWithoutReminder
		if(err )
			cb(err,reminder)
		else if (!reminder)
			cb({message:"No Reminder Found",status:404},reminder)
		else
			exports.addMeterReadingWithoutReminder(readingString,reminder.owner,reminder.meter._id,cb)
	});

}

exports.addMeterReadingWithoutReminder = (readingString, user, meterID,cb) => {

	exports.getMeterForUser(meterID,user,(err, meter)=>{
		//Add Reading To the DB
		if(meter.owner._id.equals(user._id)){

			var reading = new Reading({
				readingString,
				owner : user,
				meter,
			});

			reading.save( (err) =>{
				//Start a Call to twilio
				if(err)
					cb(err)
				else
					twilioController.submitMeterReading(user,meter,reading,(err) => { cb(err)});
			} );

		}
		else
		{
			cb("User didn't Match")
		}
	});


}

//Get All Readings
exports.getAllReadingsForMeter = (meter,cb) => {

	//Find All Reading for Meter
	var q = {meter};
	Reading.find(q)
	.populate("confirmation")
	.sort({createdAt: -1})
	.exec((err,readings) => {
		console.log(readings);
		cb(err,readings);
	});
}

exports.getAReadingByID = (rID,cb) => {

	//Find All Reading for Meter

	var q = {_id:rID}
	Reading.findOne(q)
	.populate("meter")
	.exec((err,reading) => {
		cb(err,reading);
	});
}

exports.getLatestReadingsForMeter = (meter,cb) => {

	//Find All Reading for Meter
	var q = {meter};
	Reading.findOne(q)
	.populate("confirmation")
	.sort({createdAt: -1})
	.exec((err,reading) => {
		cb(err,reading);
	});
}


//Confirm a Reading

exports.addReadingConfirmation = (readingID,audioUrl,audioTranscript,cb) => {

	//Find Reading
	var q = {
		_id : readingID,
		confirmation:null
	};

	Reading.findOne(q)
	.populate("owner")
	.populate("meter")
	.exec((err,reading)=>{
		if(err){
			cb(err)
		}else if (reading.confirmation){
			cb({message:"Already Confrimed"})
		}else{

			var conf = new Confirmation({
				reading,
				transcript: audioTranscript,
				audioUrl:audioUrl
			})
			conf.save((err) => {
				if(err){
					cb(err)
				}
				else
				{
					reading.confirmation = conf
					reading.save((err) => {
						if(err){
							cb(err)
						}else{
							emailController.sendReadingConfirmation(reading.owner,reading.meter, reading, audioUrl,audioTranscript, (err) => { cb(err) } );
						}
					})
				}
			});

		}

	})


}
