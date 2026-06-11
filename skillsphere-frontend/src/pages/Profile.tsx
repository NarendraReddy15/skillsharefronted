import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Edit3, Loader2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/api/axios';
import { User } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { PAGE, STAGGER, ITEM } from '@/lib/motion';

const skillPill: Record<string, string> = {
  Expert:       'bg-violet-500/12 text-violet-300 border-violet-500/25',
  Intermediate: 'bg-blue-500/12   text-blue-300   border-blue-500/25',
  Beginner:     'bg-emerald-500/12 text-emerald-300 border-emerald-500/25',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div variants={ITEM} className="card rounded-2xl p-5">
    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{title}</h2>
    {children}
  </motion.div>
);

const Profile = () => {
  const { id } = useParams();
  const { user: me } = useAuthStore();
  const profileId = id || me?._id;
  const isOwn = !id || id === me?._id;

  const { data: profile, isLoading } = useQuery<User>({
    queryKey: ['profile', profileId],
    queryFn: () => api.get(`/users/${profileId}`).then(r => r.data),
    enabled: !!profileId,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#080b14] md:pl-64 flex items-center justify-center">
      <Loader2 className="w-7 h-7 text-indigo-400 animate-spin"/>
    </div>
  );

  if (!profile) return null;

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-8">
        <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">

          {/* Cover + avatar row */}
          <motion.div variants={ITEM} className="relative">
            {/* Cover */}
            <div className="h-44 rounded-2xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg,#312e81,#4c1d95,#6d28d9)' }}>
              {profile.avatar && <img src={profile.avatar} alt="" className="w-full h-full object-cover opacity-20"/>}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 30%,rgba(8,11,20,0.95))' }}/>
              {isOwn && (
                <Link to="/edit-profile" className="absolute top-4 right-4">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-medium cursor-pointer"
                    style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <Edit3 className="w-3.5 h-3.5"/> Edit Profile
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Avatar + name */}
            <div className="flex items-end gap-4 px-2 -mt-10 mb-4">
              <div className="relative flex-shrink-0">
                {profile.avatar
                  ? <img src={profile.avatar} alt={profile.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-xl"
                      style={{ outline: '3px solid #080b14' }}/>
                  : <div className="w-20 h-20 rounded-2xl brand-gradient flex items-center justify-center text-white text-2xl font-black shadow-xl"
                      style={{ outline: '3px solid #080b14' }}>
                      {profile.name[0]}
                    </div>
                }
                {profile.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2"
                    style={{ borderColor: '#080b14', boxShadow: '0 0 10px rgba(52,211,153,0.6)' }}/>
                )}
              </div>
              <div className="pb-1 flex-1 min-w-0">
                <h1 className="text-xl font-black text-white leading-tight">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  {profile.experience && (
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <Briefcase className="w-3 h-3 text-slate-500"/>{profile.experience}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin className="w-3 h-3 text-slate-500"/>{profile.location}
                    </span>
                  )}
                </div>
              </div>
              {!isOwn && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-white text-sm font-semibold brand-gradient mb-1">
                  Connect
                </motion.button>
              )}
            </div>

            {/* Status badge */}
            <div className="px-2">
              {profile.isOnline
                ? <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Active now
                  </span>
                : <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Calendar className="w-3 h-3"/>
                    Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
                  </span>
              }
            </div>
          </motion.div>

          {/* Bio */}
          {profile.bio && (
            <Section title="About">
              <p className="text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
            </Section>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill.name}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium ${skillPill[skill.level] || skillPill.Beginner}`}>
                    {skill.name}
                    <span className="text-[10px] opacity-50">· {skill.level}</span>
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Looking for */}
          {profile.lookingFor?.length > 0 && (
            <Section title="Looking to Learn">
              <div className="flex flex-wrap gap-2">
                {profile.lookingFor.map(item => (
                  <span key={item} className="px-3 py-1.5 rounded-xl card text-slate-300 text-sm">{item}</span>
                ))}
              </div>
            </Section>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
