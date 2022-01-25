const $ = (selector) => document.querySelector(selector);
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;
let unit = 10;
let page = 1;

function getData(url) {
  const ajax = new XMLHttpRequest();
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

const newsFeedData = getData(NEWS_URL);

function render(view, template) {
  const $select = $("#select");
  const page = {
    newsFeed: () => ($select.hidden = false),
    newsDetail: () => ($select.hidden = true),
  };
  page[view]();
  return ($("#root").innerHTML = template);
}

function newsFeed() {
  const newsList = [];
  for (let i = 0; i < unit; i++) {
    newsList.push(`
        <li>
          <a href="#${newsFeedData[i].id}">
            ${newsFeedData[i].title}(좋아요:${newsFeedData[i].points} / 댓글:${newsFeedData[i].comments_count})
          </a>
        </li>`);
  }

  const template = `<ul>${newsList.join("")}</ul>`;
  return render("newsFeed", template);
}

function newsDetail() {
  const id = location.hash.slice(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  const template = `
    <div>
      <span><a href=#>홈으로</a></span>    
      <section>
        <h1>${newsContent.title}</h1>
        <div>좋아요 : ${newsContent.points}</div>
        <div>댓글 수 : ${newsContent.comments_count}</div>
      </section>
    </div>
  `;

  return render("newsDetail", template);
}

function router() {
  const routePath = location.hash;

  if (routePath === "") {
    $("#select").addEventListener("change", (e) => {
      const selectedUnit = Number(
        $("#select").options[$("#select").selectedIndex].value
      );
      unit = selectedUnit;
      return newsFeed();
    });

    return newsFeed();
  } else {
    return newsDetail();
  }
}

window.addEventListener("hashchange", router);

window.addEventListener("DOMContentLoaded", router);
