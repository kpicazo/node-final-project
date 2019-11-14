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

/**
 * Will serve one blog article based on its slug
 */
blogRoutes.get('/:slug', async function(req, res) {

  // Retrieve article from Atlas
  const article = await Article.find({slug: req.params.slug});

  // Can render all articles to the same template. The endpoint with the slug will still show up in the browser address bar (e.g localhost:3000/blog/slug)
  res.render('article', {article: article});
  
});

module.exports = blogRoutes;