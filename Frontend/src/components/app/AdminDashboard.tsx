import React from 'react';
import { LayoutDashboard, Users, Database, LogOut, Settings } from 'lucide-react';

interface AdminDashboardProps {
    setView: React.Dispatch<React.SetStateAction<any>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md shadow-red-600/20">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-black text-slate-800 tracking-tight leading-none text-lg">Scanner <span className="text-red-600">Admin</span></h1>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Control Panel</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-lg">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setView('admin_login')}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">

                    {/* Welcome Header */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Overview</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Monitor all platform metrics and users globally.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Users</p>
                                <p className="text-2xl font-black text-slate-800 tabular-nums">0</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Generated QR Codes</p>
                                <p className="text-2xl font-black text-slate-800 tabular-nums">0</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Health</p>
                                <p className="text-2xl font-black text-slate-800">100%</p>
                            </div>
                        </div>
                    </div>

                    {/* Empty State Body */}
                    <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 flex flex-col items-center justify-center text-center mt-8">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Database className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Awaiting Backend Data Integration</h3>
                        <p className="text-sm font-medium text-slate-400 max-w-md mt-2">
                            This dashboard is currently running in UI mode. Real user statistics and QR tables will appear here once connected to the Django Admin API.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
