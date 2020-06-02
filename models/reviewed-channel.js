const mongoose = require("mongoose");

const ReviewedChannelSchema = new mongoose.Schema(
  {
    videoTitle: String,
    videoId: String,
    videoDescription: String,
    viewCount: Number,
    channelTitle: String,
    channelId: String,

    score: String,
    explanation: String,
    publish: Boolean,

    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReviewedChannel", ReviewedChannelSchema);
