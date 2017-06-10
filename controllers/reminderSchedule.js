
const meterController = require('./meterController');
const emailController = require('./emailController');

const moment = require('moment-timezone')

const CHECK_SCHEDULE = 1000*60*60

exports.start = () =>{
  setInterval(()=>{
    checkAndSendReminders();
  },CHECK_SCHEDULE);
  checkAndSendReminders();
}


function checkAndSendReminders(){

  console.log("Checking For New Reminders");
  meterController.getAllMetersWithOwnerReminderReading((err,meters)=>{

    var curMoment = moment();

    for (var i = 0; i < meters.length; i++) {
      checkEach(meters[i],curMoment)
    }

  });
}


function checkEach(curr,currMoment){

  var readingIsOutOfDate = true;
  if(curr.latestReading){

    var readIsOldMoment = readIsOldMoment = moment(curr.latestReading.createdAt)
                        .add(curr.reminderSchedulePeriod,'ms');

    readingIsOutOfDate = readIsOldMoment.isBefore(currMoment);
  }

  var reminderIsOld = true;
  if(curr.latestReminder){
    var reminderIsOldMoment = moment(curr.latestReminder.createdAt)
                            .add(curr.reminderSchedulePeriod / 4,'ms');
    reminderIsOld = reminderIsOldMoment.isBefore(currMoment);
  }


  if(readingIsOutOfDate && reminderIsOld){
    sendNewReminder(curr);
  }
}

function  sendNewReminder(meter){
  meterController.sendNewReminder(meter,(err)=>{});
}
