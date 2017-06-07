'use strict';

const Meter = require('../models/Meter.js');
const User = require('../models/User.js');
const Reading = require('../models/Reading.js');
const Reminder = require('../models/Reminder.js');
const Confirmation = require('../models/Confirmation.js');


const emailController = require('emailController.js');
const twilioController = require('twilioController.js');




export.getAllMeters = (user,cb) => {

	//Get all !deleted;
	var q = {deletedAtDate:{$ne: true}};

	Meter.find( q )
	.populate("owner")
	.exec(
			(err, meters) => {
				cb(err, meters);
			}
		);

}



export.getMetersForUser = (user,cb) => {

	//Check User && !deletedAtDate
	var q = {owner:user, deletedAtDate:{$ne: true}};

	Meter.find( q , (err, meters)=> {
		cb(err, meters);
	});

}




export.addMeterForUser = (user, meterNumber,cb) => {

	var meter = new Meter({
				meterNumber,
				owner:user
				});
	meter.save((err)=>{cb(err)});

}


export.removeMeterForUser = (user, meterID,cb) => {

	//set deletedAtDate
	var q = {owner:user, deletedAtDate:{$ne: true}};

	Meter.findOne( q , (err, meter)=> {
		meter.deletedAtDate = new Date();
		meter.save((err) => { cb(err) });
	});

}





//Sending A Reminder 
export.sendNewReminder = (meter,cb) = >{

	//Create a reminder in the DB
	var reminder = new Reminder({
									owner:meter.owner, 
									meter
								})

	reminder.save((err) => {
		//Send Email to user
		emailController.sendReminder(meter.owner,meter,reminder, (err) => { cb(err) } );
	});


}




//Adding A Reading
export.addMeterReadingWithReminderToken = (readingString, reminderToken,cb) => {

	//Find Reminder with
	Reminder.findOne(token:reminderToken)
	.populate("owner meter")
	.exec((err,reminder) => {		
		//Call addMeterReadingWithoutReminder
		export.addMeterReadingWithoutReminder(reminder.owner,reminder.meter,cb)
	});

}

export.addMeterReadingWithoutReminder = (readingString, user, meter,cb) => {

	
	//Add Reading To the DB
	if(meter.user == user){

		var reading = new Reading({
			readingString,
			owner : user,
			meter,
		});

		reading.save( (err) =>{
			//Start a Call to twilio
			twilioController.submitMeterReading(user,meter,reading,(err) => { cb(err)});
		} );
		
	} 
	else
	{
		cb("User didn't Match")
	}
		



}

//Get All Readings
export.getAllReadingsForMeter(meter,cb){

	//Find All Reading for Meter
	var q = {meter};
	Meter.find(q)
	.exec((err,readings) => {
		cb(err,readings);
	});
}


//Confirm a Reading

export.addReadingConfirmation = (readingID,audioBuffer,audioTranscript,cb) => {

	//Find Reading
	var q = {
		_id : readingID,
		confirmation:{$ne: true}
	};

	Reading.findOne(q)
	.exec((err,reading)=>{
		
		var conf = new Confirmation({
			reading,
			transcript: audioTranscript,
			audio:audioBuffer
		})
		conf.save((err) => {
			eb(err);
		});

	})
		

}






