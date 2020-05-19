const YTData = require("../models/yt-data");

// ... Youtube API ...
const { google } = require("googleapis");

// initialize the Youtube API library
const youtube = google.youtube({
  version: "v3",
  auth: process.env.APIKEY,
});

let youtubeAPI = {};

// Get search list from youtube
youtubeAPI.searchList = async function () {
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
  return refreshDataBase(apiData);
};

async function refreshDataBase(apiData) {
  await YTData.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      return saveToDatabase(apiData);
    }
  });
}

async function saveToDatabase(data) {
  for (let i = 0; i < data.items.length; i++) {
    const videoData = data.items[i];
    const newYTData = {
      videoId: videoData.id.videoId,
      videoTitle: videoData.snippet.title,
      // videoDescription: videoData.snippet.description,
      channelId: videoData.snippet.channelId,
      channelTitle: videoData.snippet.channelTitle,
    };
    await YTData.create(newYTData, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        return newlyCreated;
      }
    });
  }
}

youtubeAPI.videoInfo = async function () {
  YTData.find({}, async function (err, foundData) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundData.length);
      for (let i = 0; i < foundData.length; i++) {
        const res = await youtube.videos.list({
          part: "snippet,statistics",
          id: foundData[i].videoId,
        });
        foundData[i].videoDescription = res.data.items[0].snippet.description;
        foundData[i].viewCount = res.data.items[0].statistics.viewCount;
        foundData[i].save(function (err) {
          if (err) {
            console.log(err);
          }
        });
        console.log(foundData[i].videoDescription);
      }
    }
  });
};

if (module === require.main) {
  youtubeAPI().catch(console.error);
}

module.exports = youtubeAPI;
