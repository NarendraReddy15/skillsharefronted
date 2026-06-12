import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Search, MapPin, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/api/axios';
import { Match } from '@/types';
import { PAGE, STAGGER, ITEM, TAP } from '@/lib/motion';

/* ── Per-user accent palette ── */
const ACCENTS = [
  {
    grad:      'linear-gradient(135deg,#6366f1,#a855f7)',
    glow:      'rgba(99,102,241,0.18)',
    glowHover: 'rgba(99,102,241,0.38)',
    ring:      'rgba(99,102,241,0.45)',
    btn:       'rgba(99,102,241,0.13)',
    btnBorder: 'rgba(99,102,241,0.28)',
  },
  {
    grad:      'linear-gradient(135deg,#ec4899,#f43f5e)',
    glow:      'rgba(236,72,153,0.18)',
    glowHover: 'rgba(236,72,153,0.38)',
    ring:      'rgba(236,72,153,0.45)',
    btn:       'rgba(236,72,153,0.13)',
    btnBorder: 'rgba(236,72,153,0.28)',
  },
  {
    grad:      'linear-gradient(135deg,#3b82f6,#06b6d4)',
    glow:      'rgba(59,130,246,0.18)',
    glowHover: 'rgba(59,130,246,0.38)',
    ring:      'rgba(59,130,246,0.45)',
    btn:       'rgba(59,130,246,0.13)',
    btnBorder: 'rgba(59,130,246,0.28)',
  },
  {
    grad:      'linear-gradient(135deg,#10b981,#059669)',
    glow:      'rgba(16,185,129,0.18)',
    glowHover: 'rgba(16,185,129,0.38)',
    ring:      'rgba(16,185,129,0.45)',
    btn:       'rgba(16,185,129,0.13)',
    btnBorder: 'rgba(16,185,129,0.28)',
  },
  {
    grad:      'linear-gradient(135deg,#f59e0b,#ef4444)',
    glow:      'rgba(245,158,11,0.18)',
    glowHover: 'rgba(245,158,11,0.38)',
    ring:      'rgba(245,158,11,0.45)',
    btn:       'rgba(245,158,11,0.13)',
    btnBorder: 'rgba(245,158,11,0.28)',
  },
  {
    grad:      'linear-gradient(135deg,#8b5cf6,#ec4899)',
    glow:      'rgba(139,92,246,0.18)',
    glowHover: 'rgba(139,92,246,0.38)',
    ring:      'rgba(139,92,246,0.45)',
    btn:       'rgba(139,92,246,0.13)',
    btnBorder: 'rgba(139,92,246,0.28)',
  },
];

const getAccent = (name: string) => ACCENTS[(name?.charCodeAt(0) ?? 65) % ACCENTS.length];

const SKILL_PILL: Record<string, string> = {
  Expert:       'bg-violet-500/15 text-violet-300 border border-violet-500/30',
  Intermediate: 'bg-blue-500/15   text-blue-300   border border-blue-500/30',
  Beginner:     'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
};

const EXP_BADGE: Record<string, string> = {
  Student:     'text-slate-400  bg-slate-500/10  border-slate-500/20',
  Junior:      'text-sky-400    bg-sky-500/10    border-sky-500/20',
  'Mid-level': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  Senior:      'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Lead:        'text-rose-400   bg-rose-500/10   border-rose-500/20',
  Expert:      'text-amber-400  bg-amber-500/10  border-amber-500/20',
};

/* ═══════════════════════════════════════════════════════════ */

