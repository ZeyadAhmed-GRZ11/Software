const express = require('express')
const router = express.Router()
const Customer = require('../models/customerSchema');   //importing schema
var moment = require('moment'); // require moment.js for date formatting


router.post('/search', (req, res) => {
  console.log("****************************************");
  const searchText = req.body.searchText.trim();
  const ageQuery = Number(searchText);

  Customer.find({
    $or: [
      { firstName: { $regex: searchText, $options: "i" } },
      { lastName: { $regex: searchText, $options: "i" } },
      { age: !isNaN(ageQuery) ? ageQuery : null }
    ]
  })
  .then((result) => {
    console.log(result);
    res.render("user/search", {
      arr: result, 
      currentPage: 'search',
      pageTitle: 'Search',
      moment: moment
    });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Server Error");
  });
});


module.exports = router;