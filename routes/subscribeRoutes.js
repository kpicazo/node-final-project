const express = require("express");
const subscribeRoutes = express.Router();
const Subscriber = require('../models/subscriber');

/**
 * Serve the /subscribe page
 */

subscribeRoutes.get('/', function(req, res) {
  res.render('subscribe');
});

/**
 * Post request for newsletter form submission.
 */

subscribeRoutes.post('/', function(req, res, next) {

  // If subscriber has checked the adult checkbox, then the 'adult' attribute will exist in request.body with a value of 'on'. Otherwise, the attribute will not exist at all. We need to explicitly set this value to true or false in request.body to make it consistent with the Subscriber model. We can then use the request.body object to create a new document and save it to the database with Mongoose.

  if (req.body.adult) {
    req.body.adult = true;
  } else {
    req.body.adult = false;
  }

  // Create a new subscriber document with the request.body object and save it to the database.
  const subscriber = new Subscriber(req.body);

  // Currently this will throw an error if the submitted email address already exists in the database (email must be unique)
  subscriber.save(err => {

    if (err) {
      // Give a custom error name so that it's more clear in the console
      err.name = "FormSubmissionError";
      err.message = "There was a problem saving to the database";

      // Pass the error to Express's default error handler (in app.js)
      next(err);

    } else {
      // On success, render the home page. I'm using render() instead of redirect() to pass this 'success' variable in order to display the success message on the home page. To avoid EJS errors, this variable will have to be passed into every GET handler that serves the home page
      res.render("index", {success: true});

    }
  });
});

module.exports = subscribeRoutes;