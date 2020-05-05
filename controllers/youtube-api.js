// ... Youtube API ...
const {google} = require("googleapis");

// initialize the Youtube API library
const youtube = google.youtube({
  version: "v3",
  auth: process.env.APIKEY
});

// a very simple example of searching for youtube videos
async function YoutubeAPI() {
  const res = await youtube.search.list({
      part: 'id,snippet',
      maxResults: 10,
      order: "viewCount",
      q: 'Node.js on Google Cloud',
      type: "video"
    });
    let videos = res.data.items;
    return videos;
    // console.log(res.data.items);
    // let videos = res.data.items;
    // return next() 
  }
 
  if (module === require.main) {
    runSample().catch(console.error);
  }


module.exports = YoutubeAPI;