export default abstract class Component {
  protected renderTemplate: string;
  protected htmlList: string[];

  constructor(template: string) {
    this.renderTemplate = template;
    this.htmlList = [];
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

  protected style_pointer(page: number): string {
    return window.store.currentPage === page
      ? "cursor-no-drop"
      : "hover:font-semibold";
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
