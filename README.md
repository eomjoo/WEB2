# TMDB 기반 영화 웹사이트

React와 TMDB API를 사용하여 영화 정보를 제공하는 웹사이트입니다. 사용자들은 최신 영화, 인기 영화, 장르별 영화 정보를 탐색할 수 있으며, 개인 위시리스트 기능을 통해 관심 있는 영화를 관리할 수 있습니다.

## 프로젝트 기본 정보

이 프로젝트는 TMDB API를 활용하여 영화 데이터를 제공하는 React기반의 영화 정보 웹사이트입니다. 사용자는 다양한 카테고리의 영화 정보를 탐색하고, 검색 기능을 통해 원하는 영화를 찾고, 위시리스트에 영화를 추가할 수 있습니다.

프로젝트 이름: WEB2

## 기술 스택

-프론트엔드 프레임워크: React.js -스타일링: CSS3 -아이콘: Font Awesome
-API: TMDB API -라우팅: React Router -상태 관리: React Context API
-Axios: TMDB API와의 통신을 위한 HTTP 클라이언트

## 설치 및 실행 가이드

### 프로젝트 클론

```
$ git clone https://github.com/eomjoo/WEB2.git
```

### 필수 패키지 설치

```
npm install
```

### 로컬 서버 실행

```
npm run dev
```

### 배포 환경 파일 생성

```
npm run build
```

## API

TMDB API를 사용하여 영화 데이터를 가져왔습니다

API 키 값 = 20e3e13b63bc683a69913dacd892a80a

## 소개

배너 페이지가 일정 시간마다 넘어가집니다
포스터에 포인터를 가져다 대면 평점, 장르를 확인할 수 있습니다
메인 페이지에서 현재 상영작, 인기영화, 최신영화, 액션영화, 공포영화, 코미디, 로맨스, SF, 다큐멘터리 영화를 장르별로 확인할 수 있습니다
영화를 클릭하여 위시리스트에 저장할 수 있습니다

## 프로젝트 구조 설명

프로젝트 폴더 구조는 다음과 같습니다.

```
├── public/
│   └── index.html         # HTML 템플릿
├── src/                   # 프로젝트 소스 코드
│   ├── components/        # 재사용 가능한 React 컴포넌트
│   │   ├── Banner/        # 배너 관련 컴포넌트
│   │   ├── Header/        # 헤더 컴포넌트
│   │   ├── Main/          # 메인 화면 컴포넌트
│   │   ├── MovieGrid/     # 영화 그리드 컴포넌트
│   │   ├── MovieInfiniteScroll/  # 무한 스크롤 컴포넌트
│   │   ├── MovieRow/      # 영화 행 컴포넌트
│   │   ├── Popular/       # 인기 영화 컴포넌트
│   │   ├── Search/        # 영화 검색 컴포넌트
│   │   ├── SignIn/        # 로그인 화면 컴포넌트
│   │   ├── Wishlist/      # 위시리스트 컴포넌트
│   ├── hooks/             # 커스텀 훅 모음
│   │   └── useAuth.ts     # 인증 관련 훅
│   ├── models/            # 데이터 모델 정의
│   │   └── types.ts       # 타입스크립트 타입 정의 파일
│   ├── util/              # 유틸리티 함수 및 API 호출 관련 코드
│   │   ├── auth/          # 인증 관련 유틸리티
│   │   │   └── auth.service.ts  # 인증 서비스 로직
│   │   ├── movie/         # 영화 관련 유틸리티
│   │   │   └── URL.ts     # TMDB API URL 관리
│   ├── styles/            # CSS 및 스타일 관련 파일
│   ├── App.tsx            # 루트 컴포넌트
│   ├── main.tsx           # 애플리케이션 엔트리 포인트
│   └── index.css          # 글로벌 스타일 시트

```
