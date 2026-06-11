import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Heart, MessageCircle, Users, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuth } from '@/hooks/useAuth';

const NAV = [
  { path: '/discover',       icon: Compass,       label: 'Discover'  },
  { path: '/matches',        icon: Heart,          label: 'Matches'   },
  { path: '/chat',           icon: MessageCircle,  label: 'Messages'  },
  { path: '/friends',        icon: Users,          label: 'Friends'   },
  { path: '/notifications',  icon: Bell,           label: 'Alerts'    },
];

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="9" fill="url(#nl)" />
    <path d="M9 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="16" cy="19.5" r="2.5" fill="white"/>
    <defs>
      <linearGradient id="nl" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1"/>
        <stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
    </defs>
  </svg>
);

const Avatar = ({ user }: { user: { name: string; avatar?: string } }) =>
  user.avatar ? (
    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30" />
  ) : (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
      style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
      {user.name[0]?.toUpperCase()}
    </div>
  );

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { logout } = useAuth();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col z-40"
        style={{ background: '#0c0c1a', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Brand */}
        <Link to="/discover" className="flex items-center gap-3 px-5 py-6">
          <Logo />
          <div>
            <p className="font-black text-white text-[17px] tracking-tight leading-none">SkillShare</p>
            <p className="text-[10px] text-indigo-400 tracking-[0.18em] uppercase font-semibold mt-0.5">Connect · Grow</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            const badge = label === 'Messages' ? unreadCount : label === 'Alerts' ? unreadCount : 0;
            return (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}
                >
                  {active && (
                    <motion.div layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-indigo-500" />
                  )}
                  <Icon className={`relative w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-400' : ''}`} />
                  <span className="relative flex-1">{label}</span>
                  {badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="relative text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {badge > 9 ? '9+' : badge}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="px-3 pb-5 pt-3 space-y-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/profile">
            <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              {user && <Avatar user={user} />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.experience || 'Member'}</p>
              </div>
            </motion.div>
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-4"
        style={{ background: 'rgba(8,11,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/discover" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-black text-white text-[16px]">SkillShare</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link to="/notifications" className="relative p-2.5">
            <Bell className="w-5 h-5 text-slate-400" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </AnimatePresence>
          </Link>
          <Link to="/profile">
            {user && <Avatar user={user} />}
          </Link>
        </div>
      </header>

      {/* ── Mobile bottom tabs ───────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50"
        style={{ background: 'rgba(8,11,20,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-around px-2 py-1">
          {NAV.filter(n => n.label !== 'Alerts').map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            const badge = label === 'Messages' ? unreadCount : 0;
            return (
              <Link key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-4 py-2">
                <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-indigo-500/20' : ''}`}>
                  <Icon className={`w-5 h-5 transition-colors ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {badge > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-indigo-400' : 'text-slate-600'}`}>
                  {label}
                </span>
                {active && (
                  <motion.div layoutId="tab-active"
                    className="absolute bottom-0 inset-x-3 h-0.5 bg-indigo-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
