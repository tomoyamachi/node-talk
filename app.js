(function() {
  var Title, User, app, db, express, mongoModel;
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
    return Title.find().desc('created_at').find(function(err, titles) {
      return res.render("index", {
        title: "Express",
        action: "/post",
        titles: titles
      });
    });
  });
  app.get('/post', function(req, res) {
    var item;
    if (!req.query.voice) {
      res.send("not enough post data");
      return;
    }
    item = new Title();
    item.voice = req.query.voice;
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
