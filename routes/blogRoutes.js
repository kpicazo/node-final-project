const express = require("express");
const blogRoutes = express.Router();
const Article = require('../models/Article');

const passport = require('passport');
const userAuthenticated = require('../config/auth');

// Note on error messages
//
// Trying to log in with an unregistered email or an incorrect passport will redirect to the login
// form WITHOUT error messages to inform the user what went wrong. I had error message handling code
// in my previous assignment but it was pretty clunky and I planned to refactor it all using
// connect-flash (https://www.npmjs.com/package/connect-flash) but... didn't give myself enough time

// Login
//
// Passport will take the form values and authenticate them using a "strategy" (we're using 
// a local strategy) defined in ./config/passport.js
blogRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/blog',
    failureRedirect: '/blog/login'
    // failureFlash: true (Not using flash messages for errors yet)
  })(req, res, next);
});

blogRoutes.get('/login', (req, res) => {
  res.render('login', {errMsg: ""});
});

// Logout
//
// Originally this was at the bottom of the router code, but this was causing an EJS error coming from article.ejs. 
// I think it's because the router thought "logout" was a slug and was trying to serve an article page.
// So to get around this, I placed the logout GET request at the top so that router code executes this first 
// if we click on the logout button.
blogRoutes.get('/logout', (req, res) => {

  // Passport function for logging out
  req.logout();
  // Redirect user to the login page
  res.redirect('login');
});

// Will serve all existing articles
// (These router functions are modeled on what we did in class when we covered promises and async/await)
blogRoutes.get('/', userAuthenticated, async function(req, res) {

  try {
    // Retrieve all articles from Atlas
    const articles = await Article.find({});

    // Pass that database data to the 'blog' view and render it
    res.render('blog', {articles: articles});

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

// Will serve one blog article based on its slug
blogRoutes.get('/:slug', userAuthenticated, async function(req, res) {

  try {

    // Retrieve article from Atlas using the slug as a find parameter
    const article = await Article.find({slug: req.params.slug});

    // Can render all articles to the same template. The endpoint with the slug will 
    // still show up in the browser address bar (e.g localhost:3000/blog/slug)
    res.render('article', {article: article});

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = blogRoutes;