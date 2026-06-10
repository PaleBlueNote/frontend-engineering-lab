import {
    MonitorPlay,    // Frame Control
    Cpu,            // Web Worker
    Network,        // Architecture
    Layers,         // Reflow/Repaint
    Box,            // Virtualization
    Zap,            // Memory Leak
    Image as ImageIcon, // Image Optimization
    MousePointer,   // Event Control
    Search,         // Array vs Map
    Shield,         // Security
    Database,       // Caching / Memoization
    Split,          // Bundling
    Activity,       // Immutability
    // Section 4: React 렌더링 심화
    GitBranch,      // Reconciliation
    TrendingUp,     // Memoization Cost
    Loader2,        // Concurrent Mode
    Clock,          // Effect Timing
    Wand2,          // React Compiler
    // Section 5: JS 핵심 개념
    Lock,           // Closure
    RefreshCcw,     // Event Loop (JS)
    Target,         // This Binding
    GitMerge,       // Prototype
    Workflow,       // Async Patterns
    // Section 6: 성능 최적화
    Sliders,        // Debounce & Throttle
    List,           // Virtualization (Performance)
    Archive,        // LRU Cache
    // Section 7: 상태 관리
    Share2,         // Context Rerender
    Scale,          // Context vs Zustand
    ThumbsUp,       // Optimistic Update
    // Section 8: CSS & 브라우저
    LayoutGrid,     // BFC / Flexbox vs Grid
    Star,           // Specificity
    // Section 9: 네트워크 & 보안
    Globe,          // CORS
    Bug,            // XSS
    // Section 10: TypeScript
    Code,           // TypeScript experiments
} from 'lucide-react';

// Helper 함수: 특정 ID의 실험 데이터를 쉽게 가져오기 위한 함수.
export const getExperimentById = (id) => {
    for (const category of EXPERIMENT_CATEGORIES) {
        const item = category.items.find(item => item.id === id);
        if (item) return item;
    }
    return null;
};

