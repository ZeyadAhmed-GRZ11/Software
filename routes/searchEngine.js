const express = require('express')
const router = express.Router()
const Customer = require('../models/customerSchema');   //importing schema
var moment = require('moment'); // require moment.js for date formatting
const UserController = require('../controllers/UserController');


router.post('/search', UserController.SearchEngine); 


module.exports = router;