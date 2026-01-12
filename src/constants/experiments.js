import {
    MonitorPlay,
    Cpu,
    Network,
    Layers,
    Box,
    Zap
} from 'lucide-react';

export const EXPERIMENT_CATEGORIES = [
    {
        title: "Rendering & Graphics",
        id: "rendering",
        description: "브라우저 렌더링 파이프라인 및 GPU 가속 최적화",
        items: [
            {
                id: "reflow-repaint",
                title: "Reflow vs Repaint",
                path: "/experiments/rendering/reflow-repaint",
                icon: Layers,
                status: "ready" // ready, doing, coming
            },
            {
                id: "gpu-compositing",
                title: "GPU Compositing",
                path: "/experiments/rendering/gpu-compositing",
                icon: Box,
                status: "coming"
            }
        ]
    },
    {
        title: "Memory & CS Base",
        id: "memory",
        description: "자료구조 효율화 및 메모리 누수 방지",
        items: [
            {
                id: "array-vs-map",
                title: "Array vs Map/Set",
                path: "/experiments/memory/array-vs-map",
                icon: Cpu,
                status: "coming"
            },
            {
                id: "memory-leak",
                title: "Memory Leak Patterns",
                path: "/experiments/memory/memory-leak",
                icon: Zap,
                status: "coming"
            }
        ]
    },
    {
        title: "Architecture",
        id: "architecture",
        description: "네트워크, 보안 및 견고한 설계",
        items: [
            {
                id: "event-loop",
                title: "Event Loop Visualizer",
                path: "/experiments/architecture/event-loop",
                icon: Network,
                status: "coming"
            }
        ]
    }
];