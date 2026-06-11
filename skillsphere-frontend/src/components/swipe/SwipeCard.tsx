import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Briefcase, X, Heart } from 'lucide-react';
import { User } from '@/types';

interface Props { user: User; onSwipe: (dir: 'left' | 'right') => void; isTop: boolean; }

const levelConfig: Record<string, { dot: string; pill: string }> = {
  Expert:       { dot: 'bg-violet-400', pill: 'bg-violet-500/15 border-violet-500/25 text-violet-300' },
  Intermediate: { dot: 'bg-blue-400',   pill: 'bg-blue-500/15   border-blue-500/25   text-blue-300'   },
  Beginner:     { dot: 'bg-emerald-400',pill: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300'},
};

export default function SwipeCard({ user, onSwipe, isTop }: Props) {
  const x       = useMotionValue(0);
  const rotate  = useTransform(x, [-220, 220], [-18, 18]);
  const opacity = useTransform(x, [-220, -100, 0, 100, 220], [0, 1, 1, 1, 0]);
  const likeOp  = useTransform(x, [0, 90], [0, 1]);
  const nopeOp  = useTransform(x, [-90, 0], [1, 0]);

  const onDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={onDragEnd}
      className={`absolute inset-0 select-none ${isTop ? 'cursor-grab active:cursor-grabbing z-10' : 'pointer-events-none z-0'}`}
      animate={!isTop ? { scale: 0.95, y: -12 } : { scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#1e1b4b,#2e1065,#3b0764)' }}>
        {/* BG image */}
        {user.avatar
          ? <img src={user.avatar} alt={user.name} className="absolute inset-0 w-full h-full object-cover"/>
          : <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#312e81,#4c1d95,#6d28d9)' }}>
              <span className="text-[120px] font-black text-white/[0.08] select-none leading-none">{user.name[0]}</span>
            </div>
        }

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 20%, rgba(8,11,20,0.98) 100%)' }}/>

        {/* Online badge */}
        {user.isOnline && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-[11px] text-white/80 font-medium">Online</span>
          </div>
        )}

        {/* LIKE / NOPE stamps */}
        <motion.div style={{ opacity: likeOp, background: 'rgba(16,185,129,0.12)', backdropFilter: 'blur(4px)' } as any}
          className="absolute top-9 left-7 px-4 py-2 rounded-2xl font-black text-2xl border-[3px] border-emerald-400 text-emerald-400 rotate-[-16deg]">
          LIKE
        </motion.div>
        <motion.div style={{ opacity: nopeOp, background: 'rgba(239,68,68,0.12)', backdropFilter: 'blur(4px)' } as any}
          className="absolute top-9 right-7 px-4 py-2 rounded-2xl font-black text-2xl border-[3px] border-red-400 text-red-400 rotate-[16deg]">
          NOPE
        </motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 inset-x-0 p-6">
          <div className="flex items-end gap-3 mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white leading-tight">{user.name}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1">
                {user.location && (
                  <span className="flex items-center gap-1 text-white/60 text-xs">
                    <MapPin className="w-3 h-3"/>{user.location}
                  </span>
                )}
                {user.experience && (
                  <span className="flex items-center gap-1 text-white/60 text-xs">
                    <Briefcase className="w-3 h-3"/>{user.experience}
                  </span>
                )}
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="text-white/60 text-sm line-clamp-2 mb-4 leading-relaxed">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {user.skills.slice(0, 4).map(s => {
              const cfg = levelConfig[s.level] || levelConfig.Beginner;
              return (
                <div key={s.name} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${cfg.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                  {s.name}
                </div>
              );
            })}
            {user.skills.length > 4 && (
              <div className="px-3 py-1 rounded-full border border-white/10 text-white/40 text-xs">+{user.skills.length - 4}</div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons — only on top card */}
      {isTop && (
        <div className="absolute -bottom-[72px] inset-x-0 flex items-center justify-center gap-5">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onSwipe('left')}
            className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.35)', boxShadow: '0 8px 30px rgba(239,68,68,0.2)' }}>
            <X className="w-6 h-6 text-red-400"/>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onSwipe('right')}
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 8px 30px rgba(99,102,241,0.5)' }}>
            <Heart className="w-6 h-6 text-white fill-white"/>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
