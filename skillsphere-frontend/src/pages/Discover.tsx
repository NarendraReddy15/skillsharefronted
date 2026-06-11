import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sliders, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import { User, SwipeResult } from '@/types';
import SwipeDeck from '@/components/swipe/SwipeDeck';
import { PAGE, EASE } from '@/lib/motion';

const Discover = () => {
  const [isEmpty, setIsEmpty] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ['discover'],
    queryFn: () => api.get('/users/discover').then(r => r.data),
    staleTime: 0,
  });

  const swipeMutation = useMutation({
    mutationFn: ({ targetId, direction }: { targetId: string; direction: 'left' | 'right' }) =>
      api.post('/swipe', { targetId, direction }).then(r => r.data as SwipeResult),
    onSuccess: data => {
      if (data.matched) {
        toast.custom(t => (
          <motion.div initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
            className={`${t.visible ? 'opacity-100' : 'opacity-0'} flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-white`}
            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="text-4xl">🎉</span>
            <div><p className="font-black text-lg">It's a Match!</p><p className="text-sm text-white/70">You can now chat together</p></div>
          </motion.div>
        ), { duration: 4000 });
        queryClient.invalidateQueries({ queryKey: ['matches'] });
      }
    },
  });

  const handleSwipe = (userId: string, direction: 'left' | 'right') =>
    swipeMutation.mutateAsync({ targetId: userId, direction });

  const handleRefresh = () => { setIsEmpty(false); refetch(); };

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-md mx-auto px-4 pt-8 pb-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Discover</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {users.length > 0 ? `${users.length} people nearby` : 'Find your next skill partner'}
            </p>
          </div>
          <div className="flex gap-2">
            {[RefreshCw, Sliders].map((Icon, i) => (
              <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={i === 0 ? handleRefresh : undefined}
                className="w-9 h-9 rounded-xl card flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                <Icon className="w-4 h-4"/>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-5">
              {/* Skeleton card */}
              <div className="w-full rounded-3xl overflow-hidden" style={{ height: 440 }}>
                <div className="w-full h-full rounded-3xl animate-pulse"
                  style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.08))' }}/>
              </div>
              <p className="text-slate-500 text-sm">Finding skill partners...</p>
            </motion.div>

          ) : isEmpty || users.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: EASE, duration: 0.35 }}
              className="flex flex-col items-center justify-center py-24 text-center gap-5">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Sparkles className="w-10 h-10 text-indigo-400"/>
              </motion.div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">You've seen everyone!</h3>
                <p className="text-slate-500 text-sm max-w-xs">Check back later for new skill-sharers joining the platform.</p>
              </div>
              <motion.button onClick={handleRefresh}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold brand-gradient">
                <RefreshCw className="w-4 h-4"/> Refresh
              </motion.button>
            </motion.div>

          ) : (
            <motion.div key="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SwipeDeck users={users} onSwipe={handleSwipe} onEmpty={() => setIsEmpty(true)}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Discover;
