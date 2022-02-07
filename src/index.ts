import { scrollToTop } from "./utils";
import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";
import Store from "./store";
import { NewsStore } from "./types";

class App {
  private readonly $goTopButton: HTMLElement | null;

  constructor() {
    this.$goTopButton = document.getElementById("go-top");
  }

  run = () => {
    this.$goTopButton?.addEventListener("click", scrollToTop);
    const store: NewsStore = new Store();
    const router: Router = new Router();
    const newsFeedView: NewsFeedView = new NewsFeedView("root", store);
    const newsDetailView: NewsDetailView = new NewsDetailView("root", store);

    router.setDefaultPage(newsFeedView);
    router.addRoutePath("/page/", newsFeedView);
    router.addRoutePath("/show/", newsDetailView);
    router.go();
  };
}

const app = new App();

window.addEventListener("DOMContentLoaded", () => app.run());
