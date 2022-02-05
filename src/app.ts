//utils
const scrollToTop = (): Window | any => window.scrollTo(0, 0);

const randomUserImg = (): string => {
  const n: number = Math.floor(Math.random() * 10);
  return n % 2 ? "🙋‍♂️" : "🙋";
};

type News = {
  readonly id: number;
  readonly user: string;
  readonly time_ago: string;
  readonly comments_count: number;
};

type NewsFeed = News & {
  readonly title: string;
  readonly points: number;
};

type NewsDetail = News & {
  readonly points: number;
  readonly title: string;
  readonly content: string;
  readonly comments: NewsComment[];
};

type NewsComment = News & {
  readonly level: number;
  readonly content: string;
  readonly comments: NewsComment[];
};

type NewsFeeds = {
  [key: number]: NewsFeed;
  length?: number;
};

type IsRead = {
  [key: number]: boolean;
};

type Store = {
  currentPage: number;
  feeds: NewsFeeds;
  isRead: IsRead;
};

type RouteInfo = {
  path: string;
  page: View;
};

const NEWS_URL = "https://api.hnpwa.com/v0/news/@paging.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;
const store: Store = {
  currentPage: 1,
  feeds: {},
  isRead: {},
};

function applyApiMixins(targetClasses: any, baseClasses: any[]): void {
  baseClasses.forEach((baseClass) => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseClass.prototype,
        name
      );
      if (descriptor) {
        Object.defineProperty(targetClasses.prototype, name, descriptor);
      }
    });
  });
}

class Api {
  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();
    if (ajax.readyState !== 4 || ajax.status !== 200) {
      throw new Error(
        "지금 해커뉴스가 API를 제공하고 있는 서버에 문제가 생긴 것 같아요 😥"
      );
    }
    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi {
  getData(paging: number): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(
      NEWS_URL.replace("@paging", String(paging))
    );
  }
}

class NewsDetailApi {
  getData(id: number): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace("@id", String(id)));
  }
}

//mix-in
interface NewsFeedApi extends Api {}
interface NewsDetailApi extends Api {}
applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

abstract class Component {
  protected renderTemplate: string;
  protected htmlList: string[];

