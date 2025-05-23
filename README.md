# StyleChoi Blog - macOS Style GitHub Pages Blog

![macOS Style Blog](https://img.shields.io/badge/Style-macOS-blue.svg)
![GitHub Pages](https://img.shields.io/badge/Powered%20by-GitHub%20Pages-green.svg)
![Markdown](https://img.shields.io/badge/Content-Markdown-orange.svg)

VSCode에서 마크다운으로 글을 작성하고 GitHub에 커밋하면 자동으로 블로그에 반영되는 macOS 스타일 블로그 시스템입니다.

## ✨ 주요 기능

### 🖥️ macOS 네이티브 경험
- **완벽한 macOS UI**: Dock, 메뉴바, 윈도우 시스템
- **부드러운 애니메이션**: 실제 macOS와 동일한 효과
- **드래그 가능한 창**: 실제 앱처럼 창을 이동하고 크기 조절
- **백그라운드 음악**: 컨트롤 센터에서 조절 가능

### ✍️ 강력한 에디터
- **VSCode 스타일**: 익숙한 환경에서 글쓰기
- **실시간 미리보기**: 마크다운 즉시 렌더링
- **자동 저장**: GitHub에 직접 커밋

### 🔄 GitHub 연동
- **실시간 동기화**: GitHub API를 통한 즉시 반영
- **버전 관리**: Git의 모든 장점 활용
- **잔디 채우기**: 꾸준한 포스팅으로 GitHub 활동 증가

## 🚀 빠른 시작

### 1. GitHub Personal Access Token 생성

1. [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) 접속
2. "Generate new token (classic)" 클릭
3. 필요한 권한 선택:
   - `repo` (전체 저장소 접근)
   - `workflow` (GitHub Actions 사용시)
4. 생성된 토큰 복사

### 2. 블로그 설정

1. 웹사이트 접속 후 폴더 클릭
2. "새 포스트 작성" 클릭
3. GitHub 토큰 설정 창에서 토큰 입력
4. 설정 완료!

### 3. 포스트 작성

```markdown
---
title: 포스트 제목
date: 2024-05-23
category: tech # 또는 daily
description: 포스트 설명
---

# 제목

내용을 마크다운으로 작성하세요!

## 소제목

**굵은 글씨** *기울임 글씨*

- 목록 1
- 목록 2

\`\`\`javascript
// 코드 블록
console.log('Hello World!');
\`\`\`
```

## 📁 프로젝트 구조

```
stylechoi.github.io/
├── posts/
│   ├── tech/           # 기술 블로그 포스트
│   └── daily/          # 일상 블로그 포스트
├── css/
│   └── style.css       # 메인 스타일시트
├── js/
│   └── script.js       # 메인 JavaScript
├── image/
│   ├── icons/          # 앱 아이콘들
│   └── ...
├── music/
│   └── sunflower.mp3   # 배경음악
└── index.html          # 메인 페이지
```

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: GitHub REST API v3
- **스타일**: Pure CSS (no frameworks)
- **폰트**: SF Pro (macOS native fonts)
- **아이콘**: Lucide Icons

## 🎨 디자인 특징

### macOS 요소들
- **Dock**: Magnification 효과와 툴팁
- **메뉴바**: 실시간 시계, 배터리, WiFi 표시
- **윈도우**: 실제 macOS 창처럼 동작
- **컨트롤 센터**: 음악 재생, 볼륨/밝기 조절

### 반응형 디자인
- 데스크톱과 모바일 모두 최적화
- Touch-friendly 인터페이스

## 🔧 설정 옵션

### GitHub 설정
`js/script.js`에서 저장소 정보 수정:
```javascript
this.repoOwner = 'stylechoi';  // GitHub 사용자명
this.repoName = 'stylechoi.github.io';  // 저장소명
```

### 카테고리 추가
새로운 카테고리를 추가하려면:
1. `posts/` 폴더에 새 디렉토리 생성
2. HTML에 새 폴더 아이콘 추가
3. JavaScript에서 카테고리 로직 확장

## 📱 키보드 단축키

- `Cmd/Ctrl + Space`: Spotlight 검색
- `Space`: 음악 재생/정지 (컨트롤 센터 열린 상태)
- `Escape`: 모든 창 닫기

## 🌟 고급 기능

### Front Matter 지원
각 포스트는 YAML Front Matter를 지원합니다:
```yaml
---
title: 포스트 제목
date: 2024-05-23
category: tech
description: SEO를 위한 설명
tags: [javascript, github, blog]
author: StyleChoi
---
```

### 자동 파일명 생성
포스트 제목을 기반으로 자동 생성:
- 날짜 접두사: `2024-05-23-`
- URL 친화적 슬러그: 특수문자 제거, 공백을 `-`로 변환
- 예시: `2024-05-23-github-blog-system.md`

### GitHub API 캐싱
- 로컬 저장소 활용으로 API 호출 최소화
- 실시간 동기화와 성능 최적화 균형

## 🔒 보안 및 프라이버시

### Personal Access Token
- **로컬 저장**: 브라우저 localStorage에만 저장
- **전송 없음**: 외부 서버로 토큰 전송하지 않음
- **최소 권한**: 필요한 repo 권한만 요청

### API 사용량
- GitHub API Rate Limit: 시간당 5,000 요청
- 인증된 요청: 시간당 5,000 요청
- 효율적인 캐싱으로 제한 내 사용

## 🚧 로드맵

### 근시일 내 추가 예정
- [ ] **댓글 시스템**: GitHub Issues 기반
- [ ] **검색 기능**: 포스트 내용 전체 검색
- [ ] **태그 시스템**: 포스트 분류 및 필터링
- [ ] **RSS 피드**: 구독자를 위한 피드

### 장기 계획
- [ ] **다크 모드**: macOS 다크 모드 지원
- [ ] **PWA 지원**: 모바일 앱처럼 설치 가능
- [ ] **오프라인 모드**: 네트워크 없이도 글 작성
- [ ] **통계 대시보드**: 방문자 수, 인기 글 등

## 🐛 알려진 이슈

1. **Safari 호환성**: 일부 CSS 속성에서 접두사 필요
2. **모바일 키보드**: iOS에서 가상 키보드 높이 조정 필요
3. **GitHub API Limit**: 많은 포스트 시 로딩 시간 증가

## 🤝 기여하기

이 프로젝트에 기여하고 싶으시다면:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

### 영감을 받은 프로젝트들
- [Purify-macOS](https://github.com/Renovamen/playground-macos): macOS UI 디자인 참고
- [GitHub Pages](https://pages.github.com/): 호스팅 플랫폼
- [Lucide Icons](https://lucide.dev/): 아이콘 라이브러리

### 사용된 리소스
- **음악**: Post Malone, Swae Lee - "Sunflower"
- **월페이퍼**: macOS Monterey 기본 배경화면
- **폰트**: Apple San Francisco Fonts

---

## 📞 연락처

- **GitHub**: [@stylechoi](https://github.com/stylechoi)
- **Email**: stylechoi@github.com
- **Blog**: [https://stylechoi.github.io](https://stylechoi.github.io)

---

⭐ 이 프로젝트가 마음에 드셨다면 Star를 눌러주세요! ⭐