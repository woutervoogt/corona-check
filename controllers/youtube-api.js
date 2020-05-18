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
  await refreshData(apiData);
  // .then(() => true);
};

async function refreshData(apiData) {
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
      // videoDescription: videoData.snippet.description,
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
        console.log(foundData[i]._id);
        YTData.update({ _id: foundData[i]._id }, { videoDescription: "2" });
        // foundData[i].videoDescription = "1";
        // foundData[i].save((err) => {
        //   console.log(err);
        // });
        // console.log(foundData[i].videoDescription);
        // foundData[i].videoDescription = res.data.items[i].snippet.description;
        // foundData[i].viewCount = res.data.items[i].statistics.viewCount;
        // foundData[i].save((err) => {
        //   console.log(err);
        // });
        console.log(foundData[i].videoDescription);
      }
    }
  });
};

if (module === require.main) {
  youtubeAPI().catch(console.error);
}

module.exports = youtubeAPI;
