# gatsby template
- https://github.com/greglobinski/gatsby-starter-hero-blog

### 수정 사항
- 20210911
  - 메인 페이지 변경
  - 타이틀 및 프로필 이미지 수정
  - favicon 수정
    - favicon 수정은 src/images/app-icons 의 파일들을 수정하고 npm run generate-app-icons
  - 메뉴 추가 및 삭제
    - content/pages 에 추가된 폴더를 기준으로 카테고리를 나열한다.
  - 리스트에서 섬네일 이미지, author 제거
    - post list 쿼리는 src/pages/index.js 에서 IndexQuery 수정
- 20210913
  - gatsby-plugin-styled-jsx gatsby-plugin-styled-jsx-postcss 삭제
    - gatsby-plugin-styled-jsx-postcss 플러그인이 node12 이상에서는 빌드시 무한루프에 빠지는 것 같다.
    - 해결방법은 노드 버전을 낮추거나 해당 플러그인을 안쓰는 방법밖에는 없는듯하다?
  - npm install node-sass gatsby-plugin-sass 모듈 추가
  - gatsby-config.js 정리
    - gatsby-plugin-sass 추가하고, gatsby-plugin-styled-jsx, gatsby-plugin-styled-jsx-postcss 2개는 주석처리
  - theme.yaml 삭제 및 관련 의존성 삭제. style 관리는 styled-jsx 로 하지 않고 전역 scss 에서 관리
  - react-helmet 버전업(콘솔에 경고창 해결)
