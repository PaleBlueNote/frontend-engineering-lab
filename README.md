# 🧪 Frontend Engineering Lab

> **"From Guessing to Measuring"**
> CS 지식(Graphics, OS, Network)을 기반으로 웹 프론트엔드의 성능 최적화와 내부 동작 원리를 **실험하고, 측정하고, 증명하는** 프로젝트입니다.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Graphics](https://img.shields.io/badge/Graphics-OpenGL_Concept-red?style=for-the-badge)

## 🎯 Project Goal

AI가 코드를 작성해 주는 시대에, 엔지니어의 가치는 **"보이지 않는 문제를 해결하는 능력"**에 있습니다.  
이 프로젝트는 웹 브라우저를 단순한 UI 뷰어가 아닌 **하나의 그래픽스 엔진이자 운영체제**로 바라보고, 다음 세 가지를 심도 있게 연구합니다.

1.  **Rendering Engineering:** 브라우저 렌더링 파이프라인(Reflow/Repaint) 제어 및 GPU 가속 활용
2.  **Memory & Data Structure:** C/C++ 기반의 메모리 관리 감각을 활용한 누수 방지 및 알고리즘 최적화
3.  **Architecture:** 견고한 소프트웨어 아키텍처 및 네트워크 프로토콜 최적화

## 🔬 Experiments List

모든 실험은 **[가설 설정] -> [구현 (Bad vs Good Case)] -> [정량적 측정] -> [결론 도출]**의 과정을 거칩니다.

### 🎨 Rendering & Graphics (Browser as a 3D Engine)
> OpenGL/Graphics 지식을 활용하여 렌더링 성능을 극대화합니다.

- [ ] **Reflow vs Repaint:** CSS 속성에 따른 렌더링 파이프라인 비용 비교 및 시각화
- [ ] **GPU Compositing:** `transform`과 `will-change`를 활용한 60FPS 애니메이션 구현
- [ ] **DOM Virtualization:** View Frustum Culling(절두체 선별) 기법을 응용한 대용량 리스트 최적화
- [ ] **Frame Control:** `requestAnimationFrame`과 V-Sync 동기화 원리 검증

### 💾 Memory & Computation (CS Fundamentals)
> C언어와 자료구조 지식을 활용하여 자바스크립트 엔진 효율을 높입니다.

- [ ] **Data Structure Performance:** Array($O(N)$) vs Map/Set($O(1)$) 탐색 속도 벤치마킹
- [ ] **Memory Leak Patterns:** 클로저(Closure)와 이벤트 리스너의 잘못된 사용 사례 및 방지법
- [ ] **Web Worker Multi-threading:** 메인 스레드 블로킹 해결을 위한 병렬 연산 처리
- [ ] **Image Optimization:** Lazy Loading과 메모리 관리 전략

### 🌐 Network & Architecture (Stable & Secure)
> 네트워크 프로토콜과 보안 원리를 적용합니다.

- [ ] **Event Loop Visualization:** Macro/Micro Task Queue 실행 순서 및 비동기 처리 시각화
- [ ] **HTTP Caching:** Cache-Control 전략에 따른 브라우저 동작 검증
- [ ] **Debounce & Throttle:** 입력 샘플링 레이트 제어를 통한 CPU 과부하 방지

## 🛠 Tech Stack

- **Core:** React, Vite
- **Styling:** Tailwind CSS, Pretendard Font
- **Routing:** React Router DOM
- **Analysis Tools:**
    - `stats.js` (FPS Monitoring)
    - Chrome DevTools (Performance, Memory Tab)

## 🚀 How to Run

```bash
# Clone the repository
git clone [https://github.com/YOUR_GITHUB_ID/frontend-engineering-lab.git](https://github.com/YOUR_GITHUB_ID/frontend-engineering-lab.git)

# Install dependencies
cd frontend-engineering-lab/lab
npm install

# Start the laboratory
npm run dev
```

## 👨‍💻 Author

**Yoonseokchan** - Email: yoonseokchan0731@gmail.com
- Github: [@PaleBlueNote](https://github.com/PaleBlueNote)
- **Focus:** Technical Frontend Engineer, Graphics Programming(OpenGL), Core CS.

---
*이 프로젝트는 지속적으로 업데이트되는 엔지니어링 기록물입니다.*