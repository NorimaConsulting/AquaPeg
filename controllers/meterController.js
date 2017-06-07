'use strict';

const Meter = require('../models/Meter.js');
const User = require('../models/User.js');
const Reading = require('../models/Reading.js');
const Reminder = require('../models/Reading.js');


export.getAllMeters = (user) => {

	//Get all !deleted;

}



export.getMetersForUser = (user) => {

	//Check User && !deletedAtDate


}




export.addMeterForUser = (user, meterNumber) => {


}


export.removeMeterForUser = (user, meterID) => {

	//set deletedAtDate

}





//Sending A Reminder 
export.sendNewReminder = (meter) = >{

	//Create a reminder in the DB

		//Send Email to user



}




//Adding A Reading
export.addMeterReadingWithReminderToken = (reminderToken) => {

	//Find Reminder with
		//Call addMeterReadingWithoutReminder

}

export.addMeterReadingWithoutReminder = (userID, meterID) => {

	
	//Add Reading To the DB
		if(meter.user == user){
			//Start a Call to twillio
		}
		



}

//Get All Readings
export.getAllReadingsForMeter(meter){

	//Find All Reading for Meter

}


//Confirm a Reading

export.addReadingConfirmation = (readingID,transcriptURL) => {

	//Find Reading
		//Add Confirmation to the DB
			//Save Confirm To Reading
				//Send An Email to the user


}





