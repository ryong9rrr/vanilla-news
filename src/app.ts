import { scrollToTop } from "./utils";
import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";
import Store from "./store";

const store = new Store();

//window.addEventListener("DOMContentLoaded", router);
document.getElementById("go-top")?.addEventListener("click", scrollToTop);

const router: Router = new Router();
const newsFeedView: NewsFeedView = new NewsFeedView("root", store);
const newsDetailView: NewsDetailView = new NewsDetailView("root", store);

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);
router.go();
