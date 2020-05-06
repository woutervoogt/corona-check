// ... Youtube API ...
const {google} = require("googleapis");

// initialize the Youtube API library
const youtube = google.youtube({
  version: "v3",
  auth: process.env.APIKEY
});

// a very simple example of searching for youtube videos
async function youtubeAPI() {
  const res = await youtube.search.list({
      part: 'id,snippet',
      maxResults: 10,
      order: "viewCount",
      q: 'Node.js on Google Cloud',
      type: "video",
    });
    let data = res.data;
    return data;
  }
 
  if (module === require.main) {
    youtubeAPI().catch(console.error);
  }


module.exports = youtubeAPI;