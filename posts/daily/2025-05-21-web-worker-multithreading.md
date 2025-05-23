---
title: 웹 워커와 멀티스레딩 기반 성능 최적화
date: 2025-05-21
category: tech
tags: #javascript #webworker #performance #multithreading #optimization
---

# 웹 워커와 멀티스레딩 기반 성능 최적화

오늘은 웹 워커를 활용한 JavaScript 멀티스레딩과 고성능 웹 애플리케이션 구현 방법에 대해 집중적으로 공부했다. 특히 애니메이션이 많은 웹앱에서 성능 병목 현상을 해결하는 방법을 실험해봤다.

## 🔁 웹 워커 기본과 활용

무거운 작업을 메인 스레드에서 분리하기 위한 웹 워커에 대해 학습했다:

### 웹 워커 기본 구현

```javascript
// main.js (메인 스레드)
const worker = new Worker('worker.js');

document.getElementById('calculate-btn').addEventListener('click', () => {
  const num = parseInt(document.getElementById('number-input').value);
  
  // 워커에게 메시지 전송
  worker.postMessage({ type: 'CALCULATE_PRIMES', payload: num });
  
  // UI 업데이트 (진행 중 표시)
  document.getElementById('status').textContent = '계산 중...';
});

// 워커로부터 응답 수신
worker.onmessage = function(event) {
  const { type, payload } = event.data;
  
  if (type === 'PROGRESS') {
    document.getElementById('progress-bar').style.width = `${payload}%`;
  }
  else if (type === 'RESULT') {
    document.getElementById('status').textContent = '완료!';
    displayResults(payload);
  }
};

// worker.js (워커 스레드)
onmessage = function(event) {
  const { type, payload } = event.data;
  
  if (type === 'CALCULATE_PRIMES') {
    const primes = [];
    const num = payload;
    
    for (let i = 2; i <= num; i++) {
      // 진행률 보고 (10000개마다)
      if (i % 10000 === 0) {
        postMessage({
          type: 'PROGRESS',
          payload: Math.floor((i / num) * 100)
        });
      }
      
      let isPrime = true;
      for (let j = 2; j < i; j++) {
        if (i % j === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) primes.push(i);
    }
    
    // 결과 반환
    postMessage({
      type: 'RESULT',
      payload: primes
    });
  }
};
```

### 웹 워커 장단점 분석

👍 **장점**:
- 메인 스레드 블로킹 방지로 UI 반응성 유지
- 멀티코어 CPU 활용 가능
- 복잡한 계산, 데이터 처리에 적합

👎 **단점**:
- DOM 직접 접근 불가능 (메인 스레드와 통신 필요)
- 메모리 오버헤드 증가
- 스레드 간 통신에 시간 소요

## 🔄 SharedArrayBuffer와 Atomics

최근 웹 표준에 추가된 SharedArrayBuffer와 Atomics API에 대해서도 학습했다:

```javascript
// 메인 스레드
const buffer = new SharedArrayBuffer(4); // 4바이트 버퍼
const view = new Int32Array(buffer); // Int32 뷰

view[0] = 123; // 초기값 설정

const worker = new Worker('shared-worker.js');
worker.postMessage({ buffer }); // 워커에 공유 버퍼 전달

// 워커 스레드 (shared-worker.js)
onmessage = function(event) {
  const { buffer } = event.data;
  const view = new Int32Array(buffer);
  
  // Atomics.add로 원자적 연산 수행
  const oldValue = Atomics.add(view, 0, 42);
  console.log('이전 값:', oldValue); // 123
  console.log('새 값:', view[0]); // 165 (123 + 42)
  
  // 메인 스레드에 알림
  postMessage('완료');
};

// 메인 스레드에서 워커 응답 처리
worker.onmessage = function() {
  console.log('최종 값:', view[0]); // 165
};
```

## 🎨 캔버스 애니메이션 최적화

웹 워커와 이벤트 루프 지식을 활용해 캔버스 애니메이션을 최적화하는 프로젝트를 진행했다:

```javascript
// main.js
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const particleWorker = new Worker('particle-worker.js');

// 게임 상태
let particles = []; // 파티클 데이터 저장
let rendering = false;

// 워커 초기화
particleWorker.postMessage({
  type: 'INIT',
  payload: {
    width: canvas.width,
    height: canvas.height,
    particleCount: 5000
  }
});

// 워커로부터 업데이트된 파티클 데이터 수신
particleWorker.onmessage = function(event) {
  const { type, payload } = event.data;
  
  if (type === 'UPDATE') {
    particles = payload;
    
    // 렌더링 중이 아니면 렌더링 시작
    if (!rendering) {
      rendering = true;
      requestAnimationFrame(render);
    }
  }
};

// 렌더링 함수 (메인 스레드에서 실행)
function render() {
  // 캔버스 지우기
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 모든 파티클 그리기
  ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 다음 프레임 요청
  rendering = true;
  requestAnimationFrame(render);
}
```

## 📊 성능 측정 및 비교

여러 접근 방식의 성능을 Chrome DevTools의 Performance 탭으로 분석했다:

| 구현 방식 | FPS | CPU 사용률 | 메모리 사용량 | 느낌 |
|---------|-----|-----------|------------|-----|
| 단일 스레드 | ~30 | 90-100% | 낮음 | 버벅임 |
| 웹 워커 + 메시지 | ~55 | 70-80% | 중간 | 좋음 |
| 웹 워커 + SharedArrayBuffer | ~58 | 65-75% | 중간 | 매우 좋음 |
| OffscreenCanvas | ~60 | 60-70% | 높음 | 부드러움 |

확실히 워커를 활용하면 메인 스레드 부하가 줄어들어 UI 반응성이 크게 향상되는 것을 확인했다.

## 🤔 어려웠던 부분 & 앞으로의 학습 방향

1. **디버깅 복잡성**: 웹 워커 내부 동작 디버깅이 어려움
2. **브라우저 호환성**: SharedArrayBuffer, OffscreenCanvas 등은 아직 지원이 제한적
3. **아키텍처 설계**: 어떤 작업을 워커로 분리할지 결정하는 것이 생각보다 복잡함

## 🪬 오늘의 교훈

JavaScript의 단일 스레드 모델은 여전히 큰 제약이지만, 웹 워커와 최신 API를 활용하면 꽤 강력한 멀티스레딩 애플리케이션을 구현할 수 있다는 점을 실감했다. 특히 프레임워크에 의존하지 않고 순수 JavaScript로 성능 최적화를 고민해보는 과정이 매우 유익했다.

무조건 워커를 사용하는 것보다는 작업의 특성을 고려해 적절한 기법을 선택하는 것이 중요하다. 단순히 UI를 블로킹하지 않는 것을 넘어, 작업을 어떻게 분할하고 스레드 간 통신 오버헤드를 최소화할지 고민하는 것이 핵심이다.

---

**다음 포스트**: OffscreenCanvas와 워커 풀 패턴 구현 상세 가이드