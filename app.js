const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
const Mydata = require('./models/mydataSchema');
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




app.get('/', (req, res) => {
  Mydata.find()
  .then((result) => { 
      res.render("home",{mytitle:"home page", arr:result})
  })
  .catch((err) => { 
     console.log(err)
  })
})

app.get('/index.html', (req, res) => {
  res.send("<h1>Data send Success👍</h1>")
})

mongoose.connect("mongodb+srv://zeyadahmed:0f1WyobCImGVWuzb@swdb.dogreps.mongodb.net/all-data?retryWrites=true&w=majority&appName=SWDB")
.then(() => {
  app.listen(port, () => {
     console.log(`http://localhost:${port}/`)
  })
})
.catch((err) => { 
  console.log(err)
});

app.post('/', (req, res) => {
  // console.log(req.body)
  const data = new Mydata(req.body);
  data.save().then(() => { 
    res.redirect("/index.html");
  }).catch((err) => { 
    console.log(err);
  })

})
