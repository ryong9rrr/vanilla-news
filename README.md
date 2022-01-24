# Vanilla News App

[해커뉴스 API](https://github.com/tastejs/hacker-news-pwas/blob/master/docs/api.md)와 바닐라JS를 사용합니다.

---

<img />

👉 [데모 링크](#)

## ❓ 이 프로젝트의 목적

✔ 바닐라 자바스크립트에 좀 더 익숙해지기 위해

✔ API를 사용해보기 위해

✔ 비동기 상황에 대한 연습을 위해

✔ 상태관리 연습을 위해

✔ TDD 연습을 위해

✔ 리팩터링 연습을 위해

✔ 타입스크립트 연습을 위해

<table>
    <thead>
        <tr>
            <th colspan="2" style="text-align: center">
                생각해보기
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center">🤔</td>
            <td><a href="https://www.notion.so/ryong9rrr/mbti-5fa2a8edb29643c88c11eb58e01c3456">문제 해결 전략</a></td>
        </tr>
        <tr>
            <td style="text-align: center">🛠</td>
            <td><a href="https://www.notion.so/ryong9rrr/mbti-5fa2a8edb29643c88c11eb58e01c3456">리팩터링</a></td>
        </tr>
        <tr>
            <td style="text-align: center">💡</td>
            <td><a href="https://www.notion.so/ryong9rrr/4b402a6cb5e74ba0b4e8572c7f69974d">회고</a></td>
        </tr>
    </tbody>
</table>

---

# 🎉 프로젝트

> 프로젝트를 시작하기 전 기획해봅니다.

## 🎯 요구사항

◻ 앱은 총 2가지 화면을 가지고 있습니다.

- 메인화면
- 자세한 뉴스 정보 화면

◻ 앱을 실행하면 메인화면이 나타납니다.

◻ 메인화면은 위에서 아래로 title - 한번에 보일 뉴스 개수 설정버튼 - 뉴스피드 - pagination으로 구성됩니다.

◻ "한번에 보여지는 뉴스 개수"는 5개, 10개, 15개 3가지를 선택할 수 있고, 디폴트는 10개입니다.

◻ pagination은 왼쪽페이지, 오른쪽페이지로 페이지 넘김을 할 수 있습니다.

◻ pagination에서 현재 보고 있는 페이지는 글씨를 굵게 하는 등 UI/UX를 고려합니다.

◻ "마지막 페이지"에서 "페이지 넘김"을 하는 경우 pagination이 넘어갑니다.

- ex) 3페이지를 보고 있다가 오른쪽 페이지 넘김을 하는 경우

  < 1 2 **3** 4 5 6 7 8 9 10 > 👉 < 1 2 3 **4** 5 6 7 8 9 10 >

- ex) 10페이지를 보고 있다가 오른쪽 페이지 넘김을 하는 경우

  < 1 2 3 4 5 6 7 8 9 **10** > 👉 < **11** 12 13 14 15 16 17 18 19 20 >

◻ 만약 현재 pagination이 첫번째라면 왼쪽 페이지 넘김을 할 수 없고, 마지막 pagination이라면 오른쪽 페이지 넘김을 할 수 없습니다. 이에 따른 UI/UX를 고려합니다.

◻ DOM을 직접 조작하지 않고, 문자열 템플릿을 이용해봅니다.

◻ HTML 레이아웃을 최소화하고 시멘틱 태그를 사용합니다.

## 🎯🎯 메인화면 요구사항

◻ 보이는 뉴스 정보는 제목, 좋아요 수, 댓글 수는 필수적으로 나타냅니다.

◻ 클릭하면 해당 뉴스에 대한 자세한 뉴스를 볼 수 있습니다.

- 어떤 뉴스를 보고 메인화면으로 돌아갔을 때, 이미 본 뉴스라면 사용자가 이미 봤던 뉴스라고 인식할 수 있도록 UI/UX를 고려합니다.

- 어떤 뉴스를 보고 메인화면으로 돌아갔을 때, 이전 페이지 정보를 기억합니다. (만약 2페이지에서 뉴스를 보고 다시 메인화면으로 돌아갔다면 2페이지로 돌아와야 합니다.)

## 🎯🎯 자세한 뉴스 화면 요구사항

◻ 상단에 뒤로가기 버튼이 있으며, 뒤로가기 버튼을 누르면 메인화면으로 돌아갑니다.

◻ 자세한 뉴스 정보는 제목, 본문, 모든 댓글, 댓글의 모든 대댓글을 보여줍니다.

- 대댓글에는 "깊이"가 있어 어떤 댓글의 대댓글인지 직관적으로 알 수 있어야 합니다.

- 댓글이 하나도 없을 상황에 대한 UI/UX를 고려합니다.
