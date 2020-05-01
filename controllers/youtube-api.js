// ... Youtube API ...
const {google} = require("googleapis");

// initialize the Youtube API library
const youtube = google.youtube({
  version: "v3",
  auth: process.env.APIKEY
});

// a very simple example of searching for youtube videos
async function runSample() {
  
  const res = await youtube.search.list({
      part: 'id,snippet',
      maxResults: 10,
      order: "viewCount",
      q: 'Node.js on Google Cloud',
      type: "video"
    });
    console.log(res.data.items[0]);
  }
  
  if (module === require.main) {
    runSample().catch(console.error);
  }

module.exports = runSample;