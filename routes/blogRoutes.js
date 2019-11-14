const express = require("express");
const blogRoutes = express.Router();
const Article = require('../models/Article');

const passport = require('passport');

// Middleware to check if user is logged in
async function userAuthenticated(req, res) {

  if (req.isAuthenticated()) {

    console.log("User authenticated: " + req.isAuthenticated());

    console.log(req.user);

    try {
      const articles = await Article.find({});
  
      res.render('blog', {articles: articles});

    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }

  } else {
    console.log("user is not authenticated");
    res.render('login', {errMsg: "You are not logged in. Please log in to view your blog posts"});
  }
}

// Will serve all existing articles
// ((These router functions are modeled on what we did in class when we covered promises and async/await))
blogRoutes.get('/', userAuthenticated, function(req, res) {

  
});

blogRoutes.get('/login', (req, res) => {
  res.render('login', {errMsg: ""});
});

// Will serve one blog article based on its slug
blogRoutes.get('/:slug', async function(req, res) {

  try {

    // Retrieve article from Atlas
    const article = await Article.find({slug: req.params.slug});

    // Can render all articles to the same template. The endpoint with the slug will still show up in the browser address bar (e.g localhost:3000/blog/slug)
    res.render('article', {article: article});

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

// Login
// Passport will take the form values and authenticate them using a local strategy defined in ./auth/passport.js
blogRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/blog',
    failureRedirect: '/blog/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = blogRoutes;