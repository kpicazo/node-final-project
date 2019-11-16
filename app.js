//----------------//
// Module imports //
//----------------//

const express = require('express');
const path = require('path');

const subscribeRoutes = require('./routes/subscribeRoutes');
const blogRoutes = require('./routes/blogRoutes');

const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');

// Passport Config
// require() returns the function that is exported by ./config/passport, which then 
// evaluates by calling the passport module that was required above in this file
require('./config/passport')(passport);

// Initialize Express
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs'); 

// Database connection - Connects to Mongo Atlas
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const final = mongoose.connection;

final.on('error', console.error.bind(console, 'connection error:'));
final.once('open', function() {
  console.log('DB Connected!!!');
});

//--------------- //
// Authentication //
//--------------- //

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware for reading HTML POST data
app.use(express.urlencoded({ extended: false }));

//---------------------- //
// Endpoints and Routers // 
//---------------------- //

app.get('/', function(req, res) {
  res.render('index', { success: false });
});

// Router for blog articles
app.use('/blog', blogRoutes); // this messes up the path for static assets, have to make sure all URLs for 
                              // static assets are relative in the HTML 
                              // (ref: https://stackoverflow.com/questions/52422035/static-files-not-working-in-sub-child-routes-in-express-js)

// Default page endpoint
app.get('/:page', function(req, res) {
  res.render(req.params.page, { success: false, errMsg: "" }); 
});

// Router for newsletter subscription
app.use('/subscribe', subscribeRoutes);

// Middleware for serving static assets. Will serve all types of files (css, images)
// as long as they are in the directory specified in path.join()
app.use(express.static(path.join(__dirname, 'assets')));

// Default error handler
app.use(function(err, req, res, next) {
  if (err) {

    // Redirect to form if error came from form submission
    if (err.name === "FormSubmissionError") {

      res.render('subscribe', {errMsg: "That email is already in use. Please enter another email address."}); 

    } else {
      // All other errors will return a 404
      console.log(err);
      res.status(404);
      res.render('filenotfound');
    }
  }
});

//------------- //
// Server start //
//------------- //

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});
