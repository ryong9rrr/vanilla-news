import { CONTENT_URL, NEWS_URL } from "../config";
import { NewsDetail, NewsFeed } from "../types";

export class Api {
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

export class NewsFeedApi extends Api {
  getData(paging: number): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(
      NEWS_URL.replace("@paging", String(paging))
    );
  }
}

export class NewsDetailApi extends Api {
  getData(id: number): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace("@id", String(id)));
  }
}
