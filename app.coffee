express = require("express")

app = module.exports = express.createServer()
app.configure ->
  app.register ".haml", require("hamljs")
  app.set "views", __dirname + "/views"
  app.set "view engine", "hamljs"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.compiler(
    src: __dirname + "/public"
    enable: [ "sass" ]
  )
  app.use app.router
  app.use express.static(__dirname + "/public")
mongoModel = require './models/talk_models.js'
db = mongoModel.createConnection 'mongodb://localhost/talk_db'

User = db.model("User")
Title = db.model("Title")
Voice = db.model("Voice")

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()

app.get "/", (req, res) ->
  res.render "index", action: "/login", message: ""


app.get "/main",(req, res)->
  Voice.find().desc('created_at').find (err,voices)->
    res.render "main", action: "/post", voices: voices


app.get "/login", (req, res) ->
  res_error = (mes) ->
    res.render "index", action: "/login", message: mes

  res_success = (mes) ->
    Voice.find().desc('created_at').find (err,voices)->
      res.render "main", action: "/post", voices: voices, message: mes

  email = req.query.email
  password = req.query.password
  create_new = req.query.new
  res_error "not found email"  unless email
  res_error "not found \"password\""  unless password
  user = new User()
  i =
    email:email
    password: password

  if create_new
    User.findOne i, (err,doc)->
      console.log doc
      unless doc?
        user.email = email
        user.password = password
        user.save()
        res_success "you get account."
      else
        res_error "this accout is already gotten"
  else
    User.findOne i, (err,doc)->
      console.log doc
      console.log "findOne method"
      unless doc?
        res_error "UserID or passwrod is different."
      else
        res_success "login success."



app.get '/post', (req, res)->
  if not req.query.voice
    res.send "not enough post data"
    return
  item = new Voice()
  item.contents = req.query.voice
  item.created_at = new Date

  item.save (err) ->
    console.log 'add new post:'+JSON.stringify(item) unless err
  res.redirect("/");


app.listen 3000
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env