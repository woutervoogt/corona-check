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
    // videoCategoryId: "News & Politics",
  });
  return res.data;
}

if (module === require.main) {
  youtubeAPI().catch(console.error);
}

module.exports = youtubeAPI;
