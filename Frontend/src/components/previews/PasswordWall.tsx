import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface PasswordWallProps {
    brandColor: string;
    onSubmit: (password: string) => Promise<boolean> | boolean;
    infoText?: string;
}

export const PasswordWall: React.FC<PasswordWallProps> = ({
    brandColor,
    onSubmit,
    infoText = "This document is password protected. Please enter the correct password to gain access."
}) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onSubmit(password);
        if (!success) {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={`space-y-4 p-6 rounded-3xl border transition-all duration-300 ${error ? 'bg-red-50 border-red-200 shadow-lg shadow-red-200/20' : 'bg-slate-50/50 border-slate-100 shadow-inner'}`}>
                <div className="flex flex-col items-center gap-2 mb-2">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 ${error ? 'bg-red-100' : 'bg-white shadow-sm border border-slate-100'}`}>
                        <Lock className={`w-5 h-5 ${error ? 'text-red-600' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-wider ${error ? 'text-red-600' : 'text-slate-500'}`}>
                        {error ? 'Invalid Password' : 'Password Required'}
                    </p>
                </div>

                <div className="relative group">
                    <input
                        type="password"
                        placeholder="Enter password..."
                        required
                        autoFocus
                        className={`w-full px-6 py-4 bg-white rounded-2xl border text-center text-sm font-bold tracking-[0.2em] focus:ring-4 outline-none transition-all shadow-sm ${error ? 'border-red-300 focus:ring-red-500/10 text-red-600' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'}`}
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                            if (error) setError(false);
                        }}
                    />
                </div>

                {error && (
                    <p className="text-[9px] text-red-500 font-bold text-center animate-bounce flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" /> The password is not correct
                    </p>
                )}
            </div>

            <button
                type="submit"
                style={{ backgroundColor: error ? '#ef4444' : brandColor }}
                className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
                Verify & Open <ArrowRight className="w-5 h-5" />
            </button>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{infoText}</p>
            </div>
        </form>
    );
};
