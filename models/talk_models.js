(function() {
  var Title, User, Voice, mongoTypes, mongoose, required, title_scheme, user_scheme, voice_scheme;
  mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/talk_db');
  mongoTypes = require('mongoose-types');
  required = function(val) {
    return val && val.length;
  };
  mongoTypes.loadTypes(mongoose, "email");
  user_scheme = new mongoose.Schema({
    email: {
      type: String,
      validate: [required, "Email is required"]
    },
    password: {
      type: String
    },
    created_at: {
      type: Date,
      "default": Date.now
    }
  });
  title_scheme = new mongoose.Schema({
    created_at: Date,
    voice: String,
    user_id: mongoose.Schema.ObjectId
  });
  title_scheme.virtual("user").get(function() {
    return this["userobj"];
  }).set(function(u) {
    return this.set("user_id", u._id);
  });
  voice_scheme = new mongoose.Schema({
    contents: String,
    title_id: mongoose.Schema.ObjectId,
    created_at: Date
  });
  voice_scheme.virtual("title").get(function() {
    return this["titleobj"];
  }).set(function(t) {
    return this.set("title_id", t._id);
  });
  User = mongoose.model('User', user_scheme);
  Title = mongoose.model('Title', title_scheme);
  Voice = mongoose.model('Voice', voice_scheme);
  exports.createConnection = function(url) {
    return mongoose.createConnection(url);
  };
}).call(this);
