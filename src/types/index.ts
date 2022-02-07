import View from "../core/view";

export type NewsStore = {
  setFeeds: (feeds: NewsFeeds) => NewsFeeds;
  setIsRead: (id: number) => void;
  currentPage: number;
  prevPage: number;
  nextPage: number;
  feeds: NewsFeeds;
  isRead: IsRead;
};

export type News = {
  readonly id: number;
  readonly user: string;
  readonly time_ago: string;
  readonly comments_count: number;
};

export type NewsFeed = News & {
  readonly title: string;
  readonly points: number;
};

export type NewsDetail = News & {
  readonly points: number;
  readonly title: string;
  readonly content: string;
  readonly comments: NewsComment[];
};

export type NewsComment = News & {
  readonly level: number;
  readonly content: string;
  readonly comments: NewsComment[];
};

export type NewsFeeds = {
  [key: number]: NewsFeed;
  length?: number;
};

export type IsRead = {
  [key: number]: boolean;
};

export type RouteInfo = {
  path: string;
  page: View;
};
