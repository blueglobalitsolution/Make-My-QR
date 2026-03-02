import React from 'react';
import { Barcode } from 'lucide-react';

interface LandingProps {
  setView: (view: any) => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 40px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(255,255,255,0.72)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setView('landing')}>
          <div className="skeu-hero-icon" style={{ padding: '6px', borderRadius: '10px', position: 'relative' }}>
            <Barcode className="text-white" style={{ width: '22px', height: '22px' }} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.025em', margin: 0 }} className="skeu-text-primary">
            QR <span className="skeu-text-accent">code.io</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setView('auth')}
            style={{
              padding: '10px 28px',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#156295',
              background: 'transparent',
              border: '2px solid #156295',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#156295'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#156295'; }}
          >
            Login
          </button>
          <button
            onClick={() => setView('register')}
            style={{
              padding: '10px 28px',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #156295 0%, #4A9FF5 100%)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 98, 149, 0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(21, 98, 149, 0.45)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(21, 98, 149, 0.35)'; }}
          >
            Sign Up
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="skeu-hero-icon p-5 rounded-[2.5rem] mb-10 transform -rotate-6 relative skeu-gloss"><Barcode className="text-white w-16 h-16" /></div>
        <h1 className="text-8xl font-black skeu-text-primary tracking-tighter mb-8 leading-[0.9]">The Ultimate <br /><span className="skeu-text-accent">Secure QR</span> <br />Experience</h1>
        <button onClick={() => setView('auth')} className="skeu-btn px-14 py-6 rounded-[2rem] text-2xl">Launch Studio</button>
      </div>
    </div>
  );
};
