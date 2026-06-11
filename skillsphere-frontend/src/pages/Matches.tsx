import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Loader2, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/api/axios';
import { Match } from '@/types';
import { PAGE, STAGGER, ITEM, HOVER_LIFT, TAP } from '@/lib/motion';

const skillPill: Record<string, string> = {
  Expert:       'bg-violet-500/15 text-violet-300 border-violet-500/25',
  Intermediate: 'bg-blue-500/15   text-blue-300   border-blue-500/25',
  Beginner:     'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
};

const Matches = () => {
  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: () => api.get('/matches').then(r => r.data),
  });

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-8">

        {/* Header */}
        <motion.div variants={ITEM} initial="hidden" animate="visible" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)' }}>
            <Heart className="w-5 h-5 text-rose-400"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Matches</h1>
            <p className="text-slate-500 text-sm">{matches.length} mutual connections</p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({length:4}).map((_,i) => (
              <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }}/>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
              <Sparkles className="w-10 h-10 text-rose-400"/>
            </motion.div>
            <div>
              <h3 className="text-xl font-black text-white mb-2">No matches yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-xs">Swipe right on the Discover page to find skill partners.</p>
            </div>
            <Link to="/discover">
              <motion.div whileHover={HOVER_LIFT} whileTap={TAP}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold brand-gradient cursor-pointer">
                Start Discovering
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={STAGGER} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map((match) => (
              <motion.div key={match._id} variants={ITEM} whileHover={HOVER_LIFT}
                className="group card card-hover rounded-2xl overflow-hidden">
                {/* Cover */}
                <div className=" h-10 overflow-hidden"
                  >
                  {match.user?.avatar && (
                    <img src={match.user.avatar} alt="" className="w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-opacity"/>
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 40%,rgba(8,11,20,0.9))' }}/>
                  {match.user?.isOnline && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"/>
                      <span className="text-[10px] text-white/80 font-medium">Online</span>
                    </div>
                  )}
                </div>

                <div className="px-4 pb-4">
                  {/* Avatar overlap */}
                  <div className="flex items-end justify-between -mt-7 mb-3">
                    {match.user?.avatar
                      ? <img src={match.user.avatar} alt={match.user.name}
                          className="w-14 h-14 rounded-xl object-cover ring-2 shadow-lg" style={{ borderColor: '#080b14' }}/>
                      : <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg brand-gradient"
                          style={{ outline: '2px solid #080b14' }}>
                          {match.user?.name[0]}
                        </div>
                    }
                    <p className="text-slate-600 text-[10px] mb-1">
                      {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <h3 className="font-bold text-white text-sm mb-0.5">{match.user?.name}</h3>
                  {match.user?.location && (
                    <p className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                      <MapPin className="w-3 h-3"/>{match.user.location}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {match.user?.skills.slice(0, 2).map(s => (
                      <span key={s.name} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${skillPill[s.level] || skillPill.Beginner}`}>
                        {s.name}
                      </span>
                    ))}
                  </div>

                  <Link to={`/chat/${match._id}`}>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-indigo-300 cursor-pointer transition-colors"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <MessageCircle className="w-3.5 h-3.5"/>
                      {match.lastMessage ? 'Continue Chat' : 'Say Hello 👋'}
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Matches;
