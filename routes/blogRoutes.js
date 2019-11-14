const express = require("express");
const blogRoutes = express.Router();
const Article = require('../models/Article');

// const passport = require('passport');

// Check if user is logged in
function userAuthenticated(req, res) {

  if (req.isAuthenticated()) {

    console.log(req.isAuthenticated());

    res.render('/');

  } else {
    console.log("user is not authenticated");
    res.render('login', {errMsg: "You are not logged in. Please log in to view your blog posts"});
  }
}

// Will serve all existing articles
// ((These router functions are modeled on what we did in class when we covered promises and async/await))
blogRoutes.get('/', userAuthenticated, async function(req, res) {

  // try {
  //   const articles = await Article.find({});
  
  //   res.render('blog', {articles: articles});

  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).send(err);
  // }
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

module.exports = blogRoutes;