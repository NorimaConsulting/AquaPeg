/**
 * GET /
 * Home page.
 */

const express = require('express')
const router = express.Router()
const passportConfig = require('../config/passport');
const meterController = require('../controllers/meterController');


router.post('/meter/', passportConfig.isAuthenticated, (req, res) => {

  var meterNumber = req.body.meterNumber;
  meterNumber = meterNumber.trim();
  if(isNormalInteger(meterNumber)){
    meterController.addMeterForUser(req.user, meterNumber,(err)=>{

      if(err){
        res.status(500).send(err)
      }else{
        res.send({success:true})
      }

    });
  }else{
    res.status(400).send({})
  }

});

router.delete('/meter/:meterID', passportConfig.isAuthenticated, (req, res) => {
  var meterID = req.params.meterID;
  meterID = meterID.trim();
  if(meterID){
    meterController.removeMeterForUser(req.user, meterID,(err)=>{

      if(err){
        res.status(500).send(err)
      } else {
        res.send({succes:true})
      }

    });
  }else{
    res.status(400).send({})
  }

});


router.post('/meter/:meterID/Reading/', passportConfig.isAuthenticated, (req, res) => {

  var meterID = req.params.meterID;
  var readingString = req.body.readingString;
  meterID = meterID.trim();
  readingString = readingString.trim();

  if(meterID && req.user && isNormalInteger(readingString) ){
    meterController.addMeterReadingWithoutReminder(readingString, req.user, meterID, (err) => {
      if(err){
        res.status(500).send(err)
      } else {
        res.send({success:true})
      }
    });
  }else{
    var msg = "Unknow Error"
    if(!meterID)
      msg = "No Meter ID"

    if(!req.user)
      msg = "No User"

    if(!readingString)
      msg = "Missing Reading String"

    if(!isNormalInteger(readingString))
      msg = "A Bad Reading String"

    res.status(400).send({message:msg})
  }
});

router.post('/meter/reminder/:reminderToken/Reading/', (req, res) => {

  var reminderToken = req.params.reminderToken;
  var readingString = req.body.readingString;
  reminderToken = reminderToken.trim();
  readingString = readingString.trim();

  if( reminderToken && isNormalInteger(readingString) ){
    meterController.addMeterReadingWithReminderToken(readingString, reminderToken,(err)=>{
      if(err){
        res.status(500).send(err)
      } else {
        res.send({success:true})
      }
    });
  }else{
    res.status(400).send({})
  }
});



function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n >= 0;
}


module.exports = router;
