import { NewsDetailApi } from "../core/api";
import View from "../core/view";
import { NewsComment, NewsDetail, NewsStore } from "../types";
import { randomUserImg } from "../utils";

const template: string = `
        <div>
          <nav class="px-6 pt-6">
            <a href=#/page/{{__current_page__}}>
              <span id="go-back" class="rounded-lg border-2 p-2 text-lg shadow-md transition-colors duration-500 hover:bg-red-100">
                ◀ Back
              </span>
            </a>
          </nav>
          <section class="p-6">
            <h1 class="text-4xl mb-3">{{__title__}}</h1>
            <h3 class="mb-1 text-right">👋 {{__user__}}</h3>
            <h3 class="mb-1 text-right">❤ {{__points__}}</h3>
            <h3 class="mb-1 text-right">🕥 {{__time_age__}}</h3>
            <div class="mb-6">
              <h2 class="text-3xl mb-6">Content</h2>
                {{__content__}}
            </div>
            <div>
              <div class="mb-6 pb-3 border-b-2 border-slate-600 flex justify-between">
                <strong>Comments</strong>
                <span class="text-right">🗨 {{__comments_count__}}</span>
              </div>
              <div>
                {{__comments__}}
              </div>
            </div>
          </section>
        </div>
      `;

export default class NewsDetailView extends View {
  private api: NewsDetailApi;
  private store: NewsStore;

  constructor(containerId: string, store: NewsStore) {
    super(containerId, template);
    this.api = new NewsDetailApi();
    this.store = store;
  }

  private makeComment(comments: NewsComment[], depth: number = 0): string {
    for (const comment of comments) {
      this.addHtml(`
        <div style="padding-left:${depth * 10}px" class="text-sm">
          <div class="flex justify-between items-center text-base p-1 bg-green-100">
            <h3>${comment.level > 0 ? "▶" : ""} ${randomUserImg()}
              <strong>${comment.user}</strong>
              <span class="text-sm text-gray-600">${comment.time_ago}</span>
            </h3>
            <h3>🗨 ${comment.comments_count}</h3>
          </div>
          <div class="w-full box-border p-3">
            ${comment.content}
          </div>
          <div class="w-full box-border">
            ${this.makeComment(comment.comments, depth + 1)}
          </div>
        </div>
        `);
    }
    return this.getHtml().replace(/<pre>|<\/pre>|<code>|<\/code>/g, "\n");
  }

  render(): void {
    const id: string = location.hash.slice(7);
    const newsContent: NewsDetail = this.api.getData(Number(id));
    this.store.setIsRead(Number(id));
    this.setTemplateData(
      "{{__comments__}}",
      newsContent.comments.length > 0
        ? this.makeComment(newsContent.comments)
        : "No comments yet... Leave the first comment!"
    );
    this.setTemplateData(
      "{{__current_page__}}",
      String(this.store.currentPage)
    );
    this.setTemplateData("{{__title__}}", newsContent.title);
    this.setTemplateData("{{__user__}}", newsContent.user);
    this.setTemplateData("{{__points__}}", String(newsContent.points));
    this.setTemplateData("{{__time_age__}}", newsContent.time_ago);
    this.setTemplateData(
      "{{__content__}}",
      newsContent.content.length === 0
        ? "🙊 oh, content is empty..."
        : newsContent.content
    );
    this.setTemplateData(
      "{{__comments_count__}}",
      String(newsContent.comments_count)
    );

    this.updateView();
    return;
  }
}
