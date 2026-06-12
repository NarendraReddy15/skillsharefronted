import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Sparkles, Search, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/api/axios';
import { Match } from '@/types';
import { PAGE, STAGGER, ITEM, HOVER_LIFT, TAP } from '@/lib/motion';

/* ── Helpers ── */
const GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#a855f7)',
  'linear-gradient(135deg,#ec4899,#f43f5e)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#10b981,#3b82f6)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
];
const getGradient = (name: string) => GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];

const SKILL_PILL: Record<string, string> = {
  Expert:       'bg-violet-500/15 text-violet-300 border-violet-500/25',
  Intermediate: 'bg-blue-500/15   text-blue-300   border-blue-500/25',
  Beginner:     'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
};

const EXP_BADGE: Record<string, string> = {
  Student:    'bg-slate-500/15   text-slate-400',
  Junior:     'bg-sky-500/15     text-sky-400',
  'Mid-level':'bg-indigo-500/15  text-indigo-400',
  Senior:     'bg-purple-500/15  text-purple-400',
  Lead:       'bg-rose-500/15    text-rose-400',
  Expert:     'bg-amber-500/15   text-amber-400',
};

/* ═══════════════════════════════════════════════════════════ */

const Matches = () => {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'all' | 'online' | 'unread'>('all');

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn:  () => api.get('/matches').then(r => r.data),
  });

  const newMatches     = useMemo(() => matches.filter(m => !m.lastMessage), [matches]);
  const conversations  = useMemo(() => matches.filter(m => !!m.lastMessage), [matches]);
  const onlineCount    = matches.filter(m => m.user?.isOnline).length;

  const q = search.trim().toLowerCase();

  const visibleNew = useMemo(
    () => (q ? newMatches.filter(m => m.user?.name.toLowerCase().includes(q)) : newMatches),
    [newMatches, q],
  );

  const visibleConvos = useMemo(() => {
    let list = conversations;
    if (filter === 'online') list = list.filter(m => m.user?.isOnline);
    if (filter === 'unread') list = list.filter(m => m.lastMessage && !m.lastMessage.read);
    if (q) list = list.filter(m => m.user?.name.toLowerCase().includes(q));
    return list;
  }, [conversations, filter, q]);

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-xl mx-auto px-4 pt-8 pb-8">

        {/* ── Header ── */}
        <motion.div variants={ITEM} initial="hidden" animate="visible" className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)' }}>
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Matches</h1>
              <p className="text-slate-500 text-sm">
                {matches.length} connection{matches.length !== 1 ? 's' : ''}
                {onlineCount > 0 && (
                  <span className="text-emerald-400"> · {onlineCount} online</span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {isLoading ? <SkeletonList /> : matches.length === 0 ? <EmptyState /> : (
          <>
            {/* ── Search ── */}
            <motion.div variants={ITEM} initial="hidden" animate="visible" className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search matches…"
                className="field w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
              />
            </motion.div>

            {/* ── New Matches row ── */}
            {visibleNew.length > 0 && (
              <motion.section variants={STAGGER} initial="hidden" animate="visible" className="mb-7">
                <motion.div variants={ITEM} className="flex items-center gap-2 mb-3">
                  <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">New Matches</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-rose-400"
                    style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                    {visibleNew.length}
                  </span>
                </motion.div>

                <div className="flex gap-4 overflow-x-auto pb-1 scroll-area">
                  {visibleNew.map(match => (
                    <NewMatchBubble key={match._id} match={match} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── Conversations ── */}
            {conversations.length > 0 && (
              <motion.section variants={STAGGER} initial="hidden" animate="visible">
                <motion.div variants={ITEM} className="flex items-center justify-between mb-3">
                  <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    Messages
                  </h2>
                  <div className="flex gap-1">
                    {(['all', 'online', 'unread'] as const).map(f => (
                      <button key={f} onClick={() => setFilter(f)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                          filter === f
                            ? 'text-indigo-300 border border-indigo-500/25'
                            : 'text-slate-500 hover:text-slate-400'
                        }`}
                        style={filter === f ? { background: 'rgba(99,102,241,0.12)' } : undefined}>
                        {f}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <div className="flex flex-col gap-1.5">
                  {visibleConvos.map(match => (
                    <ConversationRow key={match._id} match={match} />
                  ))}
                  {visibleConvos.length === 0 && (
                    <motion.p variants={ITEM} className="text-slate-600 text-sm text-center py-8">
                      No conversations match your filter.
                    </motion.p>
                  )}
                </div>
              </motion.section>
            )}

            {/* nudge when only new matches exist */}
            {conversations.length === 0 && (
              <motion.p variants={ITEM} initial="hidden" animate="visible"
                className="text-slate-600 text-xs text-center mt-6">
                Say hello to start a conversation 👋
              </motion.p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════ */

/* Circular bubble for new (unsaid-hello) matches */
const NewMatchBubble = ({ match }: { match: Match }) => (
  <motion.div variants={ITEM} whileHover={HOVER_LIFT} whileTap={TAP} className="flex-shrink-0">
    <Link to={`/chat/${match._id}`} className="flex flex-col items-center gap-1.5 w-[60px]">
      <div className="relative">
        {/* pulsing ring */}
        <span className="absolute -inset-1 rounded-full border border-rose-500/35 animate-ping opacity-50 pointer-events-none" />

        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-rose-500/40 ring-offset-2 ring-offset-[#080b14]"
          style={{ background: getGradient(match.user?.name ?? 'A') }}>
          {match.user?.avatar
            ? <img src={match.user.avatar} alt={match.user.name} className="w-full h-full object-cover" />
            : <span className="w-full h-full flex items-center justify-center text-white font-black text-xl">
                {match.user?.name[0]}
              </span>
          }
        </div>

        {match.user?.isOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            style={{ borderColor: '#080b14' }} />
        )}
      </div>
      <span className="text-[10px] text-slate-400 text-center leading-tight truncate w-full text-center">
        {match.user?.name.split(' ')[0]}
      </span>
    </Link>
  </motion.div>
);

/* ────────────────────────────────────────────────────────── */

/* List row for matches that have a conversation */
const ConversationRow = ({ match }: { match: Match }) => {
  const unread = match.lastMessage && !match.lastMessage.read;

  return (
    <motion.div variants={ITEM} whileHover={{ x: 3, transition: { duration: 0.12 } }}>
      <Link to={`/chat/${match._id}`}
        className="card card-hover flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all">

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden"
            style={{ background: getGradient(match.user?.name ?? 'A') }}>
            {match.user?.avatar
              ? <img src={match.user.avatar} alt={match.user.name} className="w-full h-full object-cover" />
              : <span className="w-full h-full flex items-center justify-center text-white font-black text-lg">
                  {match.user?.name[0]}
                </span>
            }
          </div>
          {match.user?.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-[2px] shadow-[0_0_6px_rgba(52,211,153,0.6)]"
              style={{ borderColor: '#080b14' }} />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`text-sm truncate ${unread ? 'font-bold text-white' : 'font-semibold text-white/90'}`}>
              {match.user?.name}
            </span>
            <span className="text-[10px] text-slate-600 flex-shrink-0">
              {formatDistanceToNow(
                new Date(match.lastMessageAt ?? match.createdAt),
                { addSuffix: false },
              )}
            </span>
          </div>
          <p className={`text-xs truncate ${unread ? 'text-slate-300' : 'text-slate-500'}`}>
            {match.lastMessage?.content ?? ''}
          </p>
        </div>

        {/* Unread dot */}
        {unread && (
          <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
        )}
      </Link>
    </motion.div>
  );
};

/* ────────────────────────────────────────────────────────── */

const EmptyState = () => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-24 text-center gap-5">
    <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
      className="w-24 h-24 rounded-3xl flex items-center justify-center"
      style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
      <Sparkles className="w-10 h-10 text-rose-400" />
    </motion.div>
    <div>
      <h3 className="text-xl font-black text-white mb-2">No matches yet</h3>
      <p className="text-slate-500 text-sm max-w-xs">
        Swipe right on the Discover page to connect with skill partners.
      </p>
    </div>
    <Link to="/discover">
      <motion.div whileHover={HOVER_LIFT} whileTap={TAP}
        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold brand-gradient cursor-pointer">
        Start Discovering
      </motion.div>
    </Link>
  </motion.div>
);

const SkeletonList = () => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-[68px] rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
    ))}
  </div>
);

export default Matches;
