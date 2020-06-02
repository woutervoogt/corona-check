// ---- TICKET INFO SPACE LOGIC ---- //
const ticketInfoVideoDetails = document.querySelector(
  ".ticket_info_video_details"
);
const ticketInfoScore = document.querySelector(".ticket_info_score");
const ticketInfoScoreExplanation = document.querySelector(
  ".ticket_info_score_explanation"
);

const infoSpaceContent = {};

infoSpaceContent.videoDetails = function () {
  ticketInfoScore.classList.add("ticket_info_hidden");
  ticketInfoVideoDetails.classList.remove("ticket_info_hidden");
  ticketInfoScoreExplanation.classList.add("ticket_info_hidden");
};

infoSpaceContent.score = function () {
  ticketInfoScore.classList.remove("ticket_info_hidden");
  ticketInfoVideoDetails.classList.add("ticket_info_hidden");
  ticketInfoScoreExplanation.classList.add("ticket_info_hidden");
};

infoSpaceContent.explanation = function () {
  ticketInfoScoreExplanation.classList.remove("ticket_info_hidden");
  ticketInfoScore.classList.add("ticket_info_hidden");
  ticketInfoVideoDetails.classList.add("ticket_info_hidden");
};

// ---- VIDEO DETAILS LOGIC ---- //
const ticketListItems = document.querySelectorAll(
  ".ticket_list_info_list_item"
);

ticketListItems.forEach((e) => {
  e.addEventListener("click", showInfo);
});

function showInfo() {
  // ticketListItems is een Nodelist. IndexOf werkt alleen op een Array.
  // Nodelist is static, dus mogelijk dat een veranderende lijst problemen oplevert.
  // Mogelijke oplossing/verbetering: let passDataIndex = Array.prototype.indexOf.call(this.parentNode.children,this);
  let ticketlistItemArray = Array.from(ticketListItems);

  let passDataIndex = ticketlistItemArray.indexOf(this);

  document.querySelector(".ticket_info_channel_title > span").innerText =
    passData[passDataIndex].channelTitle;

  document.querySelector(".ticket_info_video_title > span").innerText =
    passData[passDataIndex].videoTitle;

  document.querySelector(".ticket_info_description > span").innerText =
    passData[passDataIndex].videoDescription;

  document.querySelector(".ticket_info_views > span").innerText =
    passData[passDataIndex].viewCount;

  document.querySelector(".ticket_info_button_space > a").href =
    "https://www.youtube.com/watch?v=" + passData[passDataIndex].videoId;

  document.querySelector("#hidden_input").value = passData[passDataIndex]._id;
}
