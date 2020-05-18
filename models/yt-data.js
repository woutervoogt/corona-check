const mongoose = require("mongoose");

const YTSearchDataSchema = new mongoose.Schema(
  {
    videoTitle: String,
    videoId: String,
    videoDescription: String,
    viewCount: Number,
    channelTitle: String,
    channelId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("YTSearchData", YTSearchDataSchema);
