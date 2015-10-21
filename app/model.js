// pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Create a user schema
// This will be the basis of how user data is stored.
var UserSchema = new Schema({
  username: {type: String, required: true},
  gender: {type: String, required: true},
  age: {type: Number, required: true},
  favlang: {type: String, required: true},
  location: {type: [Number], required: true}, // [Long, Lat]
  htmlverified: String,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now} 
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dscphere format
// (critical for running proximity searches)
UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere.
// Sets the MongoDB collection to be used as 'mean-google-maps-user'
module.exports = mongoose.model('mean-google-maps-user', UserSchema);