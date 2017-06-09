/**
 * GET /
 * Home page.
 */

const express = require('express')
const router = express.Router()
const passportConfig = require('../config/passport');
const meterController = require('../controllers/meterController');


router.post('/SubmitReading/:readingID', (req, res) => {

  var readingID = req.params.readingID;
  readingID = readingID.trim();
  console.log(readingID)

  meterController.getAReadingByID(readingID, (err,reading)=>{
    if(reading){
      meterNumberArr = getArrayOfDigits(reading.meter.meterNumber);
      readingStringArr = getArrayOfDigits(reading.readingString);

      res.setHeader("Content-Type", "application/xml");
      res.render('submitReadingxml', {
        reading,
        meterNumberArr,
        readingStringArr

      });
    }
    else{
      res.status(404).send("Reading Not Found")
    }
  })

});

router.post('/ReadingHasBeenSubmited/:ReadingID', (req, res) => {

  console.log("============Confirm Recived===========");
  if(req.body.CallStatus =="no-answer"){
    emailController.addReadingConfirmation(readingID,
      req.body.CallStatus.RecodingUrl,
      audioTranscript,
      (err)=>{
        if(err){
          res.status(500).send(err)
        }else{
          res.send({success:true})
        }
      })
  }

});


function getArrayOfDigits(str) {
  var output = str.split('');
  for (var i = 0; i < output.length; i++) {
    output[i] = parseInt(output[i]);
  }
  return output;
}

module.exports = router;
