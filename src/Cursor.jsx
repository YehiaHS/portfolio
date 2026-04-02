import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => {
      const target = e.target.closest?.('a, button, [role="button"], input, label, select, textarea') || e.target.tagName === 'A' || e.target.tagName === 'BUTTON';
      setHovering(!!target);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 rounded-full border-2 border-ink bg-brutalYellow/50 mix-blend-difference md:block"
      animate={{
        x: pos.x - 16,
        y: pos.y - 16,
        scale: hovering ? 2.5 : 1,
        backgroundColor: hovering ? '#FF007F' : '#CCFF00',
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    />
  );
};

export default Cursor;
