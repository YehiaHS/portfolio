import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useImageLoader } from '../hooks/useImageLoader';

export default function ImageCard({ src, caption, index, onClick, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });
  const imgState = useImageLoader(src, inView);

  // Skip unsupported file formats
  const ext = src.split('.').pop().toLowerCase();
  if (['psd', 'zip', 'rar', 'ai', 'sketch'].includes(ext)) {
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
      </div>
      
      {/* Overlay Caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end pointer-events-none">
        <p className="p-4 text-[#f5f5f0] text-sm font-light leading-snug">{caption}</p>
      </div>
    </motion.div>
  );
}
