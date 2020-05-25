const ticketListItems = document.querySelectorAll(
  ".ticket_list_info_list_item"
);

ticketListItems.forEach((e) => {
  e.addEventListener("click", showInfo);
});

function showInfo() {
  document.querySelector(
    ".ticket_info_channel_title > span"
  ).innerText = this.querySelector(".ticket_list_item_channel").innerText;

  document.querySelector(
    ".ticket_info_video_title > span"
  ).innerText = this.querySelector(".ticket_list_item_video").innerText;

  document.querySelector(
    ".ticket_info_description > span"
  ).innerText = this.querySelector(".ticket_list_item_description").innerText;

  document.querySelector(
    ".ticket_info_views > span"
  ).innerText = this.querySelector(".ticket_list_item_views").innerText;
}
