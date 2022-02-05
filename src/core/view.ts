import { scrollToTop } from "../utils";

const mainTemplate = `
        <main class="bg-gray-100 max-w-screen-md mx-auto box-border">
          {{__view__}}
        </main>
      `;

export default abstract class View {
  private readonly $container: HTMLElement;
  private readonly mainTemplate: string;
  private readonly template: string;
  private renderTemplate: string;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
      throw "최상위 컨테이너가 없어 UI를 진행하지 못합니다.";
    }

    this.$container = containerElement;
    this.mainTemplate = mainTemplate;
    this.template = template;
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

  protected setTemplateData(
    key: string | RegExp,
    value: string,
    prev: string = this.renderTemplate
  ): void {
    this.renderTemplate = prev.replace(key, value);
    return;
  }

  protected updateView(): void {
    scrollToTop();
    this.setTemplateData(
      "{{__view__}}",
      this.renderTemplate,
      this.mainTemplate
    );
    this.$container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
    return;
  }
  // render 함수 안에 updateView 구현할 것
  abstract render(): void;
}
