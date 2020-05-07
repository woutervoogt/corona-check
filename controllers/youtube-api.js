const YTData = require("../models/yt-data");

// ... Youtube API ...
const { google } = require("googleapis");

// initialize the Youtube API library
const youtube = google.youtube({
  version: "v3",
  auth: process.env.APIKEY,
});

// Get search list from youtube
async function youtubeAPI() {
  const res = await youtube.search.list({
    part: "id,snippet",
    maxResults: 10,
    type: "video",
    regionCode: "US",
    order: "viewCount",
    q: "Covid 19",
    // videoCategoryId: "News & Politics",     returns bad request api response
  });

  for (let i = 0; i < res.data.items.length; i++) {
    const videoData = res.data.items[i];
    videoId = videoData.id.videoId;
    videoTitle = videoData.snippet.title;
    videoDescription = videoData.snippet.description;
    channelId = videoData.snippet.channelId;
    channelTitle = videoData.snippet.channelTitle;
    const newYTData = {
      videoId: videoId,
      videoTitle: videoTitle,
      videoDescription: videoDescription,
      channelId: channelId,
      channelTitle: channelTitle,
    };
    YTData.create(newYTData, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      }
    });
  }
  return res.data;
}

if (module === require.main) {
  youtubeAPI().catch(console.error);
}

module.exports = youtubeAPI;
