import React, { useState, useEffect, useRef, useTransition } from 'react';
import Stats from 'stats.js';
import { Play, Pause, RefreshCw, Zap, Cpu, Loader2, Github, BookOpen, Settings } from 'lucide-react';
import { getExperimentById } from '../../../constants/experiments';

const EXPERIMENT_ID = 'reflow-repaint';

// React.memo로 최적화된 아이템 레이어
const TestItemLayer = React.memo(({ isOptimized, count }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="test-item absolute w-8 h-8 rounded-full shadow-lg border border-white/20"
                    style={{
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
    return prevProps.isOptimized === nextProps.isOptimized && prevProps.count === nextProps.count;
});

const ReflowRepaint = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isOptimized, setIsOptimized] = useState(false);
    const [count, setCount] = useState(1000);
    const [isPending, startTransition] = useTransition();

    const containerRef = useRef(null);
    const requestRef = useRef();
    const statsRef = useRef(null);

    const experimentData = getExperimentById(EXPERIMENT_ID);
    const docsLinks = experimentData?.docs || [];

    // ✅ [Fix] Stats.js 위치 버그 수정
    useEffect(() => {
        if (containerRef.current && !statsRef.current) {
            const stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms
            stats.dom.style.cssText = 'position:absolute;top:0px;left:0px;z-index:50;cursor:pointer;opacity:0.9;';
            containerRef.current.appendChild(stats.dom);
            statsRef.current = stats;
        }
        return () => {
            if (statsRef.current && statsRef.current.dom) {
                statsRef.current.dom.remove();
                statsRef.current = null;
            }
        };
    }, []);

    const handleModeToggle = () => {
        if (isPending) return;
        setIsRunning(false);
        startTransition(() => {
            setIsOptimized((prev) => !prev);
        });
    };

    const handleCountChange = (e) => {
        const newCount = parseInt(e.target.value, 10);
        setIsRunning(false);
        startTransition(() => {
            setCount(newCount);
        });
    };

    const animate = (time) => {
        if (statsRef.current) statsRef.current.begin();
        const items = document.getElementsByClassName('test-item');

        if (items.length === 0) {
            requestRef.current = requestAnimationFrame(animate);
            return;
        }

        const position = (Math.sin(time / 500) + 1) * 200;

        for (let i = 0, len = items.length; i < len; i++) {
            const item = items[i];
            if (item) {
                if (isOptimized) {
                    item.style.transform = `translate3d(${position}px, 0, 0)`;
                } else {
                    item.style.left = `${position}px`;
                }
            }
        }

        if (statsRef.current) statsRef.current.end();
        requestRef.current = requestAnimationFrame(animate);
    };

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
            {/* 1. Header Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
                            Reflow vs Repaint
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                Day 1 & 2
                            </span>
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {experimentData?.description || "CSS 속성에 따른 렌더링 파이프라인 부하 차이 비교"}
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
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* Documentation Links */}
                {docsLinks.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                        {docsLinks.map((doc, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-sm hover:border-slate-300 transition-colors">
                                <span className="font-bold text-slate-600 bg-white px-1.5 rounded border border-slate-200 text-xs">{doc.day}</span>
                                <span className="text-slate-600 hidden sm:inline">{doc.title}</span>
                                <div className="h-4 w-px bg-slate-300 mx-1" />
                                <a
                                    href={doc.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-slate-500 hover:text-black transition-colors"
                                    title="View GitHub Issue"
                                >
                                    <Github size={14} />
                                </a>
                                <a
                                    href={doc.blog}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                                    title="Read Velog Post"
                                >
                                    <BookOpen size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Main Control Panel (Mode + Theory) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">

                    {/* Status Section */}
                    <div className="flex items-center gap-3 min-w-fit">
                        <div className={`p-2 rounded-lg ${isOptimized ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {isOptimized ? <Zap size={24} /> : <Cpu size={24} />}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">
                                {isOptimized ? 'GPU Accelerated' : 'CPU Software Mode'}
                            </div>
                            <div className="text-xs text-slate-500">
                                {isOptimized ? 'Composite Layer Only' : 'Triggers Reflow & Layout'}
                            </div>
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={handleModeToggle}
                        disabled={isPending}
                        className={`relative w-48 h-12 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer shadow-inner shrink-0 ${
                            isOptimized ? 'bg-green-500' : 'bg-red-400'
                        }`}
                    >
                        <div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-bold text-white pointer-events-none uppercase tracking-wider">
                            <span>Use CPU</span>
                            <span>Use GPU</span>
                        </div>
                        <div
                            className={`absolute top-1 bottom-1 w-[47%] bg-white rounded-full shadow-md transform transition-transform duration-200 ease-out flex items-center justify-center ${
                                isOptimized ? 'translate-x-[104%]' : 'translate-x-0'
                            }`}
                        >
                            {isPending ? (
                                <Loader2 size={16} className="animate-spin text-gray-400" />
                            ) : (
                                <div className={`w-2 h-8 rounded-full transition-colors duration-300 ease-in-out ${isOptimized ? 'bg-green-500' : 'bg-red-400'}`} />
                            )}
                        </div>
                    </button>
                </div>

                <div className={`p-4 rounded-lg border text-sm transition-colors duration-300 ${isOptimized ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <strong>💡 이론:</strong> {isOptimized
                    ? 'transform 속성은 메인 스레드의 레이아웃 계산(Reflow)을 건너뛰고, GPU가 처리하는 합성(Composite) 단계만 수행합니다.'
                    : 'left/top 속성을 변경하면 브라우저가 모든 픽셀의 위치를 재계산(Reflow)하느라 CPU 자원을 심하게 소모합니다.'}
                </div>
            </div>

            {/* 3. Object Count Panel (Separated Box) */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-semibold text-slate-600 min-w-fit">
                    <Settings size={18} className="text-slate-400" />
                    <span>Object Count:</span>
                    <span className="text-blue-600 font-bold font-mono">{count.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-4 w-full sm:max-w-md">
                    <span className="text-xs text-slate-400 font-medium">100</span>
                    <input
                        type="range"
                        min="100"
                        max="3000"
                        step="100"
                        value={count}
                        onChange={handleCountChange}
                        disabled={isPending}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                    />
                    <span className="text-xs text-slate-400 font-medium">3,000</span>
                </div>
            </div>

            {/* 4. Animation Stage (Relative Container) */}
            <div
                ref={containerRef}
                className="relative h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-slate-900/5"
            >
                {isPending && (
                    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                        <div className="text-xl font-bold">Optimizing Rendering...</div>
                        <div className="text-sm text-slate-400 mt-2">Processing {count} Items</div>
                    </div>
                )}

                <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-300 font-mono border border-white/10">
                    Object Count: {count}
                </div>

                <TestItemLayer isOptimized={isOptimized} count={count} />
            </div>
        </div>
    );
};

export default ReflowRepaint;