const Matches = () => {
  const [search, setSearch] = useState('');

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn:  () => api.get('/matches').then(r => r.data),
  });

  const onlineCount = matches.filter(m => m.user?.isOnline).length;
  const q           = search.trim().toLowerCase();

  const visible = useMemo(
    () => (q ? matches.filter(m => m.user?.name.toLowerCase().includes(q)) : matches),
    [matches, q],
  );

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-8">

        {/* ── Header ── */}
        <motion.div variants={ITEM} initial="hidden" animate="visible" className="mb-6">
          <div className="flex items-center gap-3">
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

        {isLoading ? (
          <SkeletonGrid />
        ) : matches.length === 0 ? (
          <EmptyState />
        ) : (
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

            {/* ── Cards grid ── */}
            <motion.div variants={STAGGER} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {visible.map(match => (
                <MatchCard key={match._id} match={match} />
              ))}
            </motion.div>

            {visible.length === 0 && (
              <p className="text-slate-600 text-sm text-center py-12">No matches found.</p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════ */

const MatchCard = ({ match }: { match: Match }) => {
  const accent = getAccent(match.user?.name ?? 'A');
  const hasMsg = !!match.lastMessage;

  return (
    <motion.div
      variants={ITEM}
      whileTap={TAP}
      className="group relative rounded-2xl overflow-hidden"
      animate={{ boxShadow: `0 4px 28px ${accent.glow}` }}
      whileHover={{
        y: -7,
        boxShadow: `0 20px 55px ${accent.glowHover}`,
        transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      style={{
        /* CSS gradient border trick */
        background: `linear-gradient(#0d0f1d, #0d0f1d) padding-box, ${accent.grad} border-box`,
        border: '1px solid transparent',
      }}>

      {/* ── Cover ── */}
      <div className="relative h-36 overflow-hidden" style={{ background: accent.grad }}>

        {/* Blurred avatar as cover art */}
        {match.user?.avatar ? (
          <img
            src={match.user.avatar}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-30
                       group-hover:opacity-45 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          /* Subtle noise overlay on gradient when no avatar */
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
        )}

        {/* Gradient fade to card body */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(13,15,29,0.05) 0%, rgba(13,15,29,0.88) 100%)' }} />

        {/* Subtle shine overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${accent.glow} 0%, transparent 60%)` }} />

        {/* Online badge */}
        {match.user?.isOnline && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(52,211,153,0.3)',
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse
                             shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-[9px] text-emerald-400 font-semibold tracking-wider">ONLINE</span>
          </div>
        )}

        {/* Matched timestamp */}
        <span className="absolute bottom-2.5 right-3 text-[9px] text-white/30 font-medium">
          {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="px-4 pb-5">

        {/* Avatar — overlaps cover */}
        <div className="-mt-9 mb-3.5">
          <div className="relative w-[62px] h-[62px] rounded-2xl overflow-hidden flex-shrink-0"
            style={{
              background: accent.grad,
              boxShadow: `0 0 0 2.5px #0d0f1d, 0 0 0 4px ${accent.ring}, 0 8px 28px ${accent.glow}`,
            }}>
            {match.user?.avatar ? (
              <img src={match.user.avatar} alt={match.user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-white font-black text-2xl select-none">
                {match.user?.name?.[0]}
              </span>
            )}
          </div>
        </div>

        {/* Name + experience badge */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-bold text-white text-[15px] leading-tight">{match.user?.name}</h3>
          {match.user?.experience && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-semibold ${EXP_BADGE[match.user.experience] ?? EXP_BADGE.Junior}`}>
              {match.user.experience}
            </span>
          )}
        </div>

        {/* Location */}
        {match.user?.location && (
          <p className="flex items-center gap-1 text-slate-500 text-[11px] mb-3">
            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate">{match.user.location}</span>
          </p>
        )}

        {/* Skills */}
        {(match.user?.skills?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {match.user.skills.slice(0, 3).map(s => (
              <span key={s.name}
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${SKILL_PILL[s.level] ?? SKILL_PILL.Beginner}`}>
                {s.name}
              </span>
            ))}
          </div>
        )}

        {/* Last message preview */}
        {hasMsg && match.lastMessage && (
          <p className="text-[11px] text-slate-500 truncate mb-3 px-0.5">
            <span className="text-slate-600">Last: </span>{match.lastMessage.content}
          </p>
        )}

        {/* CTA button */}
        <Link to={`/chat/${match._id}`}>
          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.965 }}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            style={hasMsg ? {
              background: accent.btn,
              border: `1px solid ${accent.btnBorder}`,
              color: '#e2e8f0',
            } : {
              background: accent.grad,
              boxShadow: `0 4px 20px ${accent.glow}`,
              color: '#fff',
            }}>
            <MessageCircle className="w-3.5 h-3.5" />
            {hasMsg ? 'Continue Chat' : 'Say Hello 👋'}
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

/* ── Empty State ── */
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
      <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold brand-gradient cursor-pointer">
        Start Discovering
      </motion.div>
    </Link>
  </motion.div>
);

/* ── Skeleton ── */
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-72 rounded-2xl animate-pulse"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
    ))}
  </div>
);

export default Matches;
