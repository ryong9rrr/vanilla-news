const $ = (selector) => document.querySelector(selector);
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;
const ajax = new XMLHttpRequest();
let unit = 10;
let page = 1;

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);

const render = (view) => {
  $("#root").innerHTML = view();
};

const newFeedView = () => {
  const liList = [];
  for (let i = 0; i < unit; i++) {
    liList.push(
      `<li><a href="#${newsFeed[i].id}">${newsFeed[i].title}(좋아요:${newsFeed[i].points} / 댓글:${newsFeed[i].comments_count})</a></li>`
    );
  }
  return `<ul>${liList.join("")}</ul>`;
};

$("#select").addEventListener("change", (e) => {
  console.log(e.target.id);
  const selectedUnit = Number(
    $("#select").options[$("#select").selectedIndex].value
  );
  unit = selectedUnit;
  render(newFeedView);
});

window.addEventListener("hashchange", (e) => {
  const id = location.hash.slice(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  const template = () => `
    <div>
      <span><a href=/>홈으로</a></span>    
      <section>
        <h1>${newsContent.title}</h1>
        <div>좋아요 : ${newsContent.points}</div>
        <div>댓글 수 : ${newsContent.comments_count}</div>
      </section>
    </div>
  `;

  render(template);
});

render(newFeedView);
