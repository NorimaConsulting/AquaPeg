/**
 * GET /
 * Home page.
 */

const express = require('express')
const router = express.Router()
const passportConfig = require('../config/passport');
const meterController = require('../controllers/meterController');


router.get('/SubmitReading/:ReadingID', (req, res) => {

  res.render('submitReadingxml', {

  });
});

router.post('/ReadingHasBeenSubmited/:ReadingID', (req, res) => {

});


module.exports = router;
