const express = require('express')
const router = express.Router()
const Customer = require('../models/customerSchema');   //importing schema
var moment = require('moment'); // require moment.js for date formatting
const UserController = require('../controllers/UserController');

// GET Requests
// MVC pattern: Controller handles the logic, routes handle the endpoints
router.get('/', UserController.getAllUsers);

// GET Requests
router.get('/view/:id', (req, res) => {
  Customer.findById(req.params.id) // fetch user by ID
    .then(user => {
      res.render("user/view", { user, currentPage: 'view', pageTitle: 'View Page', moment: moment });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("User not found");
    });
});


// delete request
router.delete('/edit/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id); // delete user by ID
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});


module.exports = router
