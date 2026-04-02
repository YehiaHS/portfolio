import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => {
      const isHoverable = e.target.closest?.('a, button, [role="button"], input, label, select, textarea') || ['A', 'BUTTON', 'LABEL'].includes(e.target.tagName);
      setHovering(!!isHoverable);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  }, []);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          width: hovering ? 48 : 40,
          height: hovering ? 48 : 40,
          borderColor: hovering ? '#f5a623' : 'rgba(232,230,225,0.25)',
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.1 }}
        style={{ borderRadius: '50%', borderWidth: '1px', borderStyle: 'solid' }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        animate={{
          x: pos.x - 2,
          y: pos.y - 2,
          scale: hovering ? 1.5 : 1,
          backgroundColor: hovering ? '#f5a623' : 'rgba(232,230,225,0.6)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.08 }}
        style={{ width: 4, height: 4, borderRadius: '50%' }}
      />
    </>
  );
};

export default Cursor;
