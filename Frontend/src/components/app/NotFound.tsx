import React from 'react';
import { AlertCircle, Home } from 'lucide-react';

interface NotFoundProps {
    setView: (view: any) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ setView }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-red-100 rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-xl shadow-red-500/10">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tight">404</h1>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    The requested URL was not found on this server. It might have been moved or doesn't exist anymore.
                </p>

                <button
                    onClick={() => setView('login')}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};
