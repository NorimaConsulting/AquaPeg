/**
 * GET /
 * Home page.
 */

const express = require('express')
const router = express.Router()
const passportConfig = require('../config/passport');
const meterController = require('../controllers/meterController');


router.get('/SubmitReading/:readingID', (req, res) => {

  var readingID = req.params.readingID;
  readingID = readingID.trim();
  console.log(readingID)

  meterController.getAReadingByID(readingID, (err,reading)=>{
    if(reading){
      res.setHeader("Content-Type", "application/xml");
      res.render('submitReadingxml', {
        reading

      });
    }
    else{
      res.status(404).send("Reading Not Found")
    }
  })

});

router.post('/ReadingHasBeenSubmited/:ReadingID', (req, res) => {

});


module.exports = router;
