const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true })); // to parse form data
const Customer = require('./models/customerSchema');   //importing schema
app.set('view engine', 'ejs') // set ejs as templating engine
app.use(express.static('public')) // to serve static files
var moment = require('moment'); // require moment.js for date formatting
var methodOverride = require('method-override') // to support PUT and DELETE methods in forms
app.use(methodOverride('_method')) // override with POST having ?_method=DELETE or ?_method=PUT


//Auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
 
 
const connectLivereload = require("connect-livereload");
const customer = require('./models/customerSchema');
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];



// GET Requests
app.get('/', async (req, res) => {
  const customerData = await Customer.find(); // fetch all users
  const updateSuccessMessage = req.query.updateSuccess === '1' ? 'Data updated successfully!' : '';
  res.render("index", {
    customerData,
    currentPage: 'index',
    pageTitle: 'Home Page',
    moment: moment,
    updateSuccessMessage
  });
});

app.get('/user/add.html', (req, res) => {
  const successMessage = req.query.success === '1' ? 'Data submitted successfully!' : '';
  res.render("user/add", { currentPage: 'add', successMessage, country_list: country_list });
});

// app.get('/user/search', (req, res) => {
//   res.render("user/search", { customerData : result , currentPage: 'search', pageTitle: 'Search', moment: moment });
// });

app.get('/edit/:id', (req, res) => {
     Customer.findById(req.params.id)
    .then(user => {
      res.render("user/edit", { user, currentPage: 'edit', pageTitle: 'Edit Page', country_list: country_list});
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("User not found");
    });
});

app.get('/view/:id', (req, res) => {
  Customer.findById(req.params.id) // fetch user by ID
    .then(user => {
      res.render("user/view", { user, currentPage: 'view', pageTitle: 'View Page', moment: moment });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("User not found");
    });
});


// POST Requests
app.post('/user/add.html', async (req, res) => {
  try {
    const customer = new Customer(req.body); // create a new instance of the model
    await customer.save();
    res.redirect('/user/add.html?success=1');
  } catch (err) {
    res.redirect('/user/add.html?success=0');
  }
});

app.post('/search', (req, res) => {
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


app.post('/edit/:id', async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true }); // update user by ID
    res.redirect('/?updateSuccess=1');
  } catch (err) {
    console.log(err, "Error updating user");
    res.redirect('/?updateSuccess=0');
  }
});

// delete request
app.delete('/edit/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id); // delete user by ID
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});


// Database Connection
mongoose.connect("mongodb+srv://zeyadahmed:0f1WyobCImGVWuzb@swdb.dogreps.mongodb.net/all-data?retryWrites=true&w=majority&appName=SWDB")
.then(() => {
  app.listen(port, () => {
     console.log(`http://localhost:${port}/`)
  })
})
.catch((err) => { 
  console.log(err)
});

