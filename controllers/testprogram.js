import { resolveInclude } from "ejs";

function updateBeforeLoad(){

    var myArray = [];
    var dataBaseArray = [4,2,3,4,2,1,2,2,3,4,4,5,5,6,6,7,7,8,9];

    var isUpdated = new Promise((myresolutionfunction, myrejectionfunction) => {
        function hello(a){ 
            console.log("hello"+a);
            console.log(myArray.length);
            console.log(dataBaseArray.length);
            setTimeout( function() {

                if (myArray.length === dataBaseArray.length){
                    myresolutionfunction(succes(myArray));
                    return;
                }
                else if(a>100){
                    myrejectionfunction(fail(a));
                }
                else { hello(a+1);}
            }, 250);
        }
        hello(0);
    })

    function getBig(){
        setTimeout( function() {
            if (dataBaseArray.length > myArray.length){
                myArray.push(dataBaseArray[myArray.length]);
                getBig();
            }
            else{return;}

        }, 550);
    }
    getBig();
    return isUpdated;
}


function succes(a){
    console.log("resolved"+a);
}
function fail(a){
    console.log("not resolved"+a);
}

updateBeforeLoad();



async function updateProef(){

    var myPromise = new Promise((myresolutionfunction, myrejectionfunction) => {  

        YTData.find({}, async function (err, foundData) {
            var myResultlist=[];
            var myCountlist = [];
            if (err) {
                console.log(err);
            } 
            else {
                for (let i = 0; i < foundData.length; i++) {
                const yTRes = await youtube.videos.list({
                    part: "snippet,statistics",
                    id: foundData[i].videoId,
                });
                myCountlist.push(i);
                YTData.updateOne({ _id: foundData[i]._id }, { videoDescription: yTRes.data.items[0].snippet.description, viewCount: yTRes.data.items[0].statistics.viewCount}, async function(err,updatedFile){
                    if (err){console.log("no update")}
                    else{
                        return myResultlist.push(updatedFile);
                    }
        
                    
                });
               checkUpdate(0,myResultlist,myCountlist);
                }
            }
        });

        function checkUpdate(a,arrayA,arrayB){
            console.log("hello"+a);
            console.log(arrayA.length);
            console.log(arrayB.length);
            setTimeout( function() {

                if (arrayA.length === arrayB.length){
                    myresolutionfunction(succes(arrayA));
                    return;
                }
                else if(a>100){
                    myrejectionfunction(fail(a));
                }
                else { checkUpdate(a+1, arrayA, arrayB);}
            }, 250);
        }

    })
  
}





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
    const dataRefreshed = await refreshData(apiData);
    return dataRefreshed;
};
  
async function refreshData(apiData) {
    const dataDeleted = await YTData.deleteMany({}, async function (err) {
    if (err) {
        console.log(err);
    } else {
        const isUpdated = await saveToDatabase(apiData);
        return isUpdated;
    }
    });
    return dataDeleted;
}
  
async function saveToDatabase(data){

    var promiseArray = [];

    for (i=0; i<data.items.length; i++){
        
        const videoData = data.items[i];
  
        const newYTData = {
          videoId: videoData.id.videoId,
          videoTitle: videoData.snippet.title,
          channelId: videoData.snippet.channelId,
          channelTitle: videoData.snippet.channelTitle,
        };

        const myLoopPromise = await YTData.create(newYTData, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                return console.log(i);
            }
        });

        promiseArray.push(myLoopPromise);
    }

    Promise.all([promiseArray]).then((values)=>{
        console.log(values);
    });
}