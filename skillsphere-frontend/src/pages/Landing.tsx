import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Zap, Users, MessageCircle, Video, Star, ArrowRight, CheckCircle } from 'lucide-react';

const MOCK_CARDS = [
  {
    name: 'Sarah K.',
    role: 'React Expert',
    skills: ['React', 'TypeScript', 'Node.js'],
    gradient: 'from-violet-600 via-purple-600 to-pink-500',
    ring: 'ring-purple-500/40',
    avatar: 'SK',
    avatarColor: 'from-purple-400 to-pink-400',
    online: true,
  },
  {
    name: 'Alex M.',
    role: 'AI Engineer',
    skills: ['Python', 'ML', 'LLMs'],
    gradient: 'from-blue-600 via-cyan-500 to-teal-500',
    ring: 'ring-cyan-500/40',
    avatar: 'AM',
    avatarColor: 'from-blue-400 to-cyan-400',
    online: true,
  },
  {
    name: 'Jay P.',
    role: 'UI Designer',
    skills: ['Figma', 'CSS', 'Motion'],
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
    ring: 'ring-emerald-500/40',
    avatar: 'JP',
    avatarColor: 'from-emerald-400 to-teal-400',
    online: false,
  },
];

const features = [
  {
    icon: Zap,
    title: 'Smart Matching',
    desc: 'AI-powered swipe engine connects you with people whose skills complement yours perfectly.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Chat',
    desc: 'Instant messaging with typing indicators, read receipts and media sharing.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: Video,
    title: 'HD Video Calls',
    desc: 'Face-to-face skill sessions with WebRTC — zero lag, crystal clear.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
  {
    icon: Users,
    title: 'Friend Network',
    desc: 'Build your trusted skill-share circle. Accept, reject, and grow your network.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  {
    icon: Star,
    title: 'Skill Showcase',
    desc: 'Display expertise levels from Beginner to Expert and attract the right collaborators.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
  },
  {
    icon: Layers,
    title: 'AI Recommendations',
    desc: 'Get matched based on your learning goals and skill gaps automatically.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/20',
  },
];

const stats = [
  { value: '10K+', label: 'Skill Sharers' },
  { value: '50K+', label: 'Matches Made' },
  { value: '200+', label: 'Skills Listed' },
  { value: '4.9★', label: 'User Rating' },
];

const perks = [
  'No credit card required',
  'Cancel anytime',
  'Free forever plan',
  'Join in 30 seconds',
];

const Landing = () => (
  <div className="min-h-screen bg-[#080B14] text-white overflow-hidden">

    {/* ── Background glows ── */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
    </div>

    {/* ── Navbar ── */}
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2.5"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Layers className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">SkillShare</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <Link
          to="/login"
          className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          Log In
        </Link>
        <Link
          to="/register"
          className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
        >
          Get Started
        </Link>
      </motion.div>
    </nav>

    {/* ── Hero ── */}
    <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10 md:pt-24">
      <div className="flex flex-col lg:flex-row items-center gap-16">

        {/* Left copy */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold px-4 py-2 rounded-full mb-7 tracking-wide uppercase">
              <Zap className="w-3 h-3" /> Tinder for Skill Sharing
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            Discover &amp; Share
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Skills Together
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            Swipe right on talent. Match with creators. Chat, call, and grow your
            skills with the perfect collaborators — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-8"
          >
            <Link to="/register">
              <button className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5">
                Start Matching Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/login">
              <button className="flex items-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 rounded-2xl font-semibold text-base hover:bg-white/10 transition-all">
                Sign In
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start"
          >
            {perks.map((p) => (
              <span key={p} className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {p}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — animated card stack */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-shrink-0 relative"
          style={{ width: 300, height: 380 }}
        >
          {MOCK_CARDS.map((card, i) => (
            <motion.div
              key={card.name}
              initial={false}
              animate={{
                rotate: (i - 1) * 6,
                y: (i - 1) * -8,
                scale: 1 - (MOCK_CARDS.length - 1 - i) * 0.04,
                zIndex: i,
              }}
              whileHover={i === MOCK_CARDS.length - 1 ? { y: -10, scale: 1.03 } : {}}
              className={`absolute inset-0 rounded-[28px] overflow-hidden shadow-2xl cursor-pointer bg-gradient-to-br ${card.gradient}`}
              style={{ transformOrigin: 'bottom center' }}
            >
              {/* Card noise texture */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Online dot */}
              {card.online && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white/80 font-medium">Online</span>
                </div>
              )}

              {/* Avatar */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.avatarColor} flex items-center justify-center shadow-2xl ring-2 ${card.ring}`}>
                  <span className="text-2xl font-black text-white">{card.avatar}</span>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xl font-black text-white">{card.name}</p>
                <p className="text-white/70 text-sm mb-3">{card.role}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {card.skills.map((s) => (
                    <span key={s} className="text-xs bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Floating like/nope badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="absolute -left-14 top-1/2 -translate-y-1/2 bg-red-500/90 backdrop-blur-sm text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-red-400 rotate-[-20deg] shadow-lg"
          >
            NOPE
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="absolute -right-12 top-1/3 bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-emerald-400 rotate-[18deg] shadow-lg"
          >
            LIKE ✓
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ── Stats bar ── */}
    <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-6 py-5 text-center hover:border-violet-500/30 transition-colors"
          >
            <p
              className="text-3xl font-black mb-1"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {value}
            </p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </motion.div>
    </section>

    {/* ── Features ── */}
    <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 block">Features</span>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Everything to{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            grow together
          </span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          One platform to discover talent, collaborate in real-time, and level up your skills.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className={`bg-white/[0.03] border ${border} rounded-2xl p-6 hover:bg-white/[0.06] transition-all cursor-default`}
          >
            <div className={`w-12 h-12 rounded-2xl ${bg} border ${border} flex items-center justify-center mb-5`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── How it works ── */}
    <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 block">How it works</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight">Start in 3 steps</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* connector line */}
        <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-gradient-to-r from-violet-500/30 via-pink-500/30 to-orange-500/30" />

        {[
          { step: '01', title: 'Create Profile', desc: 'List your skills, experience level, and what you want to learn. Upload your avatar.', emoji: '👤', color: 'from-violet-500 to-purple-600' },
          { step: '02', title: 'Swipe & Match', desc: 'Discover people with complementary skills. Swipe right on those you want to connect with.', emoji: '💘', color: 'from-pink-500 to-rose-600' },
          { step: '03', title: 'Chat & Grow', desc: 'Instantly message your matches, jump on a video call, and start sharing skills.', emoji: '🚀', color: 'from-orange-500 to-amber-600' },
        ].map(({ step, title, desc, emoji, color }, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="relative text-center bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-violet-500/30 transition-colors"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-5 shadow-lg text-3xl`}>
              {emoji}
            </div>
            <span className="text-xs font-black text-violet-400 tracking-widest uppercase block mb-2">{step}</span>
            <h3 className="font-black text-white text-xl mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* CTA glow bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-pink-600/20 to-orange-600/10" />
        <div className="absolute inset-0 border border-white/10 rounded-3xl" />

        {/* Glow orbs inside CTA */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[60px]" />

        <div className="relative px-8 py-16 md:py-20 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-5">Ready to begin?</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Join{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SkillShare
            </span>{' '}
            today
          </h2>
          <p className="text-gray-300 mb-10 max-w-md mx-auto text-lg">
            Thousands of skill-sharers are already connecting. Your next collaborator is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <button className="group flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-2xl shadow-violet-500/30 hover:-translate-y-0.5">
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/login">
              <button className="flex items-center gap-2 px-10 py-4 bg-white/5 border border-white/15 rounded-2xl font-bold text-base hover:bg-white/10 transition-all">
                Sign In Instead
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center mt-8">
            {perks.map((p) => (
              <span key={p} className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>

    {/* ── Footer ── */}
    <footer className="relative z-10 border-t border-white/[0.07] py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm">SkillShare</span>
        </div>
        <p className="text-gray-600 text-sm">© 2025 SkillShare. Built with passion for learners.</p>
      </div>
    </footer>
  </div>
);

export default Landing;
