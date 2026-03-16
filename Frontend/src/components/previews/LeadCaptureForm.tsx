import React from 'react';
import { User, Mail, ArrowRight } from 'lucide-react';

interface LeadCaptureFormProps {
    brandColor: string;
    leadForm: {
        name: string;
        email: string;
    };
    setLeadForm: React.Dispatch<React.SetStateAction<{ name: string; email: string }>>;
    onSubmit: (e: React.FormEvent) => void;
    infoText?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
    brandColor,
    leadForm,
    setLeadForm,
    onSubmit,
    infoText = "Information provided is used to grant access to the requested content."
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                <p className="text-xs text-slate-500 font-bold text-center mb-4 uppercase ">Complete to View Content</p>

                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Your Full Name"
                        required
                        className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={leadForm.name}
                        onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={leadForm.email}
                        onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    />
                </div>
            </div>

            <button
                type="submit"
                style={{ backgroundColor: brandColor }}
                className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase  shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
                Access Content <ArrowRight className="w-5 h-5" />
            </button>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <p className="text-[10px] text-slate-500 font-medium">{infoText}</p>
            </div>
        </form>
    );
};