export const EXPERIMENT_CATEGORIES = [
    {
        title: "Section 1: Rendering & UX",
        id: "rendering",
        description: "Day 1 ~ 7: 브라우저 렌더링 파이프라인과 최적화",
        items: [
            {
                id: "reflow-repaint",
                title: "Day 1-2: Reflow vs Repaint",
                description: "Layout vs Composite & GPU Acceleration",
                path: "/experiments/rendering/reflow-repaint",
                icon: Layers,
                status: "ready",
                docs: [
                    {
                        day: "Day 1",
                        title: "Reflow vs Repaint 분석",
                        github: "https://github.com/PaleBlueNote/frontend-engineering-lab/issues/9",
                        blog: "https://velog.io/@palebluenote/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EB%A5%BC-%EA%B3%A0%EB%AC%B8%ED%95%B4%EB%B4%A4%EB%8B%A4-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98%EC%9D%B4-%EB%B2%84%EB%B2%85%EC%9D%B4%EB%8A%94-%EC%A7%84%EC%A7%9C-%EC%9D%B4%EC%9C%A0-Reflow-vs-Repaint"
                    },
                    {
                        day: "Day 2",
                        title: "GPU 가속 & Layers 탭 검증",
                        github: "https://github.com/PaleBlueNote/frontend-engineering-lab/issues/8",
                        blog: "https://velog.io/@palebluenote/%ED%81%AC%EB%A1%AC-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EB%8F%84%EA%B5%AC%EC%9D%98-%EC%88%A8%EA%B2%A8%EC%A7%84-%EA%B8%B0%EB%8A%A5-Layers-%ED%83%AD%EC%9C%BC%EB%A1%9C-GPU-%EB%9C%AF%EC%96%B4%EB%B3%B4%EA%B8%B0"
                    }
                ]
            },
            {
                id: "frame-control",
                title: "Day 3: Frame Control",
                description: "rAF vs setInterval (V-Sync)",
                path: "/experiments/rendering/frame-control",
                icon: MonitorPlay,
                status: "doing",
                docs: []
            },
            {
                id: "virtualization",
                title: "Day 4: Virtualization",
                description: "Windowing (React Window)",
                path: "/experiments/rendering/virtualization",
                icon: Box,
                status: "coming",
                docs: []
            },
            {
                id: "image-optimization",
                title: "Day 5: Image Optimization",
                description: "Lazy Loading & WebP",
                path: "/experiments/rendering/image-optimization",
                icon: ImageIcon,
                status: "coming",
                docs: []
            },
            {
                id: "event-control",
                title: "Day 6: Event Control",
                description: "Debounce & Throttle",
                path: "/experiments/rendering/event-control",
                icon: MousePointer,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 2: CS & JavaScript Core",
        id: "cs-base",
        description: "Day 8 ~ 14: 알고리즘, 메모리, 실행 컨텍스트",
        items: [
            {
                id: "array-vs-map",
                title: "Day 8: Array vs Map/Set",
                description: "Search Time Complexity",
                path: "/experiments/cs/array-vs-map",
                icon: Search,
                status: "coming",
                docs: []
            },
            {
                id: "memory-leak",
                title: "Day 9: Memory Leak",
                description: "Closure & Cleanup",
                path: "/experiments/cs/memory-leak",
                icon: Zap,
                status: "coming",
                docs: []
            },
            {
                id: "immutability",
                title: "Day 10: Immutability",
                description: "Reference Check & Rendering",
                path: "/experiments/cs/immutability",
                icon: Activity,
                status: "coming",
                docs: []
            },
            {
                id: "web-worker",
                title: "Day 11: Web Workers",
                description: "Multi-threading in JS",
                path: "/experiments/cs/web-worker",
                icon: Cpu,
                status: "coming",
                docs: []
            },
            {
                id: "memoization",
                title: "Day 14: Memoization",
                description: "Caching Strategy",
                path: "/experiments/cs/memoization",
                icon: Database,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 3: Architecture & Network",
        id: "architecture",
        description: "Day 15 ~ 21: 네트워크, 보안, 디자인 패턴",
        items: [
            {
                id: "http-caching",
                title: "Day 15: HTTP Caching",
                description: "Cache-Control & ETag",
                path: "/experiments/architecture/http-caching",
                icon: Database,
                status: "coming",
                docs: []
            },
            {
                id: "event-loop",
                title: "Day 16: Event Loop",
                description: "Macro vs Micro Task Queue",
                path: "/experiments/architecture/event-loop",
                icon: Network,
                status: "coming",
                docs: []
            },
            {
                id: "security",
                title: "Day 17-18: Security",
                description: "CORS & XSS Prevention",
                path: "/experiments/architecture/security",
                icon: Shield,
                status: "coming",
                docs: []
            },
            {
                id: "network-protocol",
                title: "Day 20: Network Protocols",
                description: "HTTP/1.1 vs HTTP/2",
                path: "/experiments/architecture/protocols",
                icon: Network,
                status: "coming",
                docs: []
            },
            {
                id: "bundling",
                title: "Day 21: Bundling",
                description: "Tree Shaking & Split",
                path: "/experiments/architecture/bundling",
                icon: Split,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 4: React 렌더링 심화",
        id: "react-deep",
        description: "React 내부 렌더링 메커니즘 실측",
        items: [
            {
                id: "reconciliation",
                title: "Reconciliation & Virtual DOM",
                description: "key 유무에 따른 DOM 재사용 실험",
                path: "/experiments/react-deep/reconciliation",
                icon: GitBranch,
                status: "coming",
                docs: []
            },
            {
                id: "memoization-cost",
                title: "React.memo / useMemo 비용",
                description: "메모이제이션 이득 vs 비용 실측",
                path: "/experiments/react-deep/memoization-cost",
                icon: TrendingUp,
                status: "coming",
                docs: []
            },
            {
                id: "concurrent-mode",
                title: "useTransition & useDeferredValue",
                description: "Concurrent Mode로 Jank 제거",
                path: "/experiments/react-deep/concurrent-mode",
                icon: Loader2,
                status: "coming",
                docs: []
            },
            {
                id: "effect-timing",
                title: "useEffect vs useLayoutEffect",
                description: "Paint 전/후 실행 타이밍 차이",
                path: "/experiments/react-deep/effect-timing",
                icon: Clock,
                status: "coming",
                docs: []
            },
            {
                id: "react-compiler",
                title: "React 19 Compiler",
                description: "auto-memo 전후 리렌더링 비교",
                path: "/experiments/react-deep/react-compiler",
                icon: Wand2,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 5: JavaScript 핵심 개념",
        id: "js-core",
        description: "면접 단골 JS 개념 코드로 직접 검증",
        items: [
            {
                id: "closure",
                title: "클로저 & 메모리",
                description: "렉시컬 스코프, 누수 패턴, 활용 예시",
                path: "/experiments/js-core/closure",
                icon: Lock,
                status: "coming",
                docs: []
            },
            {
                id: "js-event-loop",
                title: "이벤트 루프 시각화",
                description: "콜 스택 / 마이크로 / 매크로 태스크 순서",
                path: "/experiments/js-core/event-loop",
                icon: RefreshCcw,
                status: "coming",
                docs: []
            },
            {
                id: "this-binding",
                title: "this 바인딩 4가지 규칙",
                description: "암시적 / 명시적 / new / 화살표 함수",
                path: "/experiments/js-core/this-binding",
                icon: Target,
                status: "coming",
                docs: []
            },
            {
                id: "prototype",
                title: "프로토타입 체인",
                description: "class는 prototype의 문법적 설탕인가?",
                path: "/experiments/js-core/prototype",
                icon: GitMerge,
                status: "coming",
                docs: []
            },
            {
                id: "async-patterns",
                title: "비동기 패턴 비교",
                description: "Callback → Promise → async/await 에러 처리",
                path: "/experiments/js-core/async-patterns",
                icon: Workflow,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 6: 성능 최적화 패턴",
        id: "performance",
        description: "측정 데이터로 증명하는 최적화",
        items: [
            {
                id: "debounce-throttle",
                title: "Debounce & Throttle 직접 구현",
                description: "라이브러리 없이 구현 + API 호출 횟수 비교",
                path: "/experiments/performance/debounce-throttle",
                icon: Sliders,
                status: "coming",
                docs: []
            },
            {
                id: "perf-virtualization",
                title: "Virtualization 직접 구현",
                description: "DOM 10,000개 vs 윈도잉 FPS 비교",
                path: "/experiments/performance/virtualization",
                icon: List,
                status: "coming",
                docs: []
            },
            {
                id: "lazy-loading",
                title: "Image Lazy Loading",
                description: "IntersectionObserver 직접 구현 vs loading=lazy",
                path: "/experiments/performance/lazy-loading",
                icon: ImageIcon,
                status: "coming",
                docs: []
            },
            {
                id: "code-splitting",
                title: "Code Splitting 시각화",
                description: "Dynamic import로 초기 번들 크기 줄이기",
                path: "/experiments/performance/code-splitting",
                icon: Split,
                status: "coming",
                docs: []
            },
            {
                id: "lru-cache",
                title: "LRU 캐시 구현",
                description: "Map으로 O(1) get/put 구현 + 히트율 측정",
                path: "/experiments/performance/lru-cache",
                icon: Archive,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 7: 상태 관리 비교",
        id: "state-management",
        description: "어떤 상황에 어떤 도구를 쓰는가",
        items: [
            {
                id: "context-rerender",
                title: "Context API 리렌더링 함정",
                description: "Context value 변경 시 전체 소비자 리렌더링",
                path: "/experiments/state-management/context-rerender",
                icon: Share2,
                status: "coming",
                docs: []
            },
            {
                id: "context-vs-zustand",
                title: "Context vs Zustand",
                description: "selector 기반 구독으로 리렌더링 차이 비교",
                path: "/experiments/state-management/context-vs-zustand",
                icon: Scale,
                status: "coming",
                docs: []
            },
            {
                id: "state-vs-reducer",
                title: "useState vs useReducer",
                description: "복잡한 상태 전환에서 reducer의 장점",
                path: "/experiments/state-management/state-vs-reducer",
                icon: GitBranch,
                status: "coming",
                docs: []
            },
            {
                id: "optimistic-update",
                title: "낙관적 업데이트 (useOptimistic)",
                description: "서버 응답 전 즉시 UI 반영 + 실패 시 롤백",
                path: "/experiments/state-management/optimistic-update",
                icon: ThumbsUp,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 8: CSS & 브라우저 동작",
        id: "css-browser",
        description: "스타일이 왜 이렇게 적용되는지 설명하기",
        items: [
            {
                id: "bfc",
                title: "BFC (Block Formatting Context)",
                description: "overflow: hidden이 float를 포함하는 이유",
                path: "/experiments/css-browser/bfc",
                icon: LayoutGrid,
                status: "coming",
                docs: []
            },
            {
                id: "stacking-context",
                title: "Stacking Context & z-index",
                description: "z-index 9999도 예상대로 안 되는 이유",
                path: "/experiments/css-browser/stacking-context",
                icon: Layers,
                status: "coming",
                docs: []
            },
            {
                id: "specificity",
                title: "CSS Specificity 계산기",
                description: "4자리 점수로 스타일 우선순위 결정",
                path: "/experiments/css-browser/specificity",
                icon: Star,
                status: "coming",
                docs: []
            },
            {
                id: "flexbox-vs-grid",
                title: "Flexbox vs Grid 선택 기준",
                description: "1차원 vs 2차원 — 언제 어느 것을 쓸까",
                path: "/experiments/css-browser/flexbox-vs-grid",
                icon: LayoutGrid,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 9: 네트워크 & 보안",
        id: "network-security",
        description: "공격과 방어를 직접 재현하며 이해",
        items: [
            {
                id: "cors",
                title: "CORS Preflight 시각화",
                description: "OPTIONS 요청이 발생하는 조건과 해결",
                path: "/experiments/network-security/cors",
                icon: Globe,
                status: "coming",
                docs: []
            },
            {
                id: "xss",
                title: "XSS 공격과 방어",
                description: "innerHTML vs React 기본 vs DOMPurify",
                path: "/experiments/network-security/xss",
                icon: Bug,
                status: "coming",
                docs: []
            },
            {
                id: "http2",
                title: "HTTP/1.1 vs HTTP/2",
                description: "Multiplexing으로 HOL Blocking 해결",
                path: "/experiments/network-security/http2",
                icon: Network,
                status: "coming",
                docs: []
            }
        ]
    },
    {
        title: "Section 10: TypeScript 실전",
        id: "typescript",
        description: "타입으로 불가능한 상태를 표현 불가능하게",
        items: [
            {
                id: "generics",
                title: "Generics 제약 조건",
                description: "T extends 없을 때와 있을 때 타입 안전성 차이",
                path: "/experiments/typescript/generics",
                icon: Code,
                status: "coming",
                docs: []
            },
            {
                id: "discriminated-union",
                title: "Discriminated Union",
                description: "불가능한 상태를 타입으로 표현 불가능하게",
                path: "/experiments/typescript/discriminated-union",
                icon: GitBranch,
                status: "coming",
                docs: []
            },
            {
                id: "utility-types",
                title: "Utility Types 직접 구현",
                description: "Partial / Pick / Omit을 Mapped Type으로",
                path: "/experiments/typescript/utility-types",
                icon: Code,
                status: "coming",
                docs: []
            },
            {
                id: "type-narrowing",
                title: "타입 좁히기 (Type Narrowing)",
                description: "typeof / instanceof / 커스텀 타입 가드",
                path: "/experiments/typescript/type-narrowing",
                icon: Code,
                status: "coming",
                docs: []
            }
        ]
    }
];