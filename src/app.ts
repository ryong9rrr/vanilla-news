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

const $container: HTMLElement | null = document.getElementById("root");
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

//store에 data를 추가시켜주는 함수
function setStoreFeeds(objs: NewsFeed[], paging: number): NewsFeeds {
  const feeds: NewsFeeds = {};
  let i = 0;
  for (let idx = (paging - 1) * 30; idx < paging * 30; idx++) {
    feeds[idx] = objs[i++];
  }
  return feeds;
}

const scrollToTop = (): Window | any => window.scrollTo(0, 0);

const randomUserImg = (): string => {
  const n: number = Math.floor(Math.random() * 10);
  return n % 2 ? "🙋‍♂️" : "🙋";
};

function render(view: string): void {
  let template: string = `
    <main class="bg-gray-100 max-w-screen-md mx-auto box-border">
      {{__view__}}
    </main>
  `;

  const updatedTemplate: string = template.replace("{{__view__}}", view);
  scrollToTop();

  if ($container) {
    $container.innerHTML = updatedTemplate;
    return;
  } else {
    console.error("최상위 컨테이너가 없어 UI를 진행하지 못합니다.");
    return;
  }
}

const pagination = (): string => {
  const template: string = `
    <nav class="flex justify-center box-border">
      <div class="flex">
        <a class="{{__pagination_pointer_1__}} mr-4" href="#">first</a>
        <a class="{{__pagination_pointer_1__}}" href="#/page/{{__prev_page__}}">prev</a>
        <ul id="pagination-list" class="flex">
          {{__page_list__}}
        </ul>
        <a class="{{__pagination_pointer_30__}}" href="#/page/{{__next_page__}}">next</a>
        <a class="{{__pagination_pointer_30__}} ml-4" href="#/page/30">last</a>
      </div>
    </nav>
  `;

  const pagination_pointer = (page: number): string => {
    return store.currentPage === page
      ? "cursor-no-drop"
      : "hover:font-semibold";
  };

  // 1 2 3 ... 9 10 을 만들어내는 함수
  const makeList = (): string => {
    const template = `
      <li {{__id_current__}} class="mx-2 hover:font-semibold">
        <a href="#/page/{{__number__}}">
          {{__bold_number__}}
        </a>
      </li>`;
    const isCurrent = (i: number) => {
      return i === store.currentPage ? `id="current-page"` : "";
    };

    const isBold = (i: number) => {
      return i === store.currentPage ? `<strong>${i}</strong>` : `${i}`;
    };

    const pageList: string[] = [];
    const start: number = Math.floor((store.currentPage - 1) / 10) * 10 + 1;
    for (let i = start; i < start + 10; i++) {
      let updatedTemplate = template;
      updatedTemplate = updatedTemplate.replace("{{__number__}}", String(i));
      updatedTemplate = updatedTemplate.replace(
        "{{__id_current__}}",
        isCurrent(i)
      );
      updatedTemplate = updatedTemplate.replace(
        "{{__bold_number__}}",
        isBold(i)
      );
      pageList.push(updatedTemplate);
    }
    return pageList.join("");
  };

  let updatedTemplate: string = template;

  updatedTemplate = updatedTemplate.replace(
    /{{__pagination_pointer_1__}}/g,
    pagination_pointer(1)
  );
  updatedTemplate = updatedTemplate.replace(
    /{{__pagination_pointer_30__}}/g,
    pagination_pointer(30)
  );

  updatedTemplate = updatedTemplate.replace(
    "{{__prev_page__}}",
    String(store.currentPage === 1 ? 1 : store.currentPage - 1)
  );

  updatedTemplate = updatedTemplate.replace(
    "{{__next_page__}}",
    String(store.currentPage === 30 ? 30 : store.currentPage + 1)
  );

  updatedTemplate = updatedTemplate.replace("{{__page_list__}}", makeList());

  return updatedTemplate;
};

