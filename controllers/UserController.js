const Customer = require('../models/customerSchema');   //importing schema
var moment = require('moment'); // require moment.js for date formatting


const getAllUsers = async (req, res) => {
  const customerData = await Customer.find(); // fetch all users
  const updateSuccessMessage = req.query.updateSuccess === '1' ? 'Data updated successfully!' : '';
  res.render("index", {
    customerData,
    currentPage: 'index',
    pageTitle: 'Home Page',
    moment: moment,
    updateSuccessMessage
  });
}












module.exports = {getAllUsers, }; 
