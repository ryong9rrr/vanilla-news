import { NewsFeeds, IsRead, NewsStore } from "./types";

export default class Store implements NewsStore {
  private _currentPage: number;
  private _feeds: NewsFeeds;
  private _isRead: IsRead;

  constructor() {
    this._currentPage = 1;
    this._feeds = {};
    this._isRead = {};
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number): void {
    if (page <= 0 || page > 30) return;
    this._currentPage = page;
  }

  get prevPage(): number {
    return this._currentPage === 1 ? 1 : this._currentPage - 1;
  }

  get nextPage(): number {
    return this._currentPage === 30 ? 30 : this._currentPage + 1;
  }

  get feeds() {
    return this._feeds;
  }

  get isRead() {
    return this._isRead;
  }

  setFeeds(feeds: NewsFeeds): NewsFeeds {
    this._feeds = { ...this._feeds, ...feeds };
    return this.feeds;
  }

  setIsRead(id: number): void {
    this._isRead[id] = true;
  }
}
