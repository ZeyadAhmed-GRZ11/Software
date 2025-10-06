const express = require('express')
const router = express.Router()
const Customer = require('../models/customerSchema');   //importing schema
var moment = require('moment'); // require moment.js for date formatting
const UserController = require('../controllers/UserController');



router.get('/add.html',UserController.AddUserPage);

router.post('/add.html',UserController.Post_AddUserPage);


module.exports = router;