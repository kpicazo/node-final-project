// build.js code taken from in-class demo

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const subscribers = require('./fixtures/subscribers');
const articles = require('./fixtures/articles');

const bcrypt = require('bcrypt');

// Connect to database and build 'users' collection
const uri = process.env.DB_CONNECTION;

MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {

  if(err) {
    console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
  }
  console.log('build.js: Connected to database');

  const db = client.db("blog_db");
  const subCollection = db.collection('subscribers');
  const articleCollection = db.collection('articles');
  const userCollection = db.collection('users');

  // If collection doesn't already exist, the drop() function will throw "MongoError: ns not found" in the console. 
  // The collection will then be created before calling insertMany(), so everything will still run as intended.
  subCollection.drop().then(function() { 
    console.log('Subscriber collection dropped');
  }).catch(function(err){
    console.log(err);
  });

  articleCollection.drop().then(function() {
  console.log('Article collection dropped');
  }).catch(function(err){
    console.log(err);
  });

  userCollection.drop().then(function() {
    console.log('User collection dropped');
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

  // Create one user for login testing.
  // (In hindsight, probably should not have tracked this file in the repo since the user 
  // credentials are visible in the code)
  
  // ref: https://www.npmjs.com/package/bcrypt
  let newUser = {email: 'user@test.com', password: 'password'};

  // Hash the password then save to database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;

      // Store newly hashed password inside user object
      newUser.password = hash;

      // Insert the user object into the database
      userCollection.insertOne(newUser, function(err, cursor) {
        if (err) { 
          console.log(err);         
        }
        console.log(`Inserted document count for users collection: ${cursor.insertedCount}`);
      });
    });
  });

  // This is causing errors because the above database functions are asynchronous, and client.close() 
  // is being run before the responses from those asynchronous functions come back. For now I'm just
  // commenting it out, but ideally would want to refactor this whole thing so that client.close() only 
  // runs when all the database calls are done.

  // client.close();
});

