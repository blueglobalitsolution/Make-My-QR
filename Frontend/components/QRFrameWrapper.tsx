import React from 'react';
import { Mail as MailIcon, Bike, Hand } from 'lucide-react';
import { FrameType } from '../types';
import { getFrameConfig } from '../src/utils/qrCaptureUtils';

export const QRFrameWrapper: React.FC<{ frame: FrameType; children: React.ReactNode }> = ({ frame, children }) => {
    const config = getFrameConfig(frame);

    if (frame === 'none') return <div className="p-4 bg-white rounded-2xl">{children}</div>;

    const renderLabel = (text: string) => (
        <div className="w-full bg-black py-1.5 text-center">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{text}</span>
        </div>
    );

    switch (frame) {
        case 'basic-label':
            return (
                <div className="border-[3px] border-black flex flex-col items-center bg-white">
                    <div className="p-5">{children}</div>
                    {renderLabel(config.label || 'Scan Me!')}
                </div>
            );
        case 'rounded-label':
            return (
                <div className="border-[3px] border-black rounded-[2rem] overflow-hidden flex flex-col items-center bg-white">
                    <div className="p-5">{children}</div>
                    {renderLabel(config.label || 'Scan Me!')}
                </div>
            );
        case 'thick-label':
            return (
                <div className="border-[6px] border-black flex flex-col items-center bg-white">
                    <div className="p-5">{children}</div>
                    {renderLabel(config.label || 'Scan Me!')}
                </div>
            );
        case 'bubble':
            return (
                <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="bg-black text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest relative">
                        {config.label}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black"></div>
                    </div>
                    <div className="p-3 border-4 border-black rounded-[2.5rem] bg-white shadow-xl">{children}</div>
                </div>
            );
        case 'shopping':
            return (
                <div className="flex flex-col items-center mt-6">
                    <div className="w-16 h-8 border-[3px] border-black border-b-0 rounded-t-full mb-[-3px] z-10"></div>
                    <div className="border-[3px] border-black p-5 bg-white shadow-lg flex flex-col items-center rounded-sm">
                        {children}
                        <div className="mt-4 bg-black text-white px-4 py-1 rounded-sm text-[9px] font-black uppercase tracking-tighter">{config.label}</div>
                    </div>
                </div>
            );
        case 'gift':
            return (
                <div className="relative flex flex-col items-center mt-6">
                    <div className="absolute -top-6 flex gap-1 items-center justify-center z-20">
                        <div className="w-6 h-6 border-[3px] border-black rounded-full rotate-[-45deg] bg-white"></div>
                        <div className="w-6 h-6 border-[3px] border-black rounded-full rotate-[45deg] bg-white"></div>
                    </div>
                    <div className="border-[3px] border-black p-5 bg-white shadow-lg flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-black/10"></div>
                        <div className="relative z-10">{children}</div>
                        <div className="mt-3 bg-black text-white px-4 py-1 text-[9px] font-black uppercase">{config.label}</div>
                    </div>
                </div>
            );
        case 'mail':
            return (
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 border-[3px] border-black bg-white rounded-xl shadow-lg relative">
                        <div className="absolute top-0 left-0 w-full h-full border-b border-black/5 flex items-center justify-center opacity-5">
                            <MailIcon className="w-20 h-20" />
                        </div>
                        <div className="relative z-10">{children}</div>
                    </div>
                    <div className="bg-black text-white px-5 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
                        <MailIcon className="w-3 h-3" /> {config.label}
                    </div>
                </div>
            );
        case 'delivery':
            return (
                <div className="flex flex-col items-center">
                    <div className="p-4 border-[3px] border-black bg-white rounded-2xl shadow-lg">
                        {children}
                    </div>
                    <div className="mt-[-12px] bg-black text-white px-6 py-2 rounded-2xl text-[9px] font-black uppercase flex items-center gap-3 shadow-xl z-20">
                        <Bike className="w-4 h-4" /> {config.label}
                    </div>
                </div>
            );
        case 'service':
            return (
                <div className="flex flex-col items-center">
                    <div className="p-6 border-[3px] border-black bg-white rounded-full shadow-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black/5"></div>
                        <div className="relative z-10">{children}</div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="h-[2px] w-8 bg-black"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">{config.label}</span>
                        <div className="h-[2px] w-8 bg-black"></div>
                    </div>
                </div>
            );
        case 'hands':
            return (
                <div className="relative flex flex-col items-center">
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-black opacity-40"><Hand className="w-8 h-8 rotate-90" /></div>
                    <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-black opacity-40"><Hand className="w-8 h-8 -rotate-90" /></div>
                    <div className="p-5 border-2 border-slate-200 bg-white rounded-3xl shadow-sm">
                        {children}
                    </div>
                    <div className="mt-4 font-black text-[10px] uppercase tracking-[0.2em] text-black">{config.label}</div>
                </div>
            );
        case 'ribbon':
            return (
                <div className="flex flex-col items-center">
                    <div className="p-5 border-[3px] border-black bg-white">
                        {children}
                    </div>
                    <div className="mt-[-10px] relative w-full flex justify-center z-20">
                        <div className="bg-black text-white px-8 py-2 font-black text-[10px] uppercase tracking-[0.1em] shadow-xl">
                            {config.label}
                            <div className="absolute top-0 -left-2 h-full w-2 bg-black/80 skew-y-[20deg] origin-right"></div>
                            <div className="absolute top-0 -right-2 h-full w-2 bg-black/80 skew-y-[-20deg] origin-left"></div>
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className="p-4 bg-white rounded-2xl">{children}</div>;
    }
};
