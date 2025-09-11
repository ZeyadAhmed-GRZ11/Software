const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
const Customer = require('./models/customerSchema');   //importing schema
app.set('view engine', 'ejs')
app.use(express.static('public'))
var moment = require('moment'); // require

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
  res.render("index",{ customerData, currentPage: 'index', successMessage: 'Data submitted successfully!', pageTitle: 'Home Page' , moment: moment }) 
})

app.get('/user/add.html', (req, res) => {
  const successMessage = req.query.success === '1' ? 'Data submitted successfully!' : '';
  res.render("user/add", { currentPage: 'add', successMessage });
});

app.get('/edit/:id', async (req, res) => {
  try {
    const user = await Customer.findById(req.params.id);
    res.render("user/edit", { user, currentPage: 'edit', pageTitle: 'Edit Page', successMessage2: "Data updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("User not found");
  }
});

app.get('/view/:id', async (req, res) => {
  try {
    const user = await Customer.findById(req.params.id); // fetch user by ID
    res.render("user/view", { user, currentPage: 'view', pageTitle: 'View Page', moment: moment }); // render view with user data
  } catch (err) {
    console.log(err);
    res.status(500).send("User not found");
  }
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

app.post('/user/delete/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

app.post('/edit/:id', async(req, res)=>{
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
     res.redirect('/');
  }catch(err){
    console.log(err, "Error updating user");
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

