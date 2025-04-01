---
title: GitHub Pages + Markdown 블로그 시스템 구축
date: 2024-05-23
category: tech
description: VSCode에서 마크다운 파일을 작성하고 GitHub에 푸시하면 자동으로 블로그에 반영되는 시스템 구현 과정
---

# GitHub Pages + Markdown 블로그 시스템 구축

안녕하세요! 오늘은 VSCode에서 마크다운으로 글을 작성하고, GitHub에 커밋하면 자동으로 블로그에 반영되는 시스템을 구축한 과정을 공유하려고 합니다.

## 🎯 목표

- **VSCode에서 마크다운 작성**: 익숙한 에디터에서 편리하게 글쓰기
- **GitHub 자동 연동**: 커밋/푸시만으로 블로그 업데이트
- **실시간 반영**: GitHub API를 통한 즉시 동기화
- **잔디 채우기**: 꾸준한 포스팅으로 GitHub 활동 기록

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: GitHub REST API v3
- **인증**: Personal Access Token
- **스타일**: macOS 네이티브 디자인

## 📁 프로젝트 구조

```
stylechoi.github.io/
├── posts/
│   ├── tech/           # 기술 블로그
│   └── daily/          # 일상 블로그
├── css/
├── js/
├── image/
└── index.html
```

## 🚀 주요 기능

### 1. GitHub API 연동

```javascript
async fetchMarkdownFiles(path) {
    const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
        headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    // ...
}
```

### 2. Front Matter 파싱

```yaml
---
title: 포스트 제목
date: 2024-05-23
category: tech
description: 포스트 설명
---
```

### 3. 실시간 에디터

- **VSCode 스타일 인터페이스**
- **마크다운 실시간 미리보기**
- **자동 저장 및 커밋**

## 💡 워크플로우

1. **폴더 클릭** → 기술/일상 vlog 선택
2. **새 포스트 작성** → VSCode 스타일 에디터 열림
3. **마크다운 작성** → 실시간 미리보기 지원
4. **저장 & 커밋** → 자동으로 GitHub에 푸시
5. **즉시 반영** → 블로그 목록에 새 글 표시

## 🎨 디자인 특징

### macOS 네이티브 스타일
- **Dock 애니메이션**: 호버 시 magnification 효과
- **윈도우 시스템**: 드래그, 리사이즈 가능한 창
- **메뉴바**: 실제 macOS와 동일한 디자인

### 반응형 디자인
- 데스크톱과 모바일 모두 최적화
- 터치 친화적 인터페이스

## 🔐 보안

- **Personal Access Token**: 로컬 저장소에만 보관
- **HTTPS 통신**: 모든 API 요청 암호화
- **권한 최소화**: 필요한 repo 권한만 요청

## 📈 향후 계획

- [ ] **Webhook 연동**: 실시간 알림 시스템
- [ ] **댓글 시스템**: GitHub Issues 기반
- [ ] **검색 기능**: 포스트 내용 검색
- [ ] **태그 시스템**: 카테고리별 분류
- [ ] **RSS 피드**: 구독자를 위한 피드 제공

## 🎉 마무리

이제 VSCode에서 편리하게 블로그를 작성하고, GitHub 잔디도 채울 수 있게 되었습니다! 

마크다운의 강력함과 GitHub의 버전 관리 기능을 활용해서 더욱 체계적으로 블로그를 운영할 수 있을 것 같습니다.

---

**다음 포스트 예고**: macOS 스타일 웹 인터페이스 구현 상세 가이드 📱✨