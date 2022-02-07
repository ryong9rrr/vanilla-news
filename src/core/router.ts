import { RouteInfo } from "../types";
import View from "./view";

export default class Router {
  private routeTable: RouteInfo[];
  private defaultRoute: RouteInfo | null;

  constructor() {
    window.addEventListener("hashchange", this.go.bind(this));

    this.routeTable = [];
    this.defaultRoute = null;
  }

  setDefaultPage(page: View) {
    this.defaultRoute = { path: "", page };
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page });
  }

  go() {
    const routePath: string = location.hash;

    if (routePath === "" && this.defaultRoute) {
      this.defaultRoute.page.render();
      return;
    }

    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render();
        break;
      }
    }
  }
}
