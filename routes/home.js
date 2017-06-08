/**
 * GET /
 * Home page.
 */

const express = require('express')
const router = express.Router()
const passportConfig = require('../config/passport');
const meterController = require('../controllers/meterController');


router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home'
  });
});

router.get('/All-Meters', passportConfig.isAuthenticated, (req, res) => {
  meterController.getMetersForUserWithLatestReading(req.user,(err,meters)=>{
    console.log("Got it")
    if(err){
      res.status(500).send(err)
    }else{
      res.render('allMeters', {
        title: 'All Meters',
        meters
      });
    }

  });

});

router.get('/Meter/:meterID', passportConfig.isAuthenticated, (req, res) => {

  var meterID = req.params.meterID;
  meterID = meterID.trim();

  meterController.getMeterForUser(meterID, req.user,(err,meter) =>{
    meterController.getAllReadingsForMeter(meter,(err,readings)=>{
      res.render('singleMeter', {
        title: 'Single Meter',
        meter,
        readings
      });
    });
  });

});

router.get('/Meter/:meterID/New-Reading', passportConfig.isAuthenticated, (req, res) => {

  var meterID = req.params.meterID;
  meterID = meterID.trim();

  meterController.getMeterForUser(meterID, req.user,(err,meter) =>{
    res.render('newReading', {
      title: 'New Readings',
      meter
    });
  });

});

router.get('/Meter/reminder/:reminderToken/New-Reading', (req, res) => {

  var reminderToken = req.params.reminderToken;
  reminderToken = reminderToken.trim();

  meterController.getMeterForActiveToken(reminderToken,(err,meter) =>{
    res.render('newReading', {
      title: 'New Readings',
      meter,
      reminderToken
    });
  });

});

module.exports = router;
