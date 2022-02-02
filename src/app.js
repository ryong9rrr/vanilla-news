import { makeRandomUser, scrollToTop } from "./js/utils.js";
const store = {
  currentPage: 1,
  feeds: {},
  isRead: {},
};

class App {
  constructor(root) {
    this.$root = document.getElementById(root);
  }

  _getData = (url) => {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();
    if (ajax.readyState !== 4 || ajax.status !== 200) {
      throw new Error(
        "지금 해커뉴스가 API를 제공하고 있는 서버에 문제가 생긴 것 같아요 😥"
      );
    }
    return JSON.parse(ajax.response);
  };

  #render = (view) => {
    let template = `
    <main class="bg-gray-100 max-w-screen-md mx-auto box-border">
      {{__view__}}
    </main>
  `;

    const updatedTemplate = template.replace("{{__view__}}", view);
    scrollToTop();
    return (this.$root.innerHTML = updatedTemplate);
  };

  #router = () => {
    try {
      const routePath = location.hash;

      if (routePath === "") {
        store.currentPage = 1;
        const { newsFeed } = new NewsFeed();
        return this.#render(newsFeed());
      } else if (routePath.indexOf("#/page/") >= 0) {
        store.currentPage = Number(routePath.slice(7));
        const { newsFeed } = new NewsFeed();
        return this.#render(newsFeed());
      } else {
        const { newsDetail } = new NewsDetail();
        return this.#render(newsDetail);
      }
    } catch (e) {
      return this.#render(e);
    }
  };

  run = () => {
    window.addEventListener("hashchange", this.#router);
    window.addEventListener("DOMContentLoaded", this.#router);
    document.getElementById("go-top").addEventListener("click", scrollToTop);
  };
}

class Pagination {
  #makePageList = () => {
    const pageList = [];
    const start = Math.floor((store.currentPage - 1) / 10) * 10 + 1;
    for (let i = start; i < start + 10; i++) {
      if (i === store.currentPage) {
        pageList.push(
          `<li id="current-page" class="mx-2 hover:font-semibold"><a href="#/page/${i}"><strong>${i}</strong></a></li>`
        );
      } else {
        pageList.push(
          `<li class="mx-2 hover:font-semibold"><a href="#/page/${i}">${i}</a></li>`
        );
      }
    }
    return pageList.join("");
  };

  #CSS_pointer = (n) => {
    return store.currentPage === n ? "cursor-no-drop" : "hover:font-semibold";
  };

  pagination = () => {
    let template = `
      <nav class="flex justify-center box-border">
        <div class="flex">
          <a class="${this.#CSS_pointer(1)} mr-4" href="#">first</a>
          <a class="${this.#CSS_pointer(
            1
          )}" href="#/page/{{__prev_page__}}">prev</a>
          <ul id="pagination-list" class="flex">
            {{__page_list__}}
          </ul>
          <a class="${this.#CSS_pointer(
            30
          )}" href="#/page/{{__next_page__}}">next</a>
          <a class="${this.#CSS_pointer(30)} ml-4" href="#/page/30">last</a>
        </div>
      </nav>
    `;

    let updatedTemplate = template;

    updatedTemplate = updatedTemplate.replace(
      "{{__prev_page__}}",
      store.currentPage === 1 ? 1 : store.currentPage - 1
    );

    updatedTemplate = updatedTemplate.replace(
      "{{__next_page__}}",
      store.currentPage === 30 ? 30 : store.currentPage + 1
    );

    updatedTemplate = updatedTemplate.replace(
      "{{__page_list__}}",
      this.#makePageList()
    );

    return updatedTemplate;
  };
}

