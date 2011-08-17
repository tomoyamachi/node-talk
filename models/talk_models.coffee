mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/talk_db'

user_scheme = new mongoose.Schema(
  name:String
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
# item.name = "Username"
# item.save (e) -> console.log 'add user: ' + JSON.stringify(item)
# title = new Title()
# title.voice = "Article title"
# title.created_at = new Date
# title.user_id = item.id
# title.save (e) -> console.log 'add title: ' + JSON.stringify(title)

# User.find {},(err,users)->
#   console.log u.name for u in users


# Title.find {},(err,titles)->
#   console.log "title user is " + t.user_id for t in titles
