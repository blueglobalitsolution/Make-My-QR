import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  type?: 'danger' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md skeu-card p-10 bg-white animate-in zoom-in-95 duration-300 shadow-2xl overflow-hidden group">
        {/* Decorative background intensity */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all duration-700" />
        
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-xl skeu-btn-secondary hover:!bg-red-50 hover:!text-red-500 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center skeu-inset group-hover:scale-110 transition-transform duration-500 ${type === 'danger' ? 'bg-red-50' : 'bg-blue-50'}`}>
            {type === 'danger' ? (
              <Trash2 className="w-10 h-10 text-red-500" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-blue-500" />
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black skeu-text-primary tracking-tight leading-tight">{title}</h3>
            <p className="skeu-text-muted font-medium text-sm max-w-[280px] mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full pt-4">
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 skeu-btn-secondary py-4 text-xs font-black capitalize tracking-widest transition-all hover:scale-105 active:scale-95"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 text-xs font-black capitalize tracking-widest text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl ${type === 'danger' ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/20' : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
