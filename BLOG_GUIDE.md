# 📝 VSCode 블로그 운영 가이드

## 1. 새 포스트 작성하기

### 일상 블로그 (posts/daily/)
```markdown
---
title: 오늘의 일상 - 카페에서 코딩하기
date: 2024-05-24
category: daily
description: 새로운 카페에서 코딩하며 보낸 하루
---

# 오늘의 일상 - 카페에서 코딩하기

오늘은 새로운 카페를 발견해서...
```

### 기술 블로그 (posts/tech/)
```markdown
---
title: React Hooks 완벽 정리
date: 2024-05-24
category: tech
description: useState, useEffect 등 React Hooks 사용법 정리
---

# React Hooks 완벽 정리

## useState
...
```

## 2. Git 워크플로우

### 매일의 블로그 작성 루틴
```bash
# VSCode로 파일 작성
code posts/daily/2024-05-24-새로운-포스트.md

# Git 스테이징
git add .

# 의미있는 커밋 메시지
git commit -m "Add: 새로운 포스트 - 카페 코딩 후기"

# GitHub에 푸시 (잔디 등록!)
git push origin main
```

## 3. 잔디 채우기 팁

### 효과적인 커밋 메시지
- `Add: 새 포스트 제목`
- `Update: 포스트 수정`
- `Fix: 오타 수정`
- `Docs: README 업데이트`

### 꾸준한 포스팅으로 잔디 관리
- 매일 작은 글이라도 꾸준히
- 수정/보완도 별도 커밋으로
- 카테고리별로 나누어 관리

## 4. 폴더 구조
```
stylechoi.github.io/
├── posts/
│   ├── daily/          # 일상 블로그
│   │   ├── 2024-05-24-카페-코딩.md
│   │   └── 2024-05-25-주말-나들이.md
│   └── tech/           # 기술 블로그
│       ├── 2024-05-24-react-hooks.md
│       └── 2024-05-25-javascript-tips.md
├── image/              # 이미지 파일들
├── css/style.css
├── js/script.js
└── index.html
```

## 5. 이미지 추가하기
```markdown
![설명](../image/posts/2024-05-24-screenshot.png)
```

## 6. VSCode 추천 확장 프로그램
- Markdown All in One
- Markdown Preview Enhanced
- Git Graph
- GitLens
