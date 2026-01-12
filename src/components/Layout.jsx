import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, FlaskConical, ChevronRight, Github, Mail } from 'lucide-react'; // Mail 아이콘 추가
import { EXPERIMENT_CATEGORIES } from '../constants/experiments';
import { clsx } from 'clsx';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear(); // 현재 연도 자동 계산

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gray-50 text-slate-800 font-sans overflow-hidden">

            {/* 📱 Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 px-4 h-16 flex items-center justify-between shadow-sm">
                <div
                    className="flex items-center font-bold text-slate-800 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <FlaskConical className="w-6 h-6 mr-2 text-blue-600" />
                    <span className="tracking-tight">FE Lab</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* 🌑 Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            {/* 🧊 Sidebar Navigation */}
            <aside
                className={clsx(
                    "fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Sidebar Header */}
                <div
                    className="h-16 flex items-center px-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => { navigate('/'); closeSidebar(); }}
                >
                    <FlaskConical className="w-6 h-6 mr-3 text-blue-600" />
                    <div>
                        <h1 className="font-bold text-lg text-slate-900 tracking-tight">FE Eng. Lab</h1>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Experimental Research</p>
                    </div>
                </div>

                {/* Navigation List */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
                    {EXPERIMENT_CATEGORIES.map((category) => (
                        <div key={category.id}>
                            <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                {category.title}
                            </h3>
                            <div className="space-y-1">
                                {category.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <NavLink
                                            key={item.id}
                                            to={item.path}
                                            onClick={closeSidebar}
                                            className={({ isActive }) => clsx(
                                                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative",
                                                isActive
                                                    ? "bg-blue-50 text-blue-700 shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <Icon size={18} className={clsx("mr-3", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                                                    <span className="flex-1">{item.title}</span>
                                                    {isActive && <ChevronRight size={16} className="text-blue-500 animate-in slide-in-from-left-1" />}

                                                    {item.status === 'coming' && !isActive && (
                                                        <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded ml-2">WIP</span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer (GitHub Link) */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <a
                        href="https://github.com/PaleBlueNote/frontend-engineering-lab"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-slate-900 transition-colors shadow-sm"
                    >
                        <Github size={16} className="mr-2" />
                        GitHub Repository
                    </a>
                </div>
            </aside>

            {/* 🖥️ Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                {/* Top Header */}
                <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
                        {location.pathname !== '/' && (
                            <>
                                <ChevronRight size={14} className="mx-2 text-slate-300" />
                                <span className="font-medium text-slate-800">
                   {EXPERIMENT_CATEGORIES.flatMap(c => c.items).find(i => i.path === location.pathname)?.title || 'Current Experiment'}
                 </span>
                            </>
                        )}
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto flex flex-col scroll-smooth">
                    {/* Outlet Wrapper */}
                    <div className="flex-1 p-4 md:p-8 lg:p-12 max-w-5xl mx-auto w-full animate-in fade-in duration-500 slide-in-from-bottom-2">
                        <Outlet />
                    </div>

                    <footer className="mt-auto border-t border-gray-200 bg-white/50 py-8">
                        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-slate-500">
                                © {currentYear} <strong>Yoonseokchan</strong>. All rights reserved.
                            </div>

                            <div className="flex items-center gap-6">
                                <a
                                    href="mailto:yoonseokchan0731@gmail.com"
                                    className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                    <Mail size={16} className="mr-2" />
                                    Contact
                                </a>
                                <a
                                    href="https://github.com/PaleBlueNote"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                    <Github size={16} className="mr-2" />
                                    @PaleBlueNote
                                </a>
                            </div>
                        </div>
                    </footer>

                </div>
            </main>
        </div>
    );
};

export default Layout;