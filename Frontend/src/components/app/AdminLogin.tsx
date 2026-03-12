import React, { useState } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
    setView: React.Dispatch<React.SetStateAction<any>>;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, simple transition
        if (email && password) {
            setView('admin_dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-red-500/10 border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>

                    <h1 className="text-2xl font-black text-slate-800 text-center mb-2 ">System Admin</h1>
                    <p className="text-sm text-slate-500 text-center font-medium mb-8">Authorized personnel only</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black capitalize text-slate-400  pl-1 mb-1 block">Admin Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all"
                                placeholder="admin@scannerstudio.co"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black capitalize text-slate-400  pl-1 mb-1 block">Security Key</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-[11px] capitalize  py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            Authenticate <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <button
                            onClick={() => setView('landing')}
                            className="w-full text-[10px] font-bold text-slate-400 capitalize  hover:text-slate-600 transition-colors"
                        >
                            Return to Public Site
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
