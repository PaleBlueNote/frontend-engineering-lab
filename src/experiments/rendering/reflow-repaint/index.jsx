import React, { useState, useEffect, useRef, useTransition } from 'react';
import Stats from 'stats.js';
import { Play, Pause, RefreshCw, Zap, Cpu, Loader2, Settings } from 'lucide-react';

// React.memo로 최적화된 아이템 레이어
const TestItemLayer = React.memo(({ isOptimized, count }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="test-item absolute w-8 h-8 rounded-full shadow-lg border border-white/20"
                    style={{
                        // 초기 스타일 설정
                        top: `${Math.random() * 90 + 5}%`,
                        left: '50px',
                        background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                        willChange: isOptimized ? 'transform' : 'auto',
                        opacity: 0.9,
                        transform: 'translate3d(0,0,0)'
                    }}
                />
            ))}
        </>
    );
}, (prevProps, nextProps) => {
    // 최적화 모드나 개수가 같으면 리렌더링 방지
    return prevProps.isOptimized === nextProps.isOptimized && prevProps.count === nextProps.count;
});

const ReflowRepaint = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isOptimized, setIsOptimized] = useState(false);
    const [count, setCount] = useState(1000); // 🎛️ 기본 개수 1000개
    const [isPending, startTransition] = useTransition();

    const containerRef = useRef(null);
    const requestRef = useRef();
    const statsRef = useRef(null);

    // 1. Stats.js 초기화
    useEffect(() => {
        if (!statsRef.current && containerRef.current) {
            const stats = new Stats();
            stats.showPanel(0);
            stats.dom.style.position = 'absolute';
            stats.dom.style.top = '10px';
            stats.dom.style.left = '10px';
            stats.dom.style.zIndex = '20';
            containerRef.current.appendChild(stats.dom);
            statsRef.current = stats;
        }
    }, []);

    // 2. 🧹 [Bug Fix] 모드 전환 시 스타일 잔여물 청소
    // CPU <-> GPU 전환 시 이전 모드의 스타일(left 등)이 남아있어 위치가 튀는 현상 방지
    useEffect(() => {
        const items = document.getElementsByClassName('test-item');
        // 애니메이션 루프가 돌기 전에 강제로 위치 초기화
        for (let i = 0; i < items.length; i++) {
            if (isOptimized) {
                // GPU 모드로 갈 때: left를 초기값으로 돌려놔야 transform이 정확히 먹힘
                items[i].style.left = '50px';
            } else {
                // CPU 모드로 갈 때: transform을 꺼야 left가 정확히 먹힘
                items[i].style.transform = 'none';
            }
        }
    }, [isOptimized, count]); // count가 바뀔 때도 초기화

    // 3. 모드 토글 핸들러
    const handleModeToggle = () => {
        if (isPending) return;
        setIsRunning(false);
        startTransition(() => {
            setIsOptimized((prev) => !prev);
        });
    };

    // 4. 애니메이션 루프
    const animate = (time) => {
        if (statsRef.current) statsRef.current.begin();
        const items = document.getElementsByClassName('test-item');

        // 왕복 운동 계산
        const position = (Math.sin(time / 500) + 1) * 200;

        for (let i = 0, len = items.length; i < len; i++) {
            const item = items[i];
            if (isOptimized) {
                // ✅ GPU Composite
                item.style.transform = `translate3d(${position}px, 0, 0)`;
            } else {
                // ❌ CPU Layout (Reflow)
                item.style.left = `${50 + position}px`; // 50px(초기값) + 이동거리
            }
        }

        if (statsRef.current) statsRef.current.end();
        requestRef.current = requestAnimationFrame(animate);
    };

    // 5. 실행 상태 관리
    useEffect(() => {
        if (isRunning && !isPending) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isRunning, isOptimized, isPending, count]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
                            Reflow vs Repaint
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                Day 1
                            </span>
                        </h2>
                        <p className="text-gray-500 mt-1">
                            기기 성능에 맞춰 개체 수를 조절하며 테스트해보세요.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            disabled={isPending}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white transition-all shadow-md active:scale-95 ${
                                isRunning
                                    ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                            {isRunning ? 'Pause' : 'Start'}
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            title="Reset Page"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* 🎛️ Control Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">

                    {/* 1. CPU/GPU Toggle */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isOptimized ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {isOptimized ? <Zap size={20} /> : <Cpu size={20} />}
                            </div>
                            <div className="text-sm">
                                <div className="font-bold text-slate-700">Render Mode</div>
                                <div className="text-xs text-slate-400">{isOptimized ? 'GPU (Composite)' : 'CPU (Layout)'}</div>
                            </div>
                        </div>
                        <button
                            onClick={handleModeToggle}
                            disabled={isPending}
                            className={`relative w-32 h-10 rounded-full transition-colors duration-300 ${isOptimized ? 'bg-green-500' : 'bg-red-400'}`}
                        >
                            <div className={`absolute top-1 bottom-1 w-[40%] bg-white rounded-full shadow transition-all duration-200 flex items-center justify-center ${isOptimized ? 'left-[56%]' : 'left-1'}`}>
                                {isPending ? <Loader2 size={14} className="animate-spin text-gray-400"/> : null}
                            </div>
                            <span className="absolute inset-0 flex justify-center items-center text-[10px] font-bold text-white pointer-events-none gap-8 uppercase">
                                <span>CPU</span>
                                <span>GPU</span>
                            </span>
                        </button>
                    </div>

                    {/* 2. Count Slider (Load Test) */}
                    <div className="flex flex-col justify-center bg-white p-3 rounded-md shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Settings size={16} className="text-slate-400"/>
                                Load Test
                            </div>
                            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                {count} items
                            </span>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="5000"
                            step="100"
                            value={count}
                            onChange={(e) => {
                                setIsRunning(false); // 개수 변경 시 잠시 멈춤
                                setCount(Number(e.target.value));
                            }}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                            <span>100 (Light)</span>
                            <span>5000 (Heavy)</span>
                        </div>
                    </div>
                </div>

                {/* Explanation */}
                <div className={`p-4 rounded-lg border text-sm transition-colors duration-300 ${isOptimized ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <strong>💡 현재 상태:</strong> {isOptimized
                    ? 'GPU가 레이어 위치만 이동시킵니다. (Composite 단계만 수행)'
                    : `CPU가 ${count}개 요소의 레이아웃을 매 프레임 다시 계산합니다. (Reflow 발생)`}
                </div>
            </div>

            {/* Stage */}
            <div
                ref={containerRef}
                className="relative h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-slate-900/5"
            >
                {isPending && (
                    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                        <div className="text-xl font-bold">Optimizing...</div>
                    </div>
                )}

                <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-300 font-mono border border-white/10">
                    Items: {count}
                </div>

                <TestItemLayer isOptimized={isOptimized} count={count} />
            </div>
        </div>
    );
};

export default ReflowRepaint;