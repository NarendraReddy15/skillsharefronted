import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { STAGGER, ITEM } from '@/lib/motion';

const GOOGLE_URL = `${(import.meta.env.VITE_API_URL || 'https://skillsharebackend-j5x4.onrender.com/api').replace('/api', '')}/api/auth/google`;

const Logo = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="11" fill="url(#lr)"/>
    <path d="M11 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="19" cy="23" r="3" fill="white"/>
    <defs>
      <linearGradient id="lr" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
    </defs>
  </svg>
);

const PERKS = ['Swipe to find skill partners','Real-time chat & video calls','Build your skill portfolio','100% free forever'];

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setBusy(true);
    try { await register(form.name, form.email, form.password); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColor = ['','bg-red-500','bg-amber-400','bg-emerald-400'][strength];
  const strengthLabel = ['','Weak','Fair','Strong'][strength];

  return (
    <div className="min-h-screen bg-[#080b14] flex">
      {/* ── Left panel ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-center px-14 py-12">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] opacity-25" style={{ background: 'radial-gradient(circle,#6366f1,transparent)' }}/>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-15" style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }}/>

        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-3 mb-12">
            <Logo />
            <div>
              <p className="font-black text-white text-xl tracking-tight">SkillShare</p>
              <p className="text-[10px] text-indigo-400 tracking-[0.2em] uppercase font-semibold">Connect · Grow</p>
            </div>
          </div>

          <h2 className="text-[2.4rem] font-black text-white leading-tight mb-4">
            Your skills are{' '}
            <span className="brand-text">your superpower</span>
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Join thousands of professionals sharing, learning, and growing together.
          </p>

          <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">
            {PERKS.map((p) => (
              <motion.div key={p} variants={ITEM} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400"/>
                </div>
                <span className="text-slate-300 text-sm">{p}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Quote */}
          <div className="mt-10 p-5 rounded-2xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <p className="text-white text-sm font-semibold mb-1">"Found my co-founder here"</p>
            <p className="text-slate-400 text-xs leading-relaxed">Connected with a designer who complemented my engineering skills perfectly.</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold brand-gradient">J</div>
              <div><p className="text-white text-xs font-medium">James T.</p><p className="text-slate-600 text-[10px]">Full-Stack Engineer</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div variants={STAGGER} initial="hidden" animate="visible" className="w-full max-w-[400px] space-y-5">
          <motion.div variants={ITEM} className="lg:hidden flex items-center gap-2.5 mb-2">
            <Logo /><span className="font-black text-white text-lg">SkillShare</span>
          </motion.div>

          <motion.div variants={ITEM}>
            <h1 className="text-3xl font-black text-white mb-1">Create account</h1>
            <p className="text-slate-500 text-sm">Start your skill-sharing journey today</p>
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
            Sign up with Google
          </motion.a>

          <motion.div variants={ITEM} className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.07]"/>
            <span className="text-slate-600 text-xs">or email</span>
            <div className="flex-1 h-px bg-white/[0.07]"/>
          </motion.div>

          <motion.form variants={STAGGER} onSubmit={submit} className="space-y-3.5">
            <motion.div variants={ITEM} className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none"/>
              <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required
                className="field w-full rounded-xl py-3 pl-10 pr-4 text-sm"/>
            </motion.div>

            <motion.div variants={ITEM} className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none"/>
              <input type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required
                className="field w-full rounded-xl py-3 pl-10 pr-4 text-sm"/>
            </motion.div>

            <motion.div variants={ITEM}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none"/>
                <input type={show?'text':'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required
                  className="field w-full rounded-xl py-3 pl-10 pr-10 text-sm"/>
                <button type="button" onClick={()=>setShow(v=>!v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3].map(n => (
                      <motion.div key={n}
                        initial={{ scaleX: 0 }} animate={{ scaleX: strength >= n ? 1 : 0 }}
                        className={`h-1 flex-1 rounded-full origin-left transition-colors ${strength >= n ? strengthColor : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">{strengthLabel}</span>
                </div>
              )}
            </motion.div>

            <motion.button variants={ITEM} type="submit" disabled={busy}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 brand-gradient disabled:opacity-60 disabled:cursor-not-allowed">
              {busy
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <><span>Create Account</span><ArrowRight className="w-4 h-4"/></>}
            </motion.button>
          </motion.form>

          <motion.p variants={ITEM} className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
