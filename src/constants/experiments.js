import {
    MonitorPlay, // Frame Control
    Cpu,         // CS Base
    Network,     // Architecture
    Layers,      // Reflow/Repaint
    Box,         // Virtualization
    Zap,         // Memory
    Image as ImageIcon, // Image Optimization
    MousePointer, // Event Control
    Search,      // Algo
    Shield,      // Security
    Database,    // Caching
    Split,       // Code Splitting
    Activity     // Profiling/ETC
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
    }
];