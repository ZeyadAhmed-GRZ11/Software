const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
const Customer = require('./models/customerSchema');   //importing schema
app.set('view engine', 'ejs')
app.use(express.static('public'))
var moment = require('moment'); // require
var methodOverride = require('method-override')
app.use(methodOverride('_method'))


//Auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
 
 
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// GET Requests
app.get('/', async (req, res) => {
  const customerData = await Customer.find();
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
  res.render("user/add", { currentPage: 'add', successMessage });
});

app.get('/edit/:id', (req, res) => {
     Customer.findById(req.params.id)
    .then(user => {
      res.render("user/edit", { user, currentPage: 'edit', pageTitle: 'Edit Page' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("User not found");
    });
});

app.get('/view/:id', (req, res) => {
  Customer.findById(req.params.id)
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
    const customer = new Customer(req.body);
    await customer.save();
    res.redirect('/user/add.html?success=1');
  } catch (err) {
    res.redirect('/user/add.html?success=0');
  }
});

app.post('/edit/:id', async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect('/?updateSuccess=1');
  } catch (err) {
    console.log(err, "Error updating user");
    res.redirect('/?updateSuccess=0');
  }
});

// delete request
app.delete('/edit/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
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

