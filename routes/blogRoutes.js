const express = require("express");
const blogRoutes = express.Router();
const Article = require('../models/articles');

blogRoutes.get('/', async function(req, res) {

  try {
    const articles = await Article.find({});
  
    res.render('blog', {articles: articles});

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

blogRoutes.get('/:slug', async function(req, res) {

  // Retrieve article from Atlas
  const article = await Article.find({slug: req.params.slug});

  console.log(article);

  // Render article page with article data
  res.render('article', {article: article});
  
});

module.exports = blogRoutes;