const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
const Customer = require('./models/customerSchema');   //importing schema
app.set('view engine', 'ejs')
app.use(express.static('public'))

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
  res.render("index",{ customerData, currentPage: 'index', successMessage: 'Data submitted successfully!' }) 
})

app.get('/user/add.html', (req, res) => {
  res.render("user/add", { currentPage: 'add', successMessage: 'Data submitted successfully!' })
})

app.get('/user/view.html', (req, res) => {
  res.render("user/view")
})

app.get('/user/edit.html', (req, res) => {
  res.render("user/edit")
})

// POST Requests
app.post('/user/add.html', (req, res) => {

  console.log(req.body) // to see the form data in the console
  const customer = new Customer(req.body); // create a new customer document from the form data
  customer.save() // save the document to the database
  .then(( ) => {
    res.redirect('/user/add.html')
  }) 
  .catch((err) => { 
    console.log(err)
  })

})

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

