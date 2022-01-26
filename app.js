const NEWS_URL = "https://api.hnpwa.com/v0/news/@paging.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;
const store = {
  currentPage: 1,
};

function render(view) {
  const $root = document.getElementById("root");
  let template = `
    <main class="bg-gray-100 h-screen max-w-screen-md mx-auto">
      {{__view__}}
    </main>
  `;

  let updatedTemplate = template;
  updatedTemplate = updatedTemplate.replace("{{__view__}}", view);

  return ($root.innerHTML = updatedTemplate);
}

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
            `<li class="mx-2 hover:font-semibold"><a href="#/page/${i}"><strong>${i}</strong></a></li>`
          );
        } else {
          pageList.push(
            `<li class="mx-2 hover:font-semibold"><a href="#/page/${i}">${i}</a></li>`
          );
        }
      }
      return pageList.join("");
    };

    const CSS_pointer = (n) => {
      return store.currentPage === n ? "cursor-no-drop" : "hover:font-semibold";
    };

    let template = `
      <nav class="flex justify-between mx-auto w-3/4">
        <a class="${CSS_pointer(1)}" href="#">first</a>
        <a class="${CSS_pointer(1)}" href="#/page/{{__prev_page__}}">prev</a>
        <ul class="flex">
          {{_pagination_}}
        </ul>
        <a class="${CSS_pointer(30)}" href="#/page/{{__next_page__}}">next</a>
        <a class="${CSS_pointer(30)}" href="#/page/30">last</a>
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
        <a href="#/show/${newsFeedData[i].id}">  
          <article class="mb-3 flex p-4 rounded-lg bg-gray-100 shadow-md transition-colors duration-500 hover:bg-green-100">
              <div class="w-10/12">
              <h2 class="font-mono mb-2 text-2xl">${newsFeedData[i].title}</h2>
              <h3 class="mb-1">👋 ${newsFeedData[i].user}</h3>
              <h3 class="text-sm">🕗 ${newsFeedData[i].time_ago}</h3>
              </div>
              <div class="flex justify-center items-center w-2/12">
                <div>
                  <h3 class="text-left mb-3">❤ ${newsFeedData[i].points}</h3>
                  <h3 class="text-left">💬 ${newsFeedData[i].comments_count}</h3>
                </div>
              </div>
          </article>
        </a>`);
    }
    return newsList.join("");
  };

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
      <nav class="px-6 pt-6">
        <a href=#/page/${store.currentPage}>
          <span class="rounded-lg border-2 p-2 text-lg shadow-md transition-colors duration-500 hover:bg-red-100">◀ Back</span>
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
            <span class="text-right">💬 ${newsContent.comments_count}</span>
          </div>
          {{__comments__}}
          ${newsContent.comments}
        </div>
      </section>
    </div>
  `;

  return (root.innerHTML = template);
}

function router() {
  const routePath = location.hash;

  if (routePath === "") {
    store.currentPage = 1;
    return render(newsFeed());
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.slice(7));
    return render(newsFeed());
  } else {
    return render(newsDetail());
  }
}

window.addEventListener("hashchange", router);

window.addEventListener("DOMContentLoaded", router);

document
  .getElementById("go-top")
  .addEventListener("click", () => window.scrollTo(0, 0));
