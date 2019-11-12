/**
 * build.js code taken from in-class demo
 */

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const subscribers = require('./fixtures/subscribers');

/**
 * Connect to database and build 'users' collection
 */
const uri = process.env.DB_CONNECTION;

MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
   if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
   }
   console.log('build.js: Connected to database');

   const db = client.db("subscriber_db");
   const collection = db.collection('subscribers');

   // If collection doesn't already exist, the following will throw "MongoError: ns not found" in the console. The collection will then be created before calling insertMany, so everything will still run as intended.
   collection.drop().then(function() {
     console.log('Collection dropped');
   }).catch(function(err){
     console.log(err);
   });

   collection.insertMany(subscribers, function(err, cursor) {
    if (err) {          
      console.log('There was a problem');
    }
    console.log(`Inserted document count: ${cursor.insertedCount}`);
  });
  client.close();
}); 