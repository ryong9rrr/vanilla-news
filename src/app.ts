import { Store } from "./types";
import { scrollToTop } from "./utils";
import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";

const store: Store = {
  currentPage: 1,
  feeds: {},
  isRead: {},
};

declare global {
  interface Window {
    store: Store;
  }
}

window.store = store;

//window.addEventListener("DOMContentLoaded", router);
document.getElementById("go-top")?.addEventListener("click", scrollToTop);

const router: Router = new Router();
const newsFeedView: NewsFeedView = new NewsFeedView("root");
const newsDetailView: NewsDetailView = new NewsDetailView("root");

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);
router.route();
