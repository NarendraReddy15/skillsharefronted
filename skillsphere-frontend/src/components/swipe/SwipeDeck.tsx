import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from '@/types';
import SwipeCard from './SwipeCard';

interface Props {
  users: User[];
  onSwipe: (userId: string, dir: 'left' | 'right') => Promise<void>;
  onEmpty: () => void;
}

export default function SwipeDeck({ users, onSwipe, onEmpty }: Props) {
  const [deck, setDeck] = useState(users);

  useEffect(() => { setDeck(users); }, [users]);

  const handleSwipe = async (dir: 'left' | 'right') => {
    if (!deck.length) return;
    const current = deck[deck.length - 1];
    await onSwipe(current._id, dir);
    const next = deck.slice(0, -1);
    setDeck(next);
    if (next.length === 0) onEmpty();
  };

  return (
    <div className="relative w-full" style={{ height: 500 }}>
      <AnimatePresence>
        {deck.slice(-3).map((user, idx, arr) => (
          <SwipeCard
            key={user._id}
            user={user}
            isTop={idx === arr.length - 1}
            onSwipe={handleSwipe}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
