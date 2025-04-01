# 🌟 스타일최의 개발 블로그

> **올인원싱크자바스크립트 (all-in-one-sync-javascript) v2.0**로 구동되는 개인 블로그입니다.

## 📖 프로젝트 소개

GitHub Pages와 Markdown을 활용한 개인 블로그 시스템입니다. 매일의 학습 내용과 기술적 인사이트를 기록하고 공유합니다.

## 🚀 주요 기능

### ✨ 자동화된 포스트 관리
- **올인원싱크자바스크립트**: 모든 포스트를 자동으로 동기화하고 메타데이터 생성
- **스마트 태그 시스템**: 포스트 내용을 분석하여 자동 태그 생성
- **이미지 자동 매칭**: Unsplash API 연동으로 포스트에 맞는 이미지 자동 선택
- **SEO 최적화**: 자동 excerpt 생성 및 메타데이터 최적화

### 📱 반응형 웹 디자인
- macOS 스타일의 세련된 UI/UX
- 모바일 최적화 및 PWA 지원
- 다크모드 지원
- 스무스 애니메이션 및 인터랙션

## 📂 프로젝트 구조

```
stylechoi.github.io/
├── posts/
│   ├── daily/          # 일일 학습 기록
│   │   ├── 2025-04/
│   │   ├── 2025-05/
│   │   └── 2025-06/
│   ├── tech/           # 기술 포스트
│   └── posts-data.json # 포스트 메타데이터
├── scripts/
│   └── all-in-one-sync.js # 포스트 동기화 스크립트
├── css/
├── js/
└── images/
```

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Hosting**: GitHub Pages
- **Content**: Markdown
- **Automation**: Node.js
- **API**: Unsplash (이미지), 기타 웹 API

## 📝 주요 컨텐츠

### 데일리 포스트
- JavaScript 학습 여정
- React, Node.js 등 프론트엔드/백엔드 기술
- 알고리즘 및 자료구조 학습
- 개발 도구 및 워크플로우

### 기술 포스트  
- 심화 기술 분석
- 프로젝트 구현 과정
- 개발 경험 및 인사이트
- 최신 기술 트렌드

## 🚀 시작하기

### 로컬 개발

```bash
# 저장소 클론
git clone https://github.com/Stylechoi/stylechoi.github.io.git

# 프로젝트 디렉토리 이동
cd stylechoi.github.io

# 포스트 동기화 (Node.js 필요)
node scripts/all-in-one-sync.js

# 로컬 서버 실행 (Live Server 등 사용)
# index.html 파일을 브라우저에서 열기
```

### 새 포스트 작성

```bash
# 데일리 포스트 (posts/daily/YYYY-MM/YYYY-MM-DD.md)
touch posts/daily/2025-06/2025-06-03.md

# 기술 포스트 (posts/tech/YYYY-MM-DD-title.md)  
touch posts/tech/2025-06-03-new-tech-post.md

# 포스트 동기화
node scripts/all-in-one-sync.js

# Git 커밋 및 푸시
git add .
git commit -m "새 포스트 추가"
git push origin main
```

## 🎯 미래 계획

- [ ] 검색 기능 향상
- [ ] 댓글 시스템 추가
- [ ] 카테고리별 필터링 강화
- [ ] 분석 및 통계 대시보드
- [ ] 다국어 지원

## 📊 통계

- **총 포스트**: 36개
- **데일리 포스트**: 34개  
- **기술 포스트**: 2개
- **마지막 업데이트**: 2025-06-02

---

**"매일 조금씩, 꾸준히 성장하는 개발자가 되자"** 💻✨

<!-- Cache buster: 2025-06-02T16:30:00 -->

