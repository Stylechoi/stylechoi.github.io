# 📝 Stylechoi Blog

개인 학습 및 기술 블로그입니다.

🌐 **블로그 주소**: [https://stylechoi.github.io/](https://stylechoi.github.io/)

## 📁 프로젝트 구조

```
posts/
├── daily/          # 일일 학습 기록
│   ├── 2025-04/    # 년-월별 폴더
│   └── 2025-05/
└── tech/           # 기술 포스트
```

## ✍️ 포스트 작성 워크플로우

### 1. 새 포스트 작성

**Daily 포스트 (일일 학습)**
```bash
# posts/daily/YYYY-MM/ 폴더에 YYYY-MM-DD.md 파일 생성
posts/daily/2025-05/2025-05-28.md
```

**Tech 포스트 (기술 글)**
```bash
# posts/tech/ 폴더에 YYYY-MM-DD-제목.md 파일 생성
posts/tech/2025-05-28-login-system-implementation.md
```

### 2. 포스트 형식

**간단한 Front Matter 사용** (스크립트가 자동으로 메타데이터 생성)
```markdown
---
---

# 포스트 제목

포스트 내용...
```

### 3. 동기화 및 배포

**방법 1: 스크립트 직접 실행**
```bash
node scripts/all-in-one-sync.js
```

**방법 2: 배치 파일 사용 (Windows)**
```bash
./sync-posts.bat
```

**방법 3: 쉘 스크립트 사용 (Linux/Mac)**
```bash
./sync-posts.sh
```

### 4. Git 커밋 및 푸시
```bash
git add .
git commit -m "포스트 추가: 제목"
git push origin main
```

## 🤖 자동화 기능

- **메타데이터 자동 생성**: 제목, 날짜, 카테고리, 설명, 태그 등
- **이미지 자동 할당**: Unsplash 랜덤 이미지
- **태그 자동 추출**: 내용 기반 해시태그 및 키워드 분석
- **삭제된 파일 감지**: 파일 삭제 시 자동으로 메타데이터에서 제거

## 💡 팁

1. **Front Matter 최소화**: 스크립트가 자동으로 처리하므로 빈 Front Matter만 사용
2. **파일명 규칙 준수**: Daily는 `YYYY-MM-DD.md`, Tech는 `YYYY-MM-DD-제목.md`
3. **첫 번째 # 헤더**: 포스트 제목으로 자동 인식됨
4. **해시태그 활용**: `#JavaScript` 같은 해시태그로 자동 태그 생성

---

**마지막 업데이트**: 2025-05-28