function newsFeed(): void {
  let template: string = `
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
  const paging: number = Math.floor((store.currentPage - 1) / 3) + 1;
  let newsFeedData: NewsFeeds = store.feeds;
  if (store.feeds.length === 0 || !store.feeds[(store.currentPage - 1) * 10]) {
    const api = new NewsFeedApi();
    const data: NewsFeeds = setStoreFeeds(api.getData(paging), paging);
    newsFeedData = store.feeds = { ...store.feeds, ...data };
  }

  const makeFeed = (): string => {
    const newsList: string[] = [];
    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
      i++
    ) {
      const newsFeed: NewsFeed = newsFeedData[i];
      newsList.push(`
        <a href="#/show/${newsFeed.id}">  
          <article class="${
            store.isRead[newsFeed.id]
              ? "bg-gray-400"
              : "bg-gray-100 transition-colors duration-500 hover:bg-green-100"
          } mb-3 flex p-4 rounded-lg shadow-md">
              <div class="w-10/12">
              <h2 class="font-mono mb-2 text-2xl">${newsFeed.title}</h2>
              <h3 class="mb-1">👋 ${newsFeed.user}</h3>
              <h3 class="text-sm">🕗 ${newsFeed.time_ago}</h3>
              </div>
              <div class="flex justify-center items-center w-2/12">
                <div>
                  <h3 class="text-left mb-3">❤ ${newsFeed.points}</h3>
                  <h3 class="text-left">🗨 ${newsFeed.comments_count}</h3>
                </div>
              </div>
          </article>
        </a>`);
    }
    return newsList.join("");
  };
  let updatedTemplate: string = template;
  updatedTemplate = updatedTemplate.replace("{{__news_feed__}}", makeFeed());
  updatedTemplate = updatedTemplate.replace("{{__pagination__}}", pagination());
  return render(updatedTemplate);
}

function makeComment(comments: NewsComment[], depth: number = 0): string {
  const commentsList: string[] = comments.map(
    (comment: NewsComment): string => {
      const template: string = `
      <div style="padding-left:${depth * 10}px" class="text-sm">
        <div class="flex justify-between items-center text-base p-1 bg-green-100">
          <h3>${comment.level > 0 ? "▶" : ""} ${randomUserImg()}
            <strong>${comment.user}</strong>
            <span class="text-sm text-gray-600">${comment.time_ago}</span>
          </h3>
          <h3>🗨 ${comment.comments_count}</h3>
        </div>
        <div class="w-full box-border p-3">
          ${comment.content}
        </div>
        <div class="w-full box-border">
          ${makeComment(comment.comments, depth + 1)}
        </div>
      </div>
    `;
      return template;
    }
  );
  const updatedTemplate: string = commentsList
    .join("")
    .replace(/<pre>|<\/pre>|<code>|<\/code>/g, "\n");
  return updatedTemplate;
}

function newsDetail(): void {
  const id: string = location.hash.slice(7);
  const api = new NewsDetailApi();
  const newsContent: NewsDetail = api.getData(Number(id));
  let template: string = `
    <div>
      <nav class="px-6 pt-6">
        <a href=#/page/${store.currentPage}>
          <span id="go-back" class="rounded-lg border-2 p-2 text-lg shadow-md transition-colors duration-500 hover:bg-red-100">
            ◀ Back
          </span>
        </a>
      </nav>
      <section class="p-6">
        <h1 class="text-4xl mb-3">${newsContent.title}</h1>
        <h3 class="mb-1 text-right">👋 ${newsContent.user}</h3>
        <h3 class="mb-1 text-right">❤ ${newsContent.points}</h3>
        <h3 class="mb-1 text-right">🕥 ${newsContent.time_ago}</h3>
        <div class="mb-6">
          <h2 class="text-3xl mb-6">Content</h2>
          ${
            newsContent.content.length === 0
              ? "🙊 oh, content is empty..."
              : newsContent.content
          }
        </div>
        <div>
          <div class="mb-6 pb-3 border-b-2 border-slate-600 flex justify-between">
            <strong>Comments</strong>
            <span class="text-right">🗨 ${newsContent.comments_count}</span>
          </div>
          <div>
            {{__comments__}}
          </div>
        </div>
      </section>
    </div>
  `;

  store.isRead[Number(id)] = true;
  let updatedTemplate: string = template.replace(
    "{{__comments__}}",
    newsContent.comments.length > 0
      ? makeComment(newsContent.comments)
      : "No comments yet... Leave the first comment!"
  );
  return render(updatedTemplate);
}

function router(): void {
  try {
    const routePath: string = location.hash;
    if (routePath === "") {
      store.currentPage = 1;
      return newsFeed();
    } else if (routePath.indexOf("#/page/") >= 0) {
      store.currentPage = Number(routePath.slice(7));
      return newsFeed();
    } else {
      return newsDetail();
    }
  } catch (e: any) {
    return render(e);
  }
}

class App {
  goTopButton: HTMLElement | null;

  constructor() {
    this.goTopButton = document.getElementById("go-top");
  }
  run = (): void => {
    window.addEventListener("hashchange", router);
    window.addEventListener("DOMContentLoaded", router);
    this.goTopButton?.addEventListener("click", scrollToTop);
  };
}

const app = new App();
app.run();
