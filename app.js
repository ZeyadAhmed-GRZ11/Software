const express = require('express')
const app = express()
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true })); // to parse form data
app.set('view engine', 'ejs') // set ejs as templating engine
app.use(express.static('public')) // to serve static files
var methodOverride = require('method-override') // to support PUT and DELETE methods in forms
app.use(methodOverride('_method')) // override with POST having ?_method=DELETE or ?_method=PUT
const allRoutes = require('./routes/allRoutes')
const addUserRoute = require('./routes/addUser')
const editUserRoute = require('./routes/editUser')
const searchEngineRoute = require('./routes/searchEngine')

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

// Routes
app.use(allRoutes);
app.use(editUserRoute);
app.use("/user",addUserRoute);
app.use(searchEngineRoute);
