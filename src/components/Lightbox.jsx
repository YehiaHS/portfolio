import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Lightbox({ src, caption, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { 
      window.removeEventListener('keydown', onKey); 
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050806]/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-between px-6" onClick={e => e.stopPropagation()}>
        <p className="text-sm font-light max-w-md truncate text-ink-light">{caption}</p>
        <button 
          onClick={onClose} 
          className="text-3xl text-paper hover:text-accent transition-colors w-10 h-10 flex items-center justify-center"
        >
          &times;
        </button>
      </div>
      
      <div className="flex items-center justify-center p-12 pt-14" onClick={e => e.stopPropagation()}>
        <img 
          src={src} 
          alt={caption} 
          decoding="async"
          style={{ maxHeight: '80vh', maxWidth: '75vw' }}
          className="object-contain rounded-sm shadow-2xl"
          onClick={e => e.stopPropagation()}
        />
      </div>
      
      {onPrev && (
        <button 
          onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-5xl text-paper opacity-40 hover:opacity-100 transition-opacity z-20"
        >
          &larr;
        </button>
      )}
      
      {onNext && (
        <button 
          onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl text-paper opacity-40 hover:opacity-100 transition-opacity z-20"
        >
          &rarr;
        </button>
      )}
    </motion.div>
  );
}
