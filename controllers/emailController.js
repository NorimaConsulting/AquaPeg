
exports.sendReminder = (user,meter,reminder,cb)=>{

	console.log("==========================");
	console.log("	Reminder Email		");
	console.log("==========================");
	console.log("User Email: "+ user.email);
	console.log("Meter: "+ meter.meterNumber);
	console.log("Reminder: "+ reminder.accessCode);
	console.log("==========================");

}


exports.sendReadingConfirmation = (user, meter, reading, audioBuffer, audioTranscript, cb) =>{
	console.log("===========================");
	console.log("	Confirmation Email		");
	console.log("===========================");
	console.log("User Email: "+ user.email);
	console.log("Meter: "+ meter.meterNumber);
	console.log("Reading: "+ reading.readingString);
	console.log("audioTranscript: "+ reading.audioTranscript);
	console.log("===========================");

}
