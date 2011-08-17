(function() {
  var Title, User, Voice, app, db, express, mongoModel;
  express = require("express");
  app = module.exports = express.createServer();
  app.configure(function() {
    app.register(".haml", require("hamljs"));
    app.set("views", __dirname + "/views");
    app.set("view engine", "hamljs");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compiler({
      src: __dirname + "/public",
      enable: ["sass"]
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + "/public"));
  });
  mongoModel = require('./models/talk_models.js');
  db = mongoModel.createConnection('mongodb://localhost/talk_db');
  User = db.model("User");
  Title = db.model("Title");
  Voice = db.model("Voice");
  app.configure("development", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure("production", function() {
    return app.use(express.errorHandler());
  });
  app.get("/", function(req, res) {
    return res.render("index", {
      action: "/login",
      message: ""
    });
  });
  app.get("/main", function(req, res) {
    return Voice.find().desc('created_at').find(function(err, voices) {
      return res.render("main", {
        action: "/post",
        voices: voices
      });
    });
  });
  app.get("/login", function(req, res) {
    var create_new, email, i, password, res_error, res_success, user;
    res_error = function(mes) {
      return res.render("index", {
        action: "/login",
        message: mes
      });
    };
    res_success = function(mes) {
      return Voice.find().desc('created_at').find(function(err, voices) {
        return res.render("main", {
          action: "/post",
          voices: voices,
          message: mes
        });
      });
    };
    email = req.query.email;
    password = req.query.password;
    create_new = req.query["new"];
    if (!email) {
      res_error("not found email");
    }
    if (!password) {
      res_error("not found \"password\"");
    }
    user = new User();
    i = {
      email: email,
      password: password
    };
    if (create_new) {
      return User.findOne(i, function(err, doc) {
        console.log(doc);
        if (doc == null) {
          user.email = email;
          user.password = password;
          user.save();
          return res_success("you get account.");
        } else {
          return res_error("this accout is already gotten");
        }
      });
    } else {
      return User.findOne(i, function(err, doc) {
        console.log(doc);
        console.log("findOne method");
        if (doc == null) {
          return res_error("UserID or passwrod is different.");
        } else {
          return res_success("login success.");
        }
      });
    }
  });
  app.get('/post', function(req, res) {
    var item;
    if (!req.query.voice) {
      res.send("not enough post data");
      return;
    }
    item = new Voice();
    item.contents = req.query.voice;
    item.created_at = new Date;
    item.save(function(err) {
      if (!err) {
        return console.log('add new post:' + JSON.stringify(item));
      }
    });
    return res.redirect("/");
  });
  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}).call(this);
