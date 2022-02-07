import { NewsDetail, NewsFeed } from "../types";

export class Api {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  protected getRequest<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    fetch(this.url)
      .then((res) => res.json())
      .then(cb)
      .catch(() => {
        throw new Error(
          "지금 해커뉴스가 API를 제공하고 있는 서버에 문제가 생긴 것 같아요 😥"
        );
      });
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(cb: (data: NewsFeed[]) => void): void {
    return this.getRequest<NewsFeed[]>(cb);
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(cb: (data: NewsDetail) => void): void {
    return this.getRequest<NewsDetail>(cb);
  }
}
