import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { EASE, STAGGER, ITEM } from '@/lib/motion';

const GOOGLE_URL = `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/api/auth/google`;

const Logo = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="11" fill="url(#ll)"/>
    <path d="M11 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="19" cy="23" r="3" fill="white"/>
    <defs>
      <linearGradient id="ll" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
    </defs>
  </svg>
);

const socialProof = [
  { i: 'SK', n: 'Sarah K.',  r: 'React Developer', c: 'from-indigo-500 to-violet-600', online: true  },
  { i: 'AM', n: 'Alex M.',   r: 'ML Engineer',     c: 'from-violet-500 to-purple-600', online: true  },
  { i: 'DP', n: 'Dev P.',    r: 'UI/UX Designer',  c: 'from-purple-500 to-pink-500',   online: false },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [show,  setShow]  = useState(false);
  const [busy,  setBusy]  = useState(false);
  const { login } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await login(email, pass); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-[#080b14] flex">
      {/* ── Left panel ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-center px-14 py-12">
        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] opacity-25" style={{ background: 'radial-gradient(circle,#6366f1,transparent)' }}/>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-15" style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }}/>

        <div className="relative z-10 max-w-sm">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <Logo />
            <div>
              <p className="font-black text-white text-xl tracking-tight">SkillShare</p>
              <p className="text-[10px] text-indigo-400 tracking-[0.2em] uppercase font-semibold">Connect · Grow</p>
            </div>
          </div>

          <h2 className="text-[2.4rem] font-black text-white leading-tight mb-4">
            Meet people who{' '}
            <span className="brand-text">level you up</span>
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Discover and collaborate with skilled professionals who match your goals.
          </p>

          {/* Social proof cards */}
          <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-3">
            {socialProof.map((p) => (
              <motion.div key={p.n} variants={ITEM}
                className="flex items-center gap-3.5 card rounded-2xl p-3.5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.c} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {p.i}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{p.n}</p>
                  <p className="text-slate-500 text-xs">{p.r}</p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.online ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-slate-700'}`}/>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[['12K+','Members'],['800+','Skills'],['4.9★','Rating']].map(([v,l]) => (
              <div key={l}>
                <p className="text-xl font-black text-white">{v}</p>
                <p className="text-xs text-slate-600 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ───────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          variants={STAGGER} initial="hidden" animate="visible"
          className="w-full max-w-[400px] space-y-5"
        >
          {/* Mobile logo */}
          <motion.div variants={ITEM} className="lg:hidden flex items-center gap-2.5 mb-2">
            <Logo /><span className="font-black text-white text-lg">SkillShare</span>
          </motion.div>

          <motion.div variants={ITEM}>
            <h1 className="text-3xl font-black text-white mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to continue your journey</p>
          </motion.div>

          {/* Google */}
          <motion.a variants={ITEM} href={GOOGLE_URL}
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl card hover:bg-white/[0.06] transition-colors text-white text-sm font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.a>

          <motion.div variants={ITEM} className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.07]"/>
            <span className="text-slate-600 text-xs">or email</span>
            <div className="flex-1 h-px bg-white/[0.07]"/>
          </motion.div>

          <motion.form variants={STAGGER} onSubmit={submit} className="space-y-3.5">
            <motion.div variants={ITEM} className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none"/>
              <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required
                className="field w-full rounded-xl py-3 pl-10 pr-4 text-sm"/>
            </motion.div>

            <motion.div variants={ITEM} className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none"/>
              <input type={show?'text':'password'} placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} required
                className="field w-full rounded-xl py-3 pl-10 pr-10 text-sm"/>
              <button type="button" onClick={()=>setShow(v=>!v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
              </button>
            </motion.div>

            <motion.div variants={ITEM} className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
            </motion.div>

            <motion.button variants={ITEM} type="submit" disabled={busy}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 brand-gradient disabled:opacity-60 disabled:cursor-not-allowed">
              {busy
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <><span>Sign in</span><ArrowRight className="w-4 h-4"/></>}
            </motion.button>
          </motion.form>

          <motion.p variants={ITEM} className="text-center text-sm text-slate-600">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Create one free</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
