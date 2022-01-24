const root = document.getElementById("root");
const ajax = new XMLHttpRequest();
const NEWS_API = "https://api.hnpwa.com/v0/news/1.json";

ajax.open("GET", NEWS_API, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const newsList = [];
newsList.push("<ul>");
for (let i = 0; i < newsFeed.length; i++) {
  newsList.push(`<li>${newsFeed[i].title}</li>`);
}
newsList.push("</ul>");

//root.innerHTML = newsList.join("");
