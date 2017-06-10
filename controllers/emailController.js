
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('sendgrid').mail;
const pug = require('pug');
const moment = require('moment');

//templates
const reminderEmail = pug.compileFile('./emailPug/reminderEmail.pug');
const confirmationEmail = pug.compileFile('./emailPug/confirmationEmail.pug');


exports.genericEmail = (to,subject,body,cb) => {

	var helper = require('sendgrid').mail;
	var fromEmail = new helper.Email('casey.forsyth@norimaconsulting.com');
	var toEmail = new helper.Email(to);
	var content = new helper.Content('text/plain',body);
	var subjectWithDate = subject + " " + moment().format("MMM Do YY h:mm")
	var mail = new helper.Mail(fromEmail, subjectWithDate, toEmail, content);


	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON()
	});

	sg.API(request, function (error, response) {
	  if (error) {
	    console.log('Error response received');
	  }
	  console.log(response.statusCode);
	  console.log(response.body);
	  console.log(response.headers);
		cb(error);
	});

}

exports.sendReminder = (user,meter,reminder,cb)=>{

	console.log("==========================");
	console.log("	Reminder Email		");
	console.log("==========================");
	console.log("User Email: "+ user.email);
	console.log("Meter: "+ meter.meterNumber);
	console.log("Reminder: "+ reminder.accessCode);
	console.log("==========================");

	var helper = require('sendgrid').mail;
	var fromEmail = new helper.Email('casey.forsyth@norimaconsulting.com');
	var toEmail = new helper.Email(user.email);
	var subject = 'Hey, Sup? Time to check your water meter ' + moment().format("MMM Do YY h:mm");
	var content = new helper.Content("text/html", reminderEmail({
		meter,
		reminder,
		hostUrl:process.env.HOST_URL
	}));
	console.log(process.env.HOST_URL);
	console.log(content);

	var mail = new helper.Mail(fromEmail, subject, toEmail, content);


	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON()
	});

	sg.API(request, function (error, response) {
	  if (error) {
	    console.log('Error response received');
	  }
	  console.log(response.statusCode);
	  console.log(response.body);
	  console.log(response.headers);
		cb(error);
	});


}


exports.sendReadingConfirmation = (user, meter, reading, audioUrl, audioTranscript, cb) =>{
	console.log("===========================");
	console.log("	Confirmation Email		");
	console.log("===========================");
	console.log("User Email: "+ user.email);
	console.log("audioUrl: "+ audioUrl);
	console.log("Meter: "+ meter.meterNumber);
	console.log("Reading: "+ reading.readingString);
	console.log("audioTranscript: "+ reading.audioTranscript);
	console.log("===========================");


	var helper = require('sendgrid').mail;
	var fromEmail = new helper.Email('casey.forsyth@norimaconsulting.com');
	var toEmail = new helper.Email(user.email);
	var subject = 'Check it out we entered your water meter reading ' + moment().format("MMM Do YY h:mm");
	var content = new helper.Content("text/html", confirmationEmail({
		meter,
		reading,
		audioUrl,
		hostUrl:process.env.HOST_URL
	}));
	var mail = new helper.Mail(fromEmail, subject, toEmail, content);


	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON()
	});

	sg.API(request, function (error, response) {
	  if (error) {
	    console.log('Error response received');
	  }
	  console.log(response.statusCode);
	  console.log(response.body);
	  console.log(response.headers);
		cb(error);
	});

}
