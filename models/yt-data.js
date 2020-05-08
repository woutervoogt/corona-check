const mongoose = require("mongoose")

const YTDataSchema = new mongoose.Schema({
   videoTitle: String,
   videoId: String,
   channelTitle: String,
   channelId: String,
});

module.exports = mongoose.model("YTData", YTDataSchema);