
var twilio = require('twilio');

var client;
var creds = new TwilioCredentials();

var MESSAGE_CHAR_LIMIT = 160;

function TwilioCredentials () {
  this.phone = process.env.TWILIO_PHONE_NUMBER;
  this.sid = process.env.TWILIO_SID;
  this.auth = process.env.TWILIO_TOKEN;

  this.getPhone = function () {
    return this.phone;
  }

  this.getSid = function () {
    return this.sid;
  }

  this.getAuth = function () {
    return this.auth;
  }
}

sendSms = ( toPhone, message, callback ) => {
  creds = creds || new TwilioCredentials();
  client = client || new twilio.RestClient(creds.getSid(), creds.getAuth());

  if (message.length > MESSAGE_CHAR_LIMIT) {
    callback("Message length (" + message.length + ") exceeds character limit (" + MESSAGE_CHAR_LIMIT + ")", null)
  }
  else if (message.length <= 0) {
    callback("Messages must contain at least one character", null)
  }
  else {
    client.sms.messages.create({
      to: toPhone,
      from: creds.getPhone(),
      body: message,
      maxPrice: 0
    }, callback);
  }
}

sendCall = (toPhone, messageURL,RecordingStatusCallback,RecordingStatusCallbackMethod, callback) => {
  creds = creds || new TwilioCredentials();
  client = client || new twilio.RestClient(creds.getSid(), creds.getAuth());

  client.makeCall({
    to: toPhone,
    from: creds.getPhone(),
    url: messageURL,
    RecordingStatusCallback,
    RecordingStatusCallbackMethod,
    record : true
  }, function(err, call) {
      callback(err,call);
  });
}




exports.submitMeterReading = (user,meter,reading,cb)=>{

	console.log("==========================");
	console.log("	Submitting A MeterReading To The City		");
	console.log("==========================");
	console.log("User Email: "+ user.email);
	console.log("Meter: "+ meter.meterNumber);
	console.log("Reading: "+ reading.readingString);
	console.log("==========================");

	var messageURL = process.env.HOST_URL + "twilio-api/SubmitReading/" + reading._id;
	var callTo = process.env.TWILIO_SEND_TO_PHONE_NUMBER
  var RecordingStatusCallback = process.env.HOST_URL + "twilio-api/ReadingHasBeenSubmited/" + reading._id
  var RecordingStatusCallbackMethod = "POST"
	sendCall(callTo,
            messageURL,
            RecordingStatusCallback,
            RecordingStatusCallbackMethod,
            (err,call) => {
        		cb(err)
        	});



}
