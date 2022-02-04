// start: ./node_modules/.bin/cypress open
const BASE_URL = "http://localhost:1234/";
const NEWS_URL = (paging) => `https://api.hnpwa.com/v0/news/${paging}.json`;
const CONTENT_URL = (id) => `https://api.hnpwa.com/v0/item/${id}.json`;

const checkPagination = (firstString, lastString) => {
  cy.get("#pagination-list li").should("have.length", 10);
  cy.get("#pagination-list li").first().contains(firstString);
  cy.get("#pagination-list li").last().contains(lastString);
  //cy.get("#pagination-list li").first().should("have.text", firstString);
  //cy.get("#pagination-list li").last().should("have.text", lastString);
};

const checkHash = (hashString) => {
  cy.hash().should("eq", hashString);
};

const checkRequest = (api) => {
  cy.request(api).should((response) => {
    // status 200 인지
    expect(response.status).to.eq(200);
    //expect(response.body).to.have.property("length");
    expect(response).to.have.property("headers");
    expect(response).to.have.property("duration");
  });
};

const clickedButton = (btnString) => {
  cy.get("nav").contains(btnString).click();
};

describe("뉴스 앱 테스트", () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });
  });

  it("처음 시작은 첫 페이지이다.", () => {
    cy.hash().should("be.empty");
  });

  context("Request test", () => {
    it("1.json 데이터가 잘 불러와지는지 확인", () => {
      checkRequest(NEWS_URL(1));
    });
  });

  context("pagination test 1", () => {
    it("1페이지 pagination은 1 ~ 10 이어야 한다.", () => {
      checkPagination("1", "10");
    });

    it("next 버튼을 누르면 #/page/2 로 가야한다.", () => {
      clickedButton("next");
      checkHash("#/page/2");
    });

    it("10페이지를 클릭", () => {
      // 1. 10페이지로 가진다.
      clickedButton("10");
      checkHash("#/page/10");
      // 2. 이때 pagination은 1 ~ 10이다.
      checkPagination("1", "10");
      // 3. next 버튼을 눌렀을 때 #/page/11로 가진다.
      clickedButton("next");
      checkHash("#/page/11");
      // 4. pagination은 11 ~ 20이 된다.
      checkPagination("11", "20");
    });

    it("last 버튼 클릭", () => {
      // 1. #/page/30 으로 가진다.
      clickedButton("last");
      checkHash("#/page/30");
      // 2. 이때 pagination은 21 ~ 30이다.
      checkPagination("21", "30");
    });
  });

  context("pagination test 2", () => {
    it("1페이지에서 first 버튼을 눌러도 첫 페이지여야 한다.", () => {
      clickedButton("first");
      checkHash("#");
    });

    it("1페이지에서 prev 버튼을 눌러도 첫 페이지여야 한다.", () => {
      clickedButton("prev");
      checkHash("#/page/1");
    });

    it("마지막 페이지에서 next 버튼을 눌러도 마지막 페이지여야 한다.", () => {
      clickedButton("last");
      checkHash("#/page/30");
      clickedButton("next");
      checkHash("#/page/30");
    });

    it("마지막 페이지에서 last 버튼을 눌러도 마지막 페이지여야 한다.", () => {
      clickedButton("last");
      checkHash("#/page/30");
      clickedButton("last");
      checkHash("#/page/30");
    });
  });

  context("data fetch test", () => {
    it("1페이지에서, 1.json[0]과 첫번째 article이 일치하는지 확인", () => {
      cy.get("article").first().click();
      cy.request(NEWS_URL(1))
        .then((response) => {
          const data = Cypress._.chain(response.body).first().value();
          return data;
        })
        .then((data) => {
          const { id, title } = data;
          checkHash(`#/show/${id}`);
          cy.get("h1").should("have.text", title);
        });
    });

    it("10페이지에서, 4.json[0]과 첫번째 article이 일치하는지 확인", () => {
      clickedButton(10);
      cy.get("article").first().click();
      cy.request(NEWS_URL(4))
        .then((response) => {
          const data = Cypress._.chain(response.body).first().value();
          return data;
        })
        .then((data) => {
          const id = data.id;
          checkHash(`#/show/${id}`);
        });
    });

    it("마지막 페이지에서, 10.json[29]과 마지막 article이 일치하는지 확인", () => {
      clickedButton("last");
      cy.get("article").last().click();
      cy.request(NEWS_URL(10))
        .then((response) => {
          const data = Cypress._.chain(response.body).last().value();
          return data;
        })
        .then((data) => {
          const id = data.id;
          checkHash(`#/show/${id}`);
        });
    });
  });

  context("UI와 상태관리 test", () => {
    it("현재 페이지는 굵게 표시되어야 한다.", () => {
      cy.get("#current-page").contains("1");
      clickedButton(5);
      cy.get("#current-page").contains("5");
    });

    it("1페이지 맨 위 데이터를 클릭하고 뒤로 가기를 눌렀을 때, '읽음' 확인", () => {
      cy.get("article").first().should("have.class", "bg-gray-100");
      cy.get("article").first().click();
      cy.get("#go-back").click();
      cy.get("article").first().should("have.class", "bg-gray-400");
    });

    it("10페이지 맨 위 데이터를 클릭하고 뒤로 가기를 눌렀을 때, '읽음' 확인", () => {
      clickedButton(10);
      cy.get("article").first().should("have.class", "bg-gray-100");
      cy.get("article").first().click();
      cy.get("#go-back").click();
      cy.get("article").first().should("have.class", "bg-gray-400");
    });
  });

  context("스크롤 test", () => {
    it("뉴스 정보에 들어갔을 때 스크롤이 맨 위에 위치하는지 확인", () => {
      //clickedButton("last");
      cy.get("article").last().click();
      cy.window().its("scrollY").should("eq", 0);
    });

    it("우측 하단 top 버튼 테스트", () => {
      cy.scrollTo("bottom");
      cy.get("#go-top").click();
      cy.window().its("scrollY").should("eq", 0);
    });
  });
});
