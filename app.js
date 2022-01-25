const $ = (selector) => document.querySelector(selector);
const NEWS_URL = "https://api.hnpwa.com/v0/news/@pagination.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;
const store = {
  currentPage: 1,
};

function getData(url) {
  const ajax = new XMLHttpRequest();
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

const pageListTemplate = () => {
  const pageList = [`<nav><ul class="nav">`];
  const start = Math.floor((store.currentPage - 1) / 10) * 10 + 1;
  for (let i = start; i < start + 10; i++) {
    if (i === store.currentPage) {
      pageList.push(`<li class="current"><a href="#/page/${i}">${i}</a></li>`);
    } else {
      pageList.push(`<li><a href="#/page/${i}">${i}</a></li>`);
    }
  }
  pageList.push(`</ul></nav>`);

  const template = pageList.join("");

  return template;
};

function newsFeed() {
  const pagination = Math.floor((store.currentPage - 1) / 3) + 1;
  const newsFeedData = getData(NEWS_URL.replace("@pagination", pagination));
  const newsList = [];
  const table = [20, 0, 10];
  const start = table[store.currentPage % 3];
  for (let i = start; i < start + 10; i++) {
    newsList.push(`
        <li>
          <a href="#/show/${newsFeedData[i].id}">
            ${newsFeedData[i].title}(좋아요:${newsFeedData[i].points} / 댓글:${newsFeedData[i].comments_count})
          </a>
        </li>`);
  }

  const template = `
    <h1><a href="#">홈으로</a></h1>
    <ul>${newsList.join("")}</ul>
    <div>
      <a href="#">⏪</a>
      <a href="#/page/${
        store.currentPage === 1 ? 1 : store.currentPage - 1
      }">◀</a>
      ${pageListTemplate()}
      <a href="#/page/${
        store.currentPage === 30 ? 30 : store.currentPage + 1
      }">▶</a>
      <a href="#/page/30">⏩</a>
    </div>
  `;
  return ($("#root").innerHTML = template);
}

function newsDetail() {
  const id = location.hash.slice(7);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  const template = `
    <div>
      <span><a href=#/page/${store.currentPage}>이전</a></span>    
      <section>
        <h1>${newsContent.title}</h1>
        <div>좋아요 : ${newsContent.points}</div>
        <div>댓글 수 : ${newsContent.comments_count}</div>
      </section>
    </div>
  `;

  return ($("#root").innerHTML = template);
}

function router() {
  const routePath = location.hash;

  if (routePath === "") {
    store.currentPage = 1;
    return newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.slice(7));
    return newsFeed();
  } else {
    return newsDetail();
  }
}

window.addEventListener("hashchange", router);

window.addEventListener("DOMContentLoaded", router);
