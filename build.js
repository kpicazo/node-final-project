/**
 * build.js code taken from in-class demo
 */

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const subscribers = require('./fixtures/subscribers');
const articles = require('./fixtures/articles')

/**
 * Connect to database and build 'users' collection
 */
const uri = process.env.DB_CONNECTION;

MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
   if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
   }
   console.log('build.js: Connected to database');

   const db = client.db("blog_db");
   const subCollection = db.collection('subscribers');
   const articleCollection = db.collection('articles');

   /**
    * If collection doesn't already exist, the drop() function will throw "MongoError: ns not found" in the console. The collection will     then be created before calling insertMany, so everything will still run as intended.
    * 
    * Note: Code is repetitive here. How to refactor this when we're dealing with promises?
    */

  subCollection.drop().then(function() {
    console.log('Collection dropped');
  }).catch(function(err){
    console.log(err);
  });

  articleCollection.drop().then(function() {
  console.log('Collection dropped');
  }).catch(function(err){
    console.log(err);
  });

  subCollection.insertMany(subscribers, function(err, cursor) {
    if (err) {          
      console.log('There was a problem');
    }
    console.log(`Inserted document count for subscribers collection: ${cursor.insertedCount}`);
  });

  articleCollection.insertMany(articles, function(err, cursor) {
    if (err) {          
      console.log('There was a problem');
    }
    console.log(`Inserted document count for articles collection: ${cursor.insertedCount}`);
  });
  client.close();
}); 