  constructor(template: string) {
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected clearHtmlList(): void {
    this.htmlList = [];
    return;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
    return;
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  protected style_pointer(page: number): string {
    return store.currentPage === page
      ? "cursor-no-drop"
      : "hover:font-semibold";
  }

  protected setTemplateData(
    key: string | RegExp,
    value: string,
    prev: string = this.renderTemplate
  ): void {
    this.renderTemplate = prev.replace(key, value);
    return;
  }

  abstract component(): string;
}

class Pagination extends Component {
  private readonly startPage: number;

  constructor() {
    const template = `
    <nav class="flex justify-center box-border">
      <div class="flex">
        <a class="{{__style_pointer_1__}} mr-4" href="#">first</a>
        <a class="{{__style_pointer_1__}}" href="#/page/{{__prev_page__}}">prev</a>
        <ul id="pagination-list" class="flex">
          {{__page_list__}}
        </ul>
        <a class="{{__style_pointer_30__}}" href="#/page/{{__next_page__}}">next</a>
        <a class="{{__style_pointer_30__}} ml-4" href="#/page/30">last</a>
      </div>
    </nav>`;
    super(template);
    this.startPage = Math.floor((store.currentPage - 1) / 10) * 10 + 1;
  }

  private makeComponent(): string {
    for (let i = this.startPage; i < this.startPage + 10; i++) {
      const s_li = `<li id="current-page" class="mx-2 hover:font-semibold"><a href="#/page/${i}"><strong>${i}</strong></a></li>`;
      const li = `<li class="mx-2 hover:font-semibold"><a href="#/page/${i}">${i}</a></li>`;

      i === store.currentPage ? this.addHtml(s_li) : this.addHtml(li);
    }

    return this.getHtml();
  }

  component(): string {
    this.setTemplateData(/{{__style_pointer_1__}}/g, this.style_pointer(1));
    this.setTemplateData(/{{__style_pointer_30__}}/g, this.style_pointer(30));
    this.setTemplateData(
      "{{__prev_page__}}",
      String(store.currentPage === 1 ? 1 : store.currentPage - 1)
    );
    this.setTemplateData(
      "{{__next_page__}}",
      String(store.currentPage === 30 ? 30 : store.currentPage + 1)
    );
    this.setTemplateData("{{__page_list__}}", this.makeComponent());

    return this.renderTemplate;
  }
}

abstract class View {
  private readonly $container: HTMLElement;
  private readonly mainTemplate: string;
  private readonly template: string;
  private renderTemplate: string;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const mainTemplate = `
      <main class="bg-gray-100 max-w-screen-md mx-auto box-border">
        {{__view__}}
      </main>
    `;

    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
      throw "최상위 컨테이너가 없어 UI를 진행하지 못합니다.";
    }

    this.$container = containerElement;
    this.mainTemplate = mainTemplate;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected clearHtmlList(): void {
    this.htmlList = [];
    return;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
    return;
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  protected setTemplateData(
    key: string | RegExp,
    value: string,
    prev: string = this.renderTemplate
  ): void {
    this.renderTemplate = prev.replace(key, value);
    return;
  }

  protected scrollToTop(): Window | any {
    return window.scrollTo(0, 0);
  }

  protected randomUserImg(): string {
    const n: number = Math.floor(Math.random() * 10);
    return n % 2 ? "🙋‍♂️" : "🙋";
  }

  protected updateView(): void {
    this.scrollToTop();
    this.setTemplateData(
      "{{__view__}}",
      this.renderTemplate,
      this.mainTemplate
    );
    this.$container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
    return;
  }
  // render 함수 안에 updateView 구현할 것
  abstract render(): void;
}

class NewsFeedView extends View {
  private isRead: IsRead;
  private api: NewsFeedApi;
  private feeds: NewsFeeds;

  constructor(containerId: string) {
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
    super(containerId, template);
    this.api = new NewsFeedApi();
    this.isRead = store.isRead;
    this.feeds = store.feeds;
    if (this.feeds.length === 0) {
      this.getFeeds();
    }
  }

  private getFeeds(): void {
    const paging: number = Math.floor((store.currentPage - 1) / 3) + 1;
    const newData: NewsFeed[] = this.api.getData(paging);
    const feeds: NewsFeeds = {};
    let i = 0;
    for (let idx = (paging - 1) * 30; idx < paging * 30; idx++) {
      feeds[idx] = newData[i++];
    }
    this.feeds = store.feeds = { ...store.feeds, ...feeds };
  }

  private makeFeed(): string {
    if (!this.feeds[(store.currentPage - 1) * 10]) {
      this.getFeeds();
    }

    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
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

  render(): void {
    store.currentPage = Number(location.hash.slice(7)) || 1;
    const pagination = new Pagination();
    this.setTemplateData("{{__news_feed__}}", this.makeFeed());
    this.setTemplateData("{{__pagination__}}", pagination.component());
    this.updateView();
    return;
  }
}

class NewsDetailView extends View {
  private api: NewsDetailApi;
  constructor(containerId: string) {
    const template: string = `
      <div>
        <nav class="px-6 pt-6">
          <a href=#/page/{{__current_page__}}>
            <span id="go-back" class="rounded-lg border-2 p-2 text-lg shadow-md transition-colors duration-500 hover:bg-red-100">
              ◀ Back
            </span>
          </a>
        </nav>
        <section class="p-6">
          <h1 class="text-4xl mb-3">{{__title__}}</h1>
          <h3 class="mb-1 text-right">👋 {{__user__}}</h3>
          <h3 class="mb-1 text-right">❤ {{__points__}}</h3>
          <h3 class="mb-1 text-right">🕥 {{__time_age__}}</h3>
          <div class="mb-6">
            <h2 class="text-3xl mb-6">Content</h2>
              {{__content__}}
          </div>
          <div>
            <div class="mb-6 pb-3 border-b-2 border-slate-600 flex justify-between">
              <strong>Comments</strong>
              <span class="text-right">🗨 {{__comments_count__}}</span>
            </div>
            <div>
              {{__comments__}}
            </div>
          </div>
        </section>
      </div>
    `;
    super(containerId, template);
    this.api = new NewsDetailApi();
  }

  private makeComment(comments: NewsComment[], depth: number = 0): string {
    for (const comment of comments) {
      this.addHtml(`
      <div style="padding-left:${depth * 10}px" class="text-sm">
        <div class="flex justify-between items-center text-base p-1 bg-green-100">
          <h3>${comment.level > 0 ? "▶" : ""} ${this.randomUserImg()}
            <strong>${comment.user}</strong>
            <span class="text-sm text-gray-600">${comment.time_ago}</span>
          </h3>
          <h3>🗨 ${comment.comments_count}</h3>
        </div>
        <div class="w-full box-border p-3">
          ${comment.content}
        </div>
        <div class="w-full box-border">
          ${this.makeComment(comment.comments, depth + 1)}
        </div>
      </div>
      `);
    }
    return this.getHtml().replace(/<pre>|<\/pre>|<code>|<\/code>/g, "\n");
  }

  render(): void {
    const id: string = location.hash.slice(7);
    const newsContent: NewsDetail = this.api.getData(Number(id));
    store.isRead[Number(id)] = true;
    this.setTemplateData(
      "{{__comments__}}",
      newsContent.comments.length > 0
        ? this.makeComment(newsContent.comments)
        : "No comments yet... Leave the first comment!"
    );
    this.setTemplateData("{{__current_page__}}", String(store.currentPage));
    this.setTemplateData("{{__title__}}", newsContent.title);
    this.setTemplateData("{{__user__}}", newsContent.user);
    this.setTemplateData("{{__points__}}", String(newsContent.points));
    this.setTemplateData("{{__time_age__}}", newsContent.time_ago);
    this.setTemplateData(
      "{{__content__}}",
      newsContent.content.length === 0
        ? "🙊 oh, content is empty..."
        : newsContent.content
    );
    this.setTemplateData(
      "{{__comments_count__}}",
      String(newsContent.comments_count)
    );

    this.updateView();
    return;
  }
}

class Router {
  private routeTable: RouteInfo[];
  private defaultRoute: RouteInfo | null;

  constructor() {
    window.addEventListener("hashchange", this.route.bind(this));

    this.routeTable = [];
    this.defaultRoute = null;
  }

  setDefaultPage(page: View) {
    this.defaultRoute = { path: "", page };
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page });
  }

  route() {
    const routePath: string = location.hash;

    if (routePath === "" && this.defaultRoute) {
      return this.defaultRoute.page.render();
    }

    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render();
        break;
      }
    }
  }
}

//window.addEventListener("DOMContentLoaded", router);
document.getElementById("go-top")?.addEventListener("click", scrollToTop);

const router: Router = new Router();
const newsFeedView: NewsFeedView = new NewsFeedView("root");
const newsDetailView: NewsDetailView = new NewsDetailView("root");

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);
router.route();
