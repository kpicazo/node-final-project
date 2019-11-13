const express = require("express");
const blogRoutes = express.Router();
const Article = require('../models/articles');

blogRoutes.get('/', async function(req, res) {

  try {
    const articles = await Article.find({});
  
    console.log(articles);
  
    res.render('blog', {articles: articles});

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

blogRoutes.get('/:slug', function(req, res) {

  res.render('crossmanagereview'); // placeholder

});

module.exports = blogRoutes;