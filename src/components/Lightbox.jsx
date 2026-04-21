import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const resolvePath = (path) => {
  if (!path || path.startsWith('http')) return path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (path.startsWith(base)) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function Lightbox({ src, caption, onClose, onPrev, onNext, isVideo, driveFallback }) {
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

  const resolvedSrc = resolvePath(src);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-[10000] flex items-center justify-center bg-[#050806]/98 backdrop-blur-xl"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
      onClick={onClose}
    >
      <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-between px-6" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-light max-w-md truncate text-ink-light">{caption}</p>
          {driveFallback && (
            <a 
              href={driveFallback} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[0.6rem] uppercase tracking-widest text-accent hover:text-accent-deep transition-colors flex items-center gap-1.5"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              Mirror: Google Drive (Original Quality)
            </a>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="text-3xl text-paper hover:text-accent transition-colors w-10 h-10 flex items-center justify-center"
        >
          &times;
        </button>
      </div>
      
      <div className="flex items-center justify-center p-12 pt-14" onClick={e => e.stopPropagation()}>
        {isVideo ? (
          <video 
            src={resolvedSrc} 
            controls 
            autoPlay 
            className="max-h-[80vh] max-w-[75vw] rounded-sm shadow-2xl overflow-hidden" 
            onClick={e => e.stopPropagation()}
            style={{ borderRadius: '4px', background: '#000' }}
          />
        ) : (
          <img 
            src={resolvedSrc} 
            alt={caption} 
            decoding="async"
            style={{ maxHeight: '80vh', maxWidth: '75vw' }}
            className="object-contain rounded-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        )}
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
    </motion.div>,
    document.body
  );
}
