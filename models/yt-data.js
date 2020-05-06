const mongoose = require("mongoose")

const YtDataSchema = new mongoose.Schema({
   videoTitle: String,
   videoId: String,
   channelTitle: String,
   channelId: String,
   
   
   projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScrProject"
   }],
   comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
   }]
});

module.exports = mongoose.model("YtData", YtDataSchema);