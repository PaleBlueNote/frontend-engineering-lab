import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Microscope } from 'lucide-react';
import { EXPERIMENT_CATEGORIES } from '../constants/experiments';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative py-16 md:py-10">
                <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative space-y-4 md:space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
                        <Microscope size={16} className="mr-2" />
                        CS x Frontend Engineering
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        From Guessing<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              To Measuring
            </span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        React 렌더링, 클로저, 이벤트 루프, 상태 관리 — 면접에서 자주 나오는 주제들을
                        <strong> 코드로 직접 구현하고 측정</strong>하는 프론트엔드 엔지니어링 랩입니다.
                    </p>
                </div>
            </section>

            {/* Dashboard Grid */}
            <section className="grid gap-8">
                {EXPERIMENT_CATEGORIES.map((category) => (
                    <div key={category.id} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <h2 className="text-xl font-bold text-slate-800">{category.title}</h2>
                            <span className="text-sm text-slate-500">{category.description}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {category.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(item.path)}
                                        className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors"></div>

                                        <div className="relative z-10">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                                                item.status === 'ready' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                <Icon size={24} />
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                View Experiment <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Home;