class NewsFeed extends App {
  constructor() {
    super();
    this.url = "https://api.hnpwa.com/v0/news/@paging.json";
    this.paging = Math.floor((store.currentPage - 1) / 3) + 1;
    this.newsFeedData = store.feeds;
    if (
      store.feeds.length === 0 ||
      !store.feeds[(store.currentPage - 1) * 10]
    ) {
      const data = this.#makeFeeds(
        this._getData(this.url.replace("@paging", this.paging)),
        this.paging
      );
      this.newsFeedData = store.feeds = { ...store.feeds, ...data };
    }
  }

  #makeFeeds = (obj, paging) => {
    const feeds = {};
    let i = 0;
    for (let id = (paging - 1) * 30; id < paging * 30; id++) {
      feeds[id] = obj[i++];
    }
    return feeds;
  };

  #makeFeed = () => {
    const newsList = [];
    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
      i++
    ) {
      newsList.push(`
        <a href="#/show/${this.newsFeedData[i].id}">  
          <article class="${
            store.isRead[this.newsFeedData[i].id]
              ? "bg-gray-400"
              : "bg-gray-100 transition-colors duration-500 hover:bg-green-100"
          } mb-3 flex p-4 rounded-lg shadow-md">
              <div class="w-10/12">
              <h2 class="font-mono mb-2 text-2xl">${
                this.newsFeedData[i].title
              }</h2>
              <h3 class="mb-1">👋 ${this.newsFeedData[i].user}</h3>
              <h3 class="text-sm">🕗 ${this.newsFeedData[i].time_ago}</h3>
              </div>
              <div class="flex justify-center items-center w-2/12">
                <div>
                  <h3 class="text-left mb-3">❤ ${
                    this.newsFeedData[i].points
                  }</h3>
                  <h3 class="text-left">🗨 ${
                    this.newsFeedData[i].comments_count
                  }</h3>
                </div>
              </div>
          </article>
        </a>`);
    }
    return newsList.join("");
  };

  newsFeed = () => {
    let template = `
    <div>
      <header class="bg-green-100 p-3 flex justify-between">
        <h1 class="text-4xl p-3">📰 Vanilla News</h1>
        <div>&copy;Hacker news API</div>
      </header>
      <div class="bg-pink-100 p-3">
        {{__pagination__}}
      </div>
      <section class="bg-blue-200 p-3">
        {{__news_feed__}}        
      </section>
      <footer class="text-center p-5">
        &copy; ryong9rrr, 용상윤
      </footer>
    </div>
  `;

    let updatedTemplate = template;

    updatedTemplate = updatedTemplate.replace(
      "{{__news_feed__}}",
      this.#makeFeed()
    );

    const { pagination } = new Pagination();

    updatedTemplate = updatedTemplate.replace(
      "{{__pagination__}}",
      pagination()
    );

    return updatedTemplate;
  };
}

class NewsDetail extends App {
  constructor() {
    super();
    this.url = `https://api.hnpwa.com/v0/item/@id.json`;
    this.id = location.hash.slice(7);
    this.newsContent = this._getData(this.url.replace("@id", this.id));
  }

  #makeComment = (comments, depth = 0) => {
    if (comments.length === 0) return;
    const commentsList = comments.map((comment) => {
      const template = `
        <div style="padding-left:${depth * 10}px" class="text-sm">
          <div class="flex justify-between items-center text-base p-1 bg-green-100">
            <h3>${comment.level > 0 ? "▶" : ""} ${makeRandomUser()}
              <strong>${comment.user}</strong>
              <span class="text-sm text-gray-600">${comment.time_ago}</span>
            </h3>
            <h3>🗨 ${comment.comments_count}</h3>
          </div>
          <div class="w-full box-border p-3">
            ${comment.content}
          </div>
          <div class="w-full box-border">
            ${this.#makeComment(comment.comments, depth + 1)}
          </div>
        </div>
      `;

      return template;
    });

    return commentsList
      .join("")
      .replace(/<pre>|<\/pre>|<code>|<\/code>/g, "\n");
  };

  newsDetail = () => {
    let template = `
    <div>
      <nav class="px-6 pt-6">
        <a href=#/page/${store.currentPage}>
          <span id="go-back" class="rounded-lg border-2 p-2 text-lg shadow-md transition-colors duration-500 hover:bg-red-100">◀ Back</span>
        </a>
      </nav>
      <section class="p-6">
        <h1 class="text-4xl mb-3">${this.newsContent.title}</h1>
        <h3 class="mb-1 text-right">👋 ${this.newsContent.user}</h3>
        <h3 class="mb-1 text-right">❤ ${this.newsContent.points}</h3>
        <h3 class="mb-1 text-right">🕥 ${this.newsContent.time_ago}</h3>
        <div class="mb-6">
          <h2 class="text-3xl mb-6">Content</h2>
          ${
            this.newsContent.content.length === 0
              ? "🙊 oh, content is empty..."
              : this.newsContent.content
          }
        </div>
        <div>
          <div class="mb-6 pb-3 border-b-2 border-slate-600 flex justify-between">
            <strong>Comments</strong>
            <span class="text-right">🗨 ${this.newsContent.comments_count}</span>
          </div>
          <div>
            {{__comments__}}
          </div>
        </div>
      </section>
    </div>
  `;

    store.isRead[Number(this.id)] = true;

    let updatedTemplate = template.replace(
      "{{__comments__}}",
      this.newsContent.comments.length > 0
        ? this.#makeComment(this.newsContent.comments)
        : "No comments yet... Leave the first comment!"
    );

    return updatedTemplate;
  };
}

const app = new App("root");
app.run();
