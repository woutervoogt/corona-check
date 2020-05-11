const mongoose = require("mongoose");

const YTSearchDataSchema = new mongoose.Schema({
  videoTitle: String,
  videoId: String,
  videoDescription: String,
  channelTitle: String,
  channelId: String,
});

module.exports = mongoose.model("YTSearchData", YTSearchDataSchema);
