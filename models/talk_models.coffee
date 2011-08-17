mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/talk_db'
mongoTypes = require('mongoose-types')

required = (val) ->
  val and val.length
mongoTypes.loadTypes mongoose, "email"

user_scheme = new mongoose.Schema(
  email:
    type: String#mongoose.SchemaTypes.Email
    validate: [ required, "Email is required" ]
#    index: unique: true

  password:
    type: String
#    validate: [ required, "Password is required" ]
#    match: /[A-Za-z0-9]{12}\$[0-9a-f]{32}/

  created_at:
    type: Date
    default: Date.now
)

title_scheme = new mongoose.Schema(
  created_at:Date,
  voice:String,
  user_id: mongoose.Schema.ObjectId
)

title_scheme.virtual("user").get(->
  this["userobj"]
).set (u) ->
  @set "user_id", u._id

voice_scheme = new mongoose.Schema(
  contents:String
  title_id:mongoose.Schema.ObjectId
  created_at:Date
)
voice_scheme.virtual("title").get(->
  this["titleobj"]
).set (t) ->
  @set "title_id", t._id

User = mongoose.model 'User', user_scheme
Title = mongoose.model 'Title', title_scheme
Voice = mongoose.model 'Voice', voice_scheme

exports.createConnection = (url)->
  mongoose.createConnection(url)

# item = new User()
# item.email = "username"
# item.password = "pass"
# item.save (e) -> console.log 'add user: ' + JSON.stringify(item)
# i =
#   name:"Username"


########findOne method############
# User.findOne i, (err, users) ->
#   console.log users
#   console.log "foundOne"


# title = new Title()
# title.voice = "Article title"
# title.created_at = new Date
# title.user_id = item.id
# title.save (e) -> console.log 'add title: ' + JSON.stringify(title)

# User.find {},(err,users)->
#   console.log u.name for u in users


# Title.find {},(err,titles)->
#   console.log "title user is " + t.user_id for t in titles
