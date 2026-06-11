import React from 'react';
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
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f1724] to-[#0b0f1a] border border-white/6 shadow-[0_8px_30px_rgba(2,6,23,0.6)]">
                {/* Cover */}
                <div className="relative h-28">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-20" />
                  {match.user?.avatar && (
                    <img src={match.user.avatar} alt={match.user.name} className="w-full h-full object-cover opacity-30" />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 40%,rgba(8,11,20,0.85))' }} />
                  {match.user?.isOnline && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                      <span className="text-xs text-white/80">Online</span>
                    </div>
                  )}
                </div>

                <div className="px-4 pb-4 pt-6">
                  {/* Avatar overlap + header */}
                  <div className="flex items-start justify-between -mt-10 mb-3">
                    <div className="flex items-center gap-3">
                      {match.user?.avatar
                        ? (
                          <img src={match.user.avatar} alt={match.user.name}
                            className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#080b14] shadow-lg" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600">
                            {match.user?.name[0]}
                          </div>
                        )}

                      <div>
                        <h3 className="font-bold text-white text-sm leading-5">{match.user?.name}</h3>
                        <p className="text-slate-400 text-xs">{match.user?.title || match.user?.location || ''}</p>
                      </div>
                    </div>

                    <p className="text-slate-500 text-[11px]">{formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {match.user?.skills.slice(0,3).map(s => (
                      <span key={s.name} className={`text-[11px] px-2 py-1 rounded-full border ${skillPill[s.level] || skillPill.Beginner}`}>
                        {s.name}
                      </span>
                    ))}
                  </div>

                  <Link to={`/chat/${match._id}`} className="block">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-between gap-3 w-full py-2 rounded-xl text-xs font-semibold text-indigo-200 cursor-pointer transition-colors bg-gradient-to-r from-indigo-700/10 to-transparent border border-indigo-500/10 px-3">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-4 h-4" />
                        <div className="text-left">
                          <div className="text-white text-sm leading-5">
                            {match.lastMessage?.text ? (match.lastMessage.text.length > 40 ? match.lastMessage.text.slice(0,40) + '...' : match.lastMessage.text) : 'Say Hello 👋'}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {match.lastMessage ? `${formatDistanceToNow(new Date(match.lastMessage.createdAt), { addSuffix: true })}` : 'Tap to start a conversation'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-indigo-300">
                        <Sparkles className="w-4 h-4" />
                      </div>
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
