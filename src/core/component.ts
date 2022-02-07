import { NewsStore } from "../types";

export default abstract class Component {
  protected renderTemplate: string;
  protected htmlList: string[];
  protected store: NewsStore;

  constructor(template: string, store: NewsStore) {
    this.renderTemplate = template;
    this.htmlList = [];
    this.store = store;
  }

  protected clearHtmlList(): void {
    this.htmlList = [];
    return;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
    return;
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  protected setTemplateData(
    key: string | RegExp,
    value: string,
    prev: string = this.renderTemplate
  ): void {
    this.renderTemplate = prev.replace(key, value);
    return;
  }

  abstract component(): string;
}
