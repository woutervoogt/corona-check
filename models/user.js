var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  isExpert: {
    type: Boolean,
    default: false,
  },
  //    projects: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "ScrProject"
  //    }],
  //    comments: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Comment"
  //    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
