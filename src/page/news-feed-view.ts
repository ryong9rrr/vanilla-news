import Pagination from "../components/pagination";
import { NewsFeedApi } from "../core/api";
import View from "../core/view";
import { IsRead, NewsFeed, NewsFeeds, NewsStore } from "../types";

const template = `
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

export default class NewsFeedView extends View {
  private isRead: IsRead;
  private api: NewsFeedApi;
  private feeds: NewsFeeds;
  private store: NewsStore;

  constructor(containerId: string, store: NewsStore) {
    super(containerId, template);
    this.store = store;
    this.api = new NewsFeedApi();
    this.feeds = store.feeds;
    this.isRead = store.isRead;
    if (this.feeds.length === 0) {
      this.getFeeds();
    }
  }

  private getFeeds(): void {
    const paging: number = Math.floor((this.store.currentPage - 1) / 3) + 1;
    const newData: NewsFeed[] = this.api.getData(paging);
    const feeds: NewsFeeds = {};
    let i = 0;
    for (let idx = (paging - 1) * 30; idx < paging * 30; idx++) {
      feeds[idx] = newData[i++];
    }
    this.feeds = this.store.setFeeds(feeds);
  }

  private makeFeed(): string {
    if (!this.feeds[(this.store.currentPage - 1) * 10]) {
      this.getFeeds();
    }

    for (
      let i = (this.store.currentPage - 1) * 10;
      i < this.store.currentPage * 10;
      i++
    ) {
      const { id, title, user, time_ago, points, comments_count } =
        this.feeds[i];
      this.addHtml(`
          <a href="#/show/${id}">  
            <article class="${
              this.isRead[id]
                ? "bg-gray-400"
                : "bg-gray-100 transition-colors duration-500 hover:bg-green-100"
            } mb-3 flex p-4 rounded-lg shadow-md">
                <div class="w-10/12">
                <h2 class="font-mono mb-2 text-2xl">${title}</h2>
                <h3 class="mb-1">👋 ${user}</h3>
                <h3 class="text-sm">🕗 ${time_ago}</h3>
                </div>
                <div class="flex justify-center items-center w-2/12">
                  <div>
                    <h3 class="text-left mb-3">❤ ${points}</h3>
                    <h3 class="text-left">🗨 ${comments_count}</h3>
                  </div>
                </div>
            </article>
          </a>`);
    }
    return this.getHtml();
  }

  // error 날듯
  render(): void {
    this.store.currentPage = Number(location.hash.slice(7)) || 1;
    const pagination: Pagination = new Pagination(this.store);
    this.setTemplateData("{{__news_feed__}}", this.makeFeed());
    this.setTemplateData("{{__pagination__}}", pagination.component());
    this.updateView();
    return;
  }
}
