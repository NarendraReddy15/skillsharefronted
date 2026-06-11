import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Match } from '@/types';
import { STAGGER, ITEM } from '@/lib/motion';

const ChatList = ({ matches }: { matches: Match[] }) => {
  const { matchId } = useParams();
  const [q, setQ] = useState('');

  const filtered = matches.filter(m => m.user?.name.toLowerCase().includes(q.toLowerCase()));

  if (!matches.length) return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-12 gap-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}>💬</div>
      <div>
        <p className="text-white text-sm font-semibold mb-0.5">No conversations yet</p>
        <p className="text-slate-500 text-xs">Match with someone to start chatting!</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search */}
      <div className="px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"
            className="field w-full rounded-xl py-2 pl-8 pr-3 text-xs"/>
        </div>
      </div>

      {/* List */}
      <motion.div variants={STAGGER} initial="hidden" animate="visible"
        className="overflow-y-auto scroll-area flex-1">
        {filtered.map(match => {
          const active = matchId === match._id;
          return (
            <motion.div key={match._id} variants={ITEM}>
              <Link to={`/chat/${match._id}`}
                className={`flex items-center gap-3 px-4 py-3 transition-all border-l-2 ${
                  active ? 'border-l-indigo-500' : 'border-l-transparent hover:bg-white/[0.025]'
                }`}
                style={active ? { background: 'rgba(99,102,241,0.08)' } : undefined}>
                <div className="relative flex-shrink-0">
                  {match.user?.avatar
                    ? <img src={match.user.avatar} alt={match.user.name} className="w-11 h-11 rounded-xl object-cover"/>
                    : <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm brand-gradient">
                        {match.user?.name[0]}
                      </div>
                  }
                  {match.user?.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2"
                      style={{ borderColor: '#0c0c1a', boxShadow: '0 0 6px rgba(52,211,153,0.6)' }}/>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-semibold text-sm truncate ${active ? 'text-white' : 'text-slate-200'}`}>
                      {match.user?.name}
                    </span>
                    {match.lastMessageAt && (
                      <span className="text-[10px] text-slate-600 flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(match.lastMessageAt), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${active ? 'text-indigo-300/60' : 'text-slate-500'}`}>
                    {match.lastMessage?.content || 'Say hello! 👋'}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ChatList;
