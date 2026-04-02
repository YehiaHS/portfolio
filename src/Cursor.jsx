import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const ACCENT = '#2d5a3d';
const NEUTRAL = '#0d1a0f';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'label',
  'select',
  'textarea',
  '[data-cursor]',
].join(', ');

function useAnimationFrame(callback, active = true) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;
    let frameId;
    const tick = () => {
      savedCallback.current();
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active]);
}

const Cursor = () => {
  const [visible, setVisible] = useState(false);
  const [hoverState, setHoverState] = useState('default');
  const [clickRipple, setClickRipple] = useState(false);

  const posX = useRef(0);
  const posY = useRef(0);
  const mouseDown = useRef(false);

  const hoverTarget = useRef(null);
  const targetBounds = useRef(null);
  const magneticStrength = useRef(0.35);

  // Spring targets
  const ringTargetX = useRef(0);
  const ringTargetY = useRef(0);
  const dotTargetX = useRef(0);
  const dotTargetY = useRef(0);

  // Framer springs — ring is lax, dot is tight
  const ringX = useSpring(0, { stiffness: 120, damping: 18, mass: 0.35 });
  const ringY = useSpring(0, { stiffness: 120, damping: 18, mass: 0.35 });
  const dotX = useSpring(0, { stiffness: 400, damping: 22, mass: 0.12 });
  const dotY = useSpring(0, { stiffness: 400, damping: 22, mass: 0.12 });

  // Trailing secondary dot — follows with extra lag
  const trailX = useSpring(0, { stiffness: 60, damping: 14, mass: 0.6 });
  const trailY = useSpring(0, { stiffness: 60, damping: 14, mass: 0.6 });

  // Ring size
  const ringSize = useSpring(40, { stiffness: 200, damping: 24, mass: 0.15 });
  const ringOpacity = useSpring(1, { stiffness: 300, damping: 24 });

  const handleMouseMove = useCallback((e) => {
    posX.current = e.clientX;
    posY.current = e.clientY;
    if (!visible) setVisible(true);
  }, [visible]);

  const handleMouseLeave = useCallback(() => setVisible(false), []);
  const handleMouseEnter = useCallback(() => setVisible(true), []);

  const handleMouseDown = useCallback(() => {
    mouseDown.current = true;
    setClickRipple(true);
    setTimeout(() => setClickRipple(false), 400);
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseDown.current = false;
  }, []);

  // Detect hover target and classify
  const handleMouseOver = useCallback((e) => {
    const target = e.target.closest?.(INTERACTIVE_SELECTOR) || e.target;
    if (!target || !target.getBoundingClientRect) {
      setHoverState('default');
      hoverTarget.current = null;
      targetBounds.current = null;
      return;
    }

    hoverTarget.current = target;
    const rect = target.getBoundingClientRect();
    targetBounds.current = {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };

    const tag = target.tagName;
    const isText = tag === 'P' || tag === 'SPAN' || tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4' || target.getAttribute('data-cursor') === 'text';
    const isLink = tag === 'A' || tag === 'BUTTON' || target.getAttribute('role') === 'button' || target.getAttribute('data-cursor') === 'link';
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.getAttribute('data-cursor') === 'input';

    if (isText) {
      setHoverState('text');
    } else if (isLink) {
      setHoverState('link');
    } else if (isInput) {
      setHoverState('link');
    } else {
      setHoverState('default');
    }
  }, []);

  // Animation loop: apply magnetic attraction + drive springs
  useAnimationFrame(() => {
    let tx = posX.current;
    let ty = posY.current;

    // Magnetic snap
    if (hoverTarget.current && targetBounds.current) {
      const b = targetBounds.current;
      const strength = magneticStrength.current;

      // Only apply within a generous radius of the element
      const distX = Math.abs(posX.current - b.centerX);
      const distY = Math.abs(posY.current - b.centerY);
      const thresholdX = b.width * 0.7;
      const thresholdY = b.height * 0.7;

      if (distX < thresholdX && distY < thresholdY) {
        const easeX = 1 - distX / thresholdX;
        const easeY = 1 - distY / thresholdY;
        const ease = Math.max(easeX, easeY);
        const pull = ease * strength;

        tx = posX.current + (b.centerX - posX.current) * pull;
        ty = posY.current + (b.centerY - posY.current) * pull;
      }
    }

    dotTargetX.current = tx;
    dotTargetY.current = ty;

    // Ring follows a bit further behind the dot
    ringTargetX.current = tx;
    ringTargetY.current = ty;

    dotX.set(tx);
    dotY.set(ty);
    ringX.set(tx);
    ringY.set(ty);
    trailX.set(tx);
    trailY.set(ty);

    // Ring size
    switch (hoverState) {
      case 'text':
        ringSize.set(56);
        ringOpacity.set(0.5);
        break;
      case 'link':
        ringSize.set(52);
        ringOpacity.set(1);
        break;
      default:
        ringSize.set(40);
        ringOpacity.set(mouseDown.current ? 0.3 : 0.7);
        break;
    }
  }, visible);

  const isHovering = hoverState !== 'default';
  const color = isHovering ? ACCENT : NEUTRAL;
  const borderColor = isHovering ? ACCENT : `${NEUTRAL}26`;

  return (
    <>
      <style>{`
        *, *::before, *::after { cursor: none !important; }
      `}</style>

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1px solid ${borderColor}`,
          mixBlendMode: 'difference',
          opacity: ringOpacity,
          transform: `translate(-50%, -50%)`,
          transition: 'border-color 0.25s ease',
        }}
      />

      {/* Inner dot (fast) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
          mixBlendMode: 'difference',
          opacity: visible ? 1 : 0,
          transform: 'translate(-50%, -50%)',
          transition: 'background-color 0.25s ease',
        }}
      />

      {/* Trailing dot (slow) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{
          x: trailX,
          y: trailY,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: isHovering ? ACCENT : `${NEUTRAL}40`,
          opacity: visible ? 0.5 : 0,
          transform: 'translate(-50%, -50%)',
          transition: 'background-color 0.25s ease',
        }}
      />

      {/* Text preview label — appears on hover over links */}
      {hoverState === 'link' && hoverTarget.current && targetBounds.current && (
        <motion.div
          className="pointer-events-none fixed z-[9999] hidden md:block"
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            left: ringX.get(),
            top: ringY.get() + (ringSize.get() || 40) / 2 + 12,
            transform: 'translateX(-50%)',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: ACCENT,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.92)',
              padding: '3px 8px',
              borderRadius: '4px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            {hoverTarget.current.textContent?.trim().slice(0, 30) || 'link'}
          </span>
        </motion.div>
      )}

      {/* Click ripple */}
      {clickRipple && (
        <motion.div
          className="pointer-events-none fixed z-[9997] hidden md:block"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            left: posX.current,
            top: posY.current,
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: `2px solid ${ACCENT}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Invisible hit-area listeners */}
      <div
        className="hidden md:block"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          pointerEvents: 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
      />
      {/* Real listeners on the document for hover detection */}
      <ListenerInstaller
        onMouseOver={handleMouseOver}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};

/* Small helper to bind document-level listeners */
function ListenerInstaller({ onMouseOver, onMouseMove, onMouseDown, onMouseUp }) {
  useEffect(() => {
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseOver, onMouseMove, onMouseDown, onMouseUp]);
  return null;
}

export default Cursor;
