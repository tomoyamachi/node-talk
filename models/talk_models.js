(function() {
  var Title, User, Voice, i, item, mongoTypes, mongoose, required, title_scheme, user_scheme, voice_scheme;
  mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/talk_db');
  mongoTypes = require('mongoose-types');
  required = function(val) {
    return val && val.length;
  };
  mongoTypes.loadTypes(mongoose, "email");
  user_scheme = new mongoose.Schema({
    email: {
      type: mongoose.SchemaTypes.Email,
      validate: [required, "Email is required"]
    },
    password: {
      type: String,
      validate: [required, "Password is required"],
      match: /[A-Za-z0-9]{12}\$[0-9a-f]{32}/
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
  item = new User();
  item.email = "username";
  item.password = "pass";
  item.save(function(e) {
    return console.log('add user: ' + JSON.stringify(item));
  });
  i = {
    name: "Username"
  };
  User.findOne(i, function(err, users) {
    console.log(users);
    return console.log("foundOne");
  });
}).call(this);
