import React, { useState, useEffect, useRef } from 'react';
import Stats from 'stats.js';
import { Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Cpu, Zap, Loader2 } from 'lucide-react';

const ITEM_COUNT = 3000;

const ReflowRepaint = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isOptimized, setIsOptimized] = useState(false); // false: CPU, true: GPU
    const [isSwitching, setIsSwitching] = useState(false); // 전환 애니메이션 상태

    const containerRef = useRef(null);
    const requestRef = useRef();
    const statsRef = useRef(null);

    // 1. Stats.js 초기화
    useEffect(() => {
        if (!statsRef.current && containerRef.current) {
            const stats = new Stats();
            stats.showPanel(0); // FPS
            stats.dom.style.position = 'absolute';
            stats.dom.style.top = '10px';
            stats.dom.style.left = '10px';
            stats.dom.style.zIndex = '20';
            containerRef.current.appendChild(stats.dom);
            statsRef.current = stats;
        }
    }, []);

    // 2. 엔진 모드 변경 핸들러 (전환 효과 추가)
    const handleModeToggle = () => {
        if (isSwitching) return;

        setIsSwitching(true);
        setIsRunning(false);
        setIsOptimized((prev) => !prev);
        setIsSwitching(false);
    };

    // 3. 애니메이션 루프
    const animate = (time) => {
        if (statsRef.current) statsRef.current.begin();

        const items = document.getElementsByClassName('test-item');
        // 0 ~ 300px 사이 왕복 운동
        const position = (Math.sin(time / 500) + 1) * 150;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (isOptimized) {
                // ✅ GPU: transform
                item.style.transform = `translateX(${position}px)`;
            } else {
                // ❌ CPU: left
                item.style.left = `${position}px`;
            }
        }

        if (statsRef.current) statsRef.current.end();
        requestRef.current = requestAnimationFrame(animate);
    };

    // 실행/중지 컨트롤
    useEffect(() => {
        if (isRunning && !isSwitching) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isRunning, isOptimized, isSwitching]);

    return (
        <div className="space-y-6">
            {/* 🎛️ Header & Controls */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
                            Reflow vs Repaint
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                Day 1
              </span>
                        </h2>
                        <p className="text-gray-500 mt-1">
                            CSS 속성에 따른 렌더링 파이프라인 부하 차이를 비교합니다.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Play/Pause Button */}
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            disabled={isSwitching}
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
                            title="Reset"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* 🕹️ Toggle Switch UI (New) */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
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

                    {/* Custom Toggle Switch */}
                    <button
                        onClick={handleModeToggle}
                        disabled={isSwitching}
                        className={`relative w-64 h-12 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer shadow-inner ${
                            isOptimized ? 'bg-green-500' : 'bg-red-400'
                        }`}
                    >
                        <div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-bold text-white pointer-events-none uppercase tracking-wider">
                            <span>Slow (CPU)</span>
                            <span>Fast (GPU)</span>
                        </div>
                        <div
                            className={`absolute top-1 bottom-1 w-[48%] bg-white rounded-full shadow-md transform transition-transform duration-300 ease-out flex items-center justify-center ${
                                isOptimized ? 'translate-x-[104%]' : 'translate-x-0'
                            }`}
                        >
                            {isSwitching ? (
                                <Loader2 size={16} className="animate-spin text-gray-400" />
                            ) : (
                                <div className={`w-2 h-8 rounded-full ${isOptimized ? 'bg-green-500' : 'bg-red-400'}`} />
                            )}
                        </div>
                    </button>
                </div>

                {/* Info Box */}
                <div className={`p-4 rounded-lg border text-sm transition-colors duration-300 ${isOptimized ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <strong>💡 이론:</strong> {isOptimized
                    ? 'transform 속성은 메인 스레드의 레이아웃 계산(Reflow)을 건너뛰고, GPU가 처리하는 합성(Composite) 단계만 수행합니다.'
                    : 'left/top 속성을 변경하면 브라우저가 모든 픽셀의 위치를 재계산(Reflow)하느라 CPU 자원을 심하게 소모합니다.'}
                </div>
            </div>

            {/* Animation Stage */}
            <div
                ref={containerRef}
                className="relative h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-slate-900/5"
            >
                {/* Loading Overlay */}
                {isSwitching && (
                    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                        <div className="text-xl font-bold">Switching Rendering Engine...</div>
                        <div className="text-sm text-slate-400 mt-2">Flush Layout Cache & Optimizing Layers</div>
                    </div>
                )}

                <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-300 font-mono border border-white/10">
                    Object Count: {ITEM_COUNT}
                </div>

                {/* Test Items */}
                {Array.from({ length: ITEM_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        className="test-item absolute w-6 h-6 rounded-full shadow-lg"
                        style={{
                            top: `${Math.random() * 90 + 5}%`, // 상하 여백 둠
                            left: '50px',
                            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                            willChange: isOptimized ? 'transform' : 'auto',
                            opacity: 0.8
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReflowRepaint;