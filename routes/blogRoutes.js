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

  if (req.params.slug === 'cross-manage') {

    // Retrieve article from Atlas
    const article = await Article.find({slug: req.params.slug});

    console.log(article);

    // Render article page with article data
    res.render('crossmanagereview', {article: article});

  } else {
    res.redirect('/'); // This will redirect but url in browser will not change. Why?
  }
});

module.exports = blogRoutes;