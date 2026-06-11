import type { Variants } from 'framer-motion';

export const EASE = [0.25, 0.46, 0.45, 0.94] as const;
export const EASE_BACK = [0.34, 1.56, 0.64, 1] as const;

// Page-level enter / exit
export const PAGE: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.22 } },
};

// Stagger container — wrap a list with this then use ITEM on children
export const STAGGER: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};

// Stagger child — fade up
export const ITEM: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

// Stagger child — fade from left
export const ITEM_LEFT: Variants = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
};

// Stagger child — scale up
export const ITEM_SCALE: Variants = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } },
};

// Modal / overlay
export const OVERLAY: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const MODAL: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
};

// Chat message bubble
export const MSG: Variants = {
  initial: { opacity: 0, y: 6, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: EASE } },
};

// Inline helpers for whileHover / whileTap
export const HOVER_LIFT = { y: -3, transition: { duration: 0.15, ease: EASE } };
export const HOVER_SCALE = { scale: 1.02, transition: { duration: 0.15 } };
export const TAP = { scale: 0.97, transition: { duration: 0.1 } };
