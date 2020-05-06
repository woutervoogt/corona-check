const mongoose = require("mongoose")

const YtDataSchema = new mongoose.Schema({
   videoTitle: String,
   videoId: String,
   channelTitle: String,
   channelId: String,
});

module.exports = mongoose.model("YtData", YtDataSchema);