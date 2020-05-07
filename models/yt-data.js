const mongoose = require("mongoose");

const YTDataSchema = new mongoose.Schema({
  requestPending: {
    type: Boolean,
    default: false,
  },
  videoTitle: String,
  videoId: String,
  videoDescription: String,
  channelTitle: String,
  channelId: String,
});

module.exports = mongoose.model("YTData", YTDataSchema);
