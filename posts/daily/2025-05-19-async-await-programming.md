---
title: Async/Await와 실전 비동기 프로그래밍 학습
date: 2025-05-19
category: tech
tags: #javascript #asyncawait #promise #api #비동기
---

# Async/Await와 실전 비동기 프로그래밍 학습

오늘은 JavaScript의 async/await 문법을 깊이 있게 공부하고, 주말 동안 배운 비동기 프로그래밍 개념들을 실제 미니 프로젝트에 적용해보았다. 점점 복잡한 JavaScript 패턴들이 익숙해지고 있는 느낌이다.

## 🔄 Async/Await 문법 이해하기

Promise를 더 간결하고 직관적으로 다룰 수 있는 async/await 문법에 대해 학습했다:

```javascript
// Promise를 사용한 비동기 코드
function fetchUserData(userId) {
  return fetch(`https://api.example.com/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('사용자 데이터를 가져오는데 실패했습니다.');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error('에러 발생:', error);
      throw error;
    });
}

// async/await를 사용한 동일한 코드
async function fetchUserDataAsync(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('사용자 데이터를 가져오는데 실패했습니다.');
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
}
```

### async/await의 장점

1. **가독성 향상**: 비동기 코드를 동기 코드처럼 작성 가능
2. **에러 처리 간소화**: 일반적인 try-catch 문으로 에러 처리
3. **디버깅 용이성**: 스택 트레이스가 더 명확하게 표시됨

### 주의할 점

```javascript
// 🔴 안 좋은 예: await를 병렬로 처리할 수 있는데 순차적으로 처리
async function fetchMultipleDataSequential() {
  const userData = await fetchUserData(123);
  const productData = await fetchProductData(456); // userData 완료 후에만 시작
  return { userData, productData };
}

// 🟢 좋은 예: 독립적인 작업은 병렬로 처리
async function fetchMultipleDataParallel() {
  const userDataPromise = fetchUserData(123);
  const productDataPromise = fetchProductData(456); // fetchUserData와 동시에 시작
  
  const userData = await userDataPromise;
  const productData = await productDataPromise;
  return { userData, productData };
}

// 또는 더 간결하게 Promise.all 사용
async function fetchMultipleDataWithPromiseAll() {
  const [userData, productData] = await Promise.all([
    fetchUserData(123),
    fetchProductData(456)
  ]);
  return { userData, productData };
}
```

## 🔄 비동기 패턴 실전 활용

배운 내용을 바탕으로 실제 데이터를 불러오는 미니 프로젝트를 구현했다:

### 영화 정보 앱 만들기

```javascript
// 영화 API에서 데이터 가져오기
async function fetchMovieData(title) {
  try {
    const response = await fetch(`https://api.example.com/movies?title=${encodeURIComponent(title)}`);
    
    if (!response.ok) {
      throw new Error(`영화 정보를 가져오는데 실패했습니다 (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
}

// 영화 상세 정보와 관련 영화 함께 가져오기
async function getMovieDetails(movieId) {
  try {
    // 두 API 요청을 병렬로 처리
    const [details, relatedMovies] = await Promise.all([
      fetch(`https://api.example.com/movies/${movieId}`).then(res => res.json()),
      fetch(`https://api.example.com/movies/${movieId}/related`).then(res => res.json())
    ]);
    
    return {
      details,
      relatedMovies
    };
  } catch (error) {
    console.error('영화 상세 정보를 가져오는데 실패했습니다:', error);
    throw error;
  }
}
```

## 🔄 에러 처리와 로딩 상태 관리

비동기 작업에서 중요한 에러 처리와 로딩 상태 관리에 대해 심도 있게 학습했다:

### 사용자 경험을 고려한 로딩 처리

```javascript
async function fetchDataWithLoading(url) {
  // 로딩 시작
  showLoadingIndicator();
  
  try {
    // 의도적으로 지연시켜 UX 개선 (너무 빨리 로딩이 끝나면 깜빡거림 현상 발생)
    const [data] = await Promise.all([
      fetch(url).then(res => res.json()),
      new Promise(resolve => setTimeout(resolve, 300)) // 최소 300ms 대기
    ]);
    
    return data;
  } catch (error) {
    // 에러 상태 표시
    showErrorMessage(error.message);
    throw error;
  } finally {
    // 성공/실패 상관없이 로딩 종료
    hideLoadingIndicator();
  }
}
```

### 재시도 메커니즘

일시적인 네트워크 오류에 대응하기 위한 재시도 로직도 구현해 보았다:

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        console.error(`${maxRetries}번 재시도 후 요청 실패:`, error);
        throw error;
      }
      
      console.warn(`요청 실패 (${retries}/${maxRetries}), 재시도 중...`, error);
      
      // 지수 백오프: 재시도마다 대기 시간 증가
      const delay = 1000 * Math.pow(2, retries - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## 🤔 어려웠던 부분 & 앞으로의 학습 방향

1. **비동기 작업 취소하기**: 사용자가 페이지를 나가거나 다른 요청을 시작했을 때 진행 중인 비동기 작업을 취소하는 방법
2. **복잡한 비동기 흐름 관리**: 여러 API 간의 의존성과 조건부 호출을 관리하는 방법
3. **효율적인 상태 업데이트**: 대량의 데이터를 처리할 때 렌더링 성능 최적화

## 🪬 오늘의 교훈

비동기 프로그래밍은 처음에는 복잡해 보이지만, 패턴을 익히고 실제로 구현해보니 점점 직관적으로 이해되기 시작했다. 특히 async/await 문법은 코드를 더 읽기 쉽게 만들어 주어 비즈니스 로직에 집중할 수 있게 해준다. 

하지만 성능 최적화와 에러 처리까지 고려하려면 Promise의 동작 원리도 깊이 이해해야 한다는 점을 깨달았다. 결국 도구를 사용하는 것보다 그 도구가 어떻게 작동하는지 이해하는 것이 중요하다.

---

## 회고 요약

- async/await 문법의 장점과 활용법 학습
- 병렬 비동기 처리를 위한 Promise.all 패턴 이해
- 실제 API 호출 프로젝트에 적용해보기
- 로딩 상태 관리와 에러 처리 심화 학습
- HTTP 요청 라이브러리 비교 및 분석
- 비동기 작업 취소와 복잡한 흐름 관리는 추가 학습 필요