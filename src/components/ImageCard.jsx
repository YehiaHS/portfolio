import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useImageLoader } from '../hooks/useImageLoader';

export default function ImageCard({ src, caption, index, onClick, isDoc, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });
  const imgState = useImageLoader(isDoc ? null : src, inView);

  // Skip unsupported file formats (unless they are marked as documents)
  const ext = src.split('.').pop().toLowerCase();
  if (!isDoc && ['psd', 'zip', 'rar', 'ai', 'sketch', 'pdf'].includes(ext)) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
      className={`group relative overflow-hidden rounded-sm border ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={style}
      onClick={() => onClick && onClick({ src, caption })}
    >
      <div className="aspect-[3/2] overflow-hidden relative bg-paper-dark">
        {isDoc ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="mb-4 opacity-20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.2em] font-display mb-1" style={{ color: '#2d5a3d40' }}>Research Paper</div>
            <div className="text-[0.6rem] font-mono opacity-30" style={{ color: '#2d5a3d' }}>{ext.toUpperCase()}</div>
          </div>
        ) : (
          <>
            {(imgState === 'loading' || imgState === 'idle') && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-accent/20 border-t-accent/60 rounded-full animate-spin" />
              </div>
            )}
            {imgState !== 'error' && (
              <img 
                src={src} 
                alt={caption} 
                loading="lazy" 
                decoding="async"
                style={{ display: imgState === 'loaded' ? 'block' : 'none' }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            )}
          </>
        )}
      </div>
      
      {/* Overlay Caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end pointer-events-none">
        <p className="p-4 text-[#f5f5f0] text-sm font-light leading-snug">{caption}</p>
      </div>
    </motion.div>
  );
}
