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
