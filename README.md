# Vanilla News App

[해커뉴스 API](https://github.com/tastejs/hacker-news-pwas/blob/master/docs/api.md)를 활용한 간단한 뉴스 앱

</br>

<img />

👋 [프로젝트 링크](https://ryong9rrr.github.io/projects/news-app/)

<table>
    <thead>
        <tr>
            <th colspan="2" style="text-align: center">
                🛠 Skills & Tools
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center">Language</td>
            <td>Vanilla JS | TypeScript</td>
        </tr>
        <tr>
            <td style="text-align: center">Style</td>
            <td>Tailwind CSS</td>
        </tr>
        <tr>
            <td style="text-align: center">Test</td>
            <td>Cypress</td>
        </tr>
        <tr>
            <td style="text-align: center">Data</td>
            <td><a href="https://github.com/tastejs/hacker-news-pwas/blob/master/docs/api.md">해커뉴스 API</a></td>
        </tr>
        <tr>
            <td style="text-align: center">keywords</td>
            <td>Vanilla JS | Tailwind CSS | TDD | 상태 관리</br> AJAX | 동기-비동기 | 문자열 템플릿 | TS Migration</td>
        </tr>
    </tbody>
</table>

</br>

## ❓ 이 프로젝트의 목적

✔ 바닐라 자바스크립트에 좀 더 익숙해지기 위해

✔ Tailwind CSS를 사용해보기 위해

✔ ajax를 사용해보기 위해

✔ 상태관리 연습을 위해

✔ TDD 연습을 위해

✔ 리팩터링 연습을 위해

✔ 타입스크립트 연습을 위해

</br>

# 🎯 요구사항

◻ 해커뉴스 API를 사용합니다.

◻ DOM을 직접 조작하지 않고, 문자열 템플릿을 이용해봅니다.

◻ tailwind CSS를 사용해봅니다.

</br>

## 🎨 UI

✔ 앱은 총 2가지 화면을 가지고 있습니다.

- 뉴스 피드
- 뉴스 정보

✔ 메인화면은 위에서 아래로 `title - pagination - 뉴스 피드`로 구성됩니다.

✔ 뉴스 피드는 10개씩 나열합니다.

✔ 뉴스 피드 리스트에 제목, 좋아요 수, 댓글 수는 필수적으로 나타냅니다.

</br>

## 🛠 기능 - 공통

✔ 화면 우측 하단에는 페이지 맨 위로 갈 수 있는 버튼이 항상 존재합니다.

</br>

## 🛠 기능 - pagination

✔ 왼쪽페이지, 오른쪽페이지로 페이지 넘김을 할 수 있습니다.

✔ 첫 페이지, 마지막 페이지로 이동할 수 있습니다.

✔ 현재 보고 있는 페이지는 글씨를 굵게 하는 등 UI/UX를 고려합니다.

✔ "마지막 페이지"에서 "페이지 넘김"을 하는 경우 pagination이 넘어갑니다.

- ex) 3페이지를 보고 있다가 오른쪽 페이지 넘김을 하는 경우

  < 1 2 **3** 4 5 6 7 8 9 10 > 👉 < 1 2 3 **4** 5 6 7 8 9 10 >

- ex) 10페이지를 보고 있다가 오른쪽 페이지 넘김을 하는 경우

  < 1 2 3 4 5 6 7 8 9 **10** > 👉 < **11** 12 13 14 15 16 17 18 19 20 >

✔ 만약 현재 pagination이 첫번째라면 왼쪽 페이지 넘김을 할 수 없고, 마지막 pagination이라면 오른쪽 페이지 넘김을 할 수 없습니다. 이것에 대한 UI/UX를 고려합니다.

</br>

## 🛠 기능 - 뉴스 피드

✔ 클릭하면 해당 뉴스에 대한 자세한 뉴스를 볼 수 있습니다.

✔ 어떤 뉴스를 보고 메인화면으로 돌아갔을 때, 이미 본 뉴스라면 사용자가 이미 봤던 뉴스라고 인식할 수 있도록 합니다.

✔ 어떤 뉴스를 보고 메인화면으로 돌아갔을 때, 이전 페이지 정보를 기억합니다. (만약 2페이지에서 뉴스를 보고 다시 메인화면으로 돌아갔다면 2페이지로 돌아와야 합니다.)

</br>

## 🛠 기능 - 뉴스 정보

✔ 상단에 뒤로가기 버튼이 있으며, 뒤로가기 버튼을 누르면 메인화면으로 돌아갑니다.

✔ 자세한 뉴스 정보는 제목, 본문, 모든 댓글, 댓글의 모든 대댓글을 보여줍니다.

✔ 데이터가 빈 값일 경우를 고려합니다.

✔ 대댓글에는 "깊이"가 있어 어떤 댓글의 대댓글인지 직관적으로 알 수 있어야 합니다.

</br>

# 과정

<table>
    <thead>
        <tr>
            <th colspan="2" style="text-align: center">
                생각하고 정리하기
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center">🤔</td>
            <td><a href="https://www.notion.so/ryong9rrr/78ab69ee94ee464aae5d934987eb38cf">기능 요구 사항에 따른 전략과 복기</a></td>
        </tr>
        <tr>
            <td style="text-align: center">⚠</td>
            <td><a href="https://www.notion.so/ryong9rrr/aebcd33b8a1f4125bdaf25bd4bf02611">이슈</a></td>
        </tr>
        <tr>
            <td style="text-align: center">🛠</td>
            <td><a href="https://www.notion.so/ryong9rrr/Test-8b3a88cabcc046acb3ca8ab631ecfb02">Test & 리팩터링</a></td>
        </tr>
        <tr>
            <td style="text-align: center">💡</td>
            <td><a href="https://www.notion.so/ryong9rrr/cb6b75e224724d9f8e5d147adae9536c">회고</a></td>
        </tr>
    </tbody>
</table>
