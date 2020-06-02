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
  const yTRes = await youtube.search.list({
    part: "id,snippet",
    maxResults: 50,
    type: "video",
    regionCode: "US",
    order: "viewCount",
    q: "Covid 19",
  });

  const apiData = yTRes.data;
  await refreshData(apiData);
};

async function refreshData(apiData) {
  await YTData.deleteMany({}, async function (err) {
    if (err) {
      console.log(err);
    } else {
      await saveToDatabase(apiData);
    }
  });
}

async function saveToDatabase(data) {
  for (let i = 0; i < data.items.length; i++) {
    const videoData = data.items[i];

    const newYTData = {
      videoId: videoData.id.videoId,
      videoTitle: videoData.snippet.title,
      channelId: videoData.snippet.channelId,
      channelTitle: videoData.snippet.channelTitle,
    };

    await YTData.create(newYTData, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        return i;
      }
    });
  }
}

youtubeAPI.videoInfo = async function () {
  var myPromise = new Promise((myresolutionfunction, myrejectionfunction) => {
    YTData.find({}, async function (err, foundData) {
      var myResultlist = [];
      var myCountlist = [];
      let yTIDList = foundData[0].videoId;

      for (let i = 1; i < foundData.length; i++) {
        yTIDList = yTIDList + "," + foundData[i].videoId;
      }

      const yTRes = await youtube.videos.list({
        part: "snippet,statistics",
        id: yTIDList,
      });

      if (err) {
        console.log(err);
      } else {
        for (let i = 0; i < foundData.length; i++) {
          myCountlist.push(i);
          YTData.updateOne(
            { _id: foundData[i]._id },
            {
              videoDescription: yTRes.data.items[i].snippet.description,
              viewCount: yTRes.data.items[i].statistics.viewCount,
            },
            async function (err, updatedFile) {
              if (err) {
                console.log("no update");
              } else {
                return myResultlist.push(updatedFile);
              }
            }
          );
        }
        checkUpdate(0, myResultlist, myCountlist);
      }
    });

    function checkUpdate(a, arrayA, arrayB) {
      setTimeout(function () {
        console.log(arrayB.length);
        if (arrayA.length === arrayB.length) {
          myresolutionfunction(console.log("resolve"));
          return;
        } else if (a > 100) {
          myrejectionfunction(fail(a));
        } else {
          checkUpdate(a + 1, arrayA, arrayB);
        }
      }, 250);
    }
  });
  return myPromise;
};

if (module === require.main) {
  youtubeAPI().catch(console.error);
}

module.exports = youtubeAPI;
