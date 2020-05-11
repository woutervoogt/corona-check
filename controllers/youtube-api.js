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
    maxResults: 50,
    type: "video",
    regionCode: "US",
    order: "viewCount",
    q: "Covid 19",
    // videoCategoryId: "News & Politics",     returns bad request api response
  });
  const apiData = res.data;
  refreshData(apiData);
}

function refreshData(apiData) {
  YTData.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      saveToDatabase(apiData);
    }
  });
}

function saveToDatabase(data) {
  for (let i = 0; i < data.items.length; i++) {
    const videoData = data.items[i];
    const newYTData = {
      videoId: videoData.id.videoId,
      videoTitle: videoData.snippet.title,
      videoDescription: videoData.snippet.description,
      channelId: videoData.snippet.channelId,
      channelTitle: videoData.snippet.channelTitle,
    };
    YTData.create(newYTData, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      }
    });
  }
}

if (module === require.main) {
  youtubeAPI().catch(console.error);
}

module.exports = youtubeAPI;
