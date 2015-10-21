// Dependencies
var mongoose = require('mongoose');
var User = require('./model.js');

// Open app routes
module.exports = function(app){

  // GET Routes
  // ---------------------------------------
  // Retrieve records for all users in the db

  app.get('/users', function(req,res){
    // Uses Mongoose schema to run the search (empty conditions)
    var query = User.find({});
    query.exec(function(err, users){
      
      if(err)
        res.send(err);

      // if no errors, responds with JSON of all users
      res.json(users);

    });
  });

  // POST Routes
  // ---------------------------------------
  // Provides a method for saving new users in the db

  app.post('/users', function(req, res){

    // Creates a new user based on the Mongoose schema
    // and add the post to body

    var newuser = new User(req.body);
    newuser.save(function(err){
      if(err)
        res.send(err);

      // if no errors are found, response with a JSON
      // of the new user
      res.json(req.body);
    });
  });

};