import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useImageLoader } from '../hooks/useImageLoader';

const resolvePath = (path) => {
  if (!path || path.startsWith('http')) return path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (path.startsWith(base)) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function ImageCard({ src, caption, index, onClick, isDoc, isVideo, driveFallback, badge, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });
  const resolvedSrc = resolvePath(src);
  const imgState = useImageLoader((isDoc || isVideo) ? null : resolvedSrc, inView);

  // Skip unsupported file formats (unless they are marked as documents or videos)
  const ext = src.split('.').pop().toLowerCase();
  if (!isDoc && !isVideo && ['psd', 'zip', 'rar', 'ai', 'sketch', 'pdf', 'mp4', 'mov'].includes(ext)) {
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
      onClick={() => onClick && onClick({ src: resolvedSrc, caption, isDoc, isVideo, driveFallback })}
    >
      <div className="aspect-[3/2] overflow-hidden relative bg-paper-dark">
        {/* Badge in top corner */}
        {badge && (
          <div className="absolute top-2 right-2 z-20 px-2 py-1 text-[0.5rem] uppercase tracking-widest font-mono text-[#f5f5f0] bg-[#2d5a3d]/80 backdrop-blur-sm rounded-sm">
            {badge}
          </div>
        )}
        
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
        ) : isVideo ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="mb-4 transition-transform duration-500 group-hover:scale-110">
              <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center bg-accent/10 backdrop-blur-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-accent ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.2em] font-display mb-1 text-accent/50">Video Production</div>
            <div className="text-[0.6rem] font-mono opacity-30 text-accent">MP4</div>
            
            {/* Subtle background flair */}
            <div className="absolute inset-0 -z-10 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
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
                src={resolvedSrc} 
                alt={caption} 
                loading="lazy" 
                decoding="async"
                className={`w-full h-full object-cover transition-all duration-700 ${imgState === 'loaded' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'}`}
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
