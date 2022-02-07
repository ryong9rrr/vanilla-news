import { NewsDetail, NewsFeed } from "../types";

export class Api {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  protected async request<AjaxResponse>(): Promise<AjaxResponse> {
    try {
      const response = await fetch(this.url);
      return (await response.json()) as AjaxResponse;
    } catch (e) {
      console.error(e);
      throw new Error(
        "지금 해커뉴스가 API를 제공하고 있는 서버에 문제가 생긴 것 같아요 😥"
      );
    }
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  async getData(): Promise<NewsFeed[]> {
    return await this.request<NewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  async getData(): Promise<NewsDetail> {
    return await this.request<NewsDetail>();
  }
}
