const root = document.getElementById("root");
const NEWS_URL = "https://api.hnpwa.com/v0/news/@paging.json";
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

function newsFeed() {
  const paging = Math.floor((store.currentPage - 1) / 3) + 1;
  const newsFeedData = getData(NEWS_URL.replace("@paging", paging));

  const makePagination = () => {
    // 1 2 3 ... 9 10 을 만들어내는 함수
    const makePageNumbers = () => {
      const pageList = [];
      const start = Math.floor((store.currentPage - 1) / 10) * 10 + 1;
      for (let i = start; i < start + 10; i++) {
        if (i === store.currentPage) {
          pageList.push(
            `<li><a href="#/page/${i}"><strong>${i}</strong></a></li>`
          );
        } else {
          pageList.push(`<li><a href="#/page/${i}">${i}</a></li>`);
        }
      }
      return pageList.join("");
    };

    let template = `
      <nav>
        <a href="#">처음 페이지</a>
        <a href="#/page/{{__prev_page__}}">이전 페이지</a>
        <ul>
          {{_pagination_}}
        </ul>
        <a href="#/page/{{__next_page__}}">다음 페이지</a>
        <a href="#/page/30">마지막 페이지</a>
      </nav>
    `;

    let updatedTemplate = template;

    updatedTemplate = updatedTemplate.replace(
      "{{_pagination_}}",
      makePageNumbers()
    );

    updatedTemplate = updatedTemplate.replace(
      "{{__prev_page__}}",
      store.currentPage === 1 ? 1 : store.currentPage - 1
    );

    updatedTemplate = updatedTemplate.replace(
      "{{__next_page__}}",
      store.currentPage === 30 ? 30 : store.currentPage + 1
    );

    return updatedTemplate;
  };

  const makeFeed = () => {
    const newsList = [];
    const table = [20, 0, 10];
    const start = table[store.currentPage % 3];
    for (let i = start; i < start + 10; i++) {
      newsList.push(`
        <article>
          <div>
           <span><a href="#/show/${newsFeedData[i].id}">${newsFeedData[i].title}</a></span>
           <span>유저 : ${newsFeedData[i].user}</span>
          </div>
          <div>
            <span>💬${newsFeedData[i].comments_count}</span>
            <span>❤${newsFeedData[i].points}</span>
            <span>🕗${newsFeedData[i].time_ago}</span>
          </div>
        </article>`);
    }
    return newsList.join("");
  };

  let template = `
    <div>
      <h1>📰 vanilla News</h1>
      <section>
        {{__news_feed__}}        
      </section>
      <div>
        {{__pagination__}}
      </div>
    </div>
  `;

  let updatedTemplate = template;

  updatedTemplate = updatedTemplate.replace("{{__news_feed__}}", makeFeed());

  updatedTemplate = updatedTemplate.replace(
    "{{__pagination__}}",
    makePagination()
  );

  return (root.innerHTML = updatedTemplate);
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

  return (root.innerHTML = template);
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
