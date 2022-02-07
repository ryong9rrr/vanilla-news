import Component from "../core/component";
import { NewsStore } from "../types";

const template = `
      <nav class="flex justify-center box-border">
        <div class="flex">
          <a class="{{__style_pointer_1__}} mr-4" href="#">first</a>
          <a class="{{__style_pointer_1__}}" href="#/page/{{__prev_page__}}">prev</a>
          <ul id="pagination-list" class="flex">
            {{__page_list__}}
          </ul>
          <a class="{{__style_pointer_30__}}" href="#/page/{{__next_page__}}">next</a>
          <a class="{{__style_pointer_30__}} ml-4" href="#/page/30">last</a>
        </div>
      </nav>`;

export default class Pagination extends Component {
  private readonly startPage: number;

  constructor(store: NewsStore) {
    super(template, store);
    this.startPage = Math.floor((this.store.currentPage - 1) / 10) * 10 + 1;
  }

  private style_pointer(page: number): string {
    return this.store.currentPage === page
      ? "cursor-no-drop"
      : "hover:font-semibold";
  }

  private makeComponent(): string {
    for (let i = this.startPage; i < this.startPage + 10; i++) {
      const s_li = `<li id="current-page" class="mx-2 hover:font-semibold"><a href="#/page/${i}"><strong>${i}</strong></a></li>`;
      const li = `<li class="mx-2 hover:font-semibold"><a href="#/page/${i}">${i}</a></li>`;

      i === this.store.currentPage ? this.addHtml(s_li) : this.addHtml(li);
    }

    return this.getHtml();
  }

  // 화살표 함수는 this를 렉시컬 컨텍스트 환경에서 바인딩한다.
  component = (): string => {
    this.setTemplateData(/{{__style_pointer_1__}}/g, this.style_pointer(1));
    this.setTemplateData(/{{__style_pointer_30__}}/g, this.style_pointer(30));
    this.setTemplateData("{{__prev_page__}}", String(this.store.prevPage));
    this.setTemplateData("{{__next_page__}}", String(this.store.nextPage));
    this.setTemplateData("{{__page_list__}}", this.makeComponent());

    return this.renderTemplate;
  };
}
