import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Camera, Plus, X, Loader2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';
import { Skill } from '@/types';
import { PAGE, STAGGER, ITEM } from '@/lib/motion';

const EXPERIENCE_OPTIONS = ['Student', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Expert'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Expert'] as const;

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div variants={ITEM} className="card rounded-2xl p-5">
    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{title}</h2>
    {children}
  </motion.div>
);

const EditProfile = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    experience: user?.experience || 'Student',
  });
  const [skills, setSkills] = useState<Skill[]>(user?.skills || []);
  const [lookingFor, setLookingFor] = useState<string[]>(user?.lookingFor || []);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<Skill['level']>('Beginner');
  const [newLookingFor, setNewLookingFor] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        const { data } = await api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        updateUser({ avatar: data.avatar });
      }
      const { data } = await api.put('/users/profile', { ...form, skills, lookingFor });
      return data;
    },
    onSuccess: (data) => { updateUser(data); toast.success('Profile updated!'); navigate('/profile'); },
    onError: () => toast.error('Update failed'),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const addSkill = () => {
    if (!newSkill.trim() || skills.some(s => s.name === newSkill.trim())) return;
    setSkills([...skills, { name: newSkill.trim(), level: newSkillLevel }]);
    setNewSkill('');
  };

  const addLookingFor = () => {
    if (!newLookingFor.trim() || lookingFor.includes(newLookingFor.trim())) return;
    setLookingFor([...lookingFor, newLookingFor.trim()]);
    setNewLookingFor('');
  };

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-xl mx-auto px-4 pt-8 pb-8">

        {/* Header */}
        <motion.div variants={ITEM} initial="hidden" animate="visible" className="flex items-center gap-3 mb-8">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl card flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4"/>
          </motion.button>
          <div>
            <h1 className="text-2xl font-black text-white">Edit Profile</h1>
            <p className="text-slate-500 text-xs">Update your skills and information</p>
          </div>
        </motion.div>

        <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">

          {/* Avatar */}
          <motion.div variants={ITEM} className="flex flex-col items-center py-7 card rounded-2xl">
            <div className="relative mb-3">
              <div onClick={() => fileRef.current?.click()}
                className="w-24 h-24 rounded-2xl cursor-pointer overflow-hidden transition-all"
                style={{ outline: '2px solid rgba(99,102,241,0.35)', outlineOffset: '3px' }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white brand-gradient">
                      {user?.name[0]}
                    </div>
                }
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center shadow-lg brand-gradient">
                <Camera className="w-3.5 h-3.5 text-white"/>
              </motion.button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
            </div>
            <p className="text-slate-500 text-xs">Tap to change photo</p>
          </motion.div>

          {/* Basic Info */}
          <SectionCard title="Basic Info">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="field w-full rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-600 outline-none transition-all"/>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell people about yourself..." maxLength={500} rows={3}
                  className="field w-full rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-600 outline-none transition-all resize-none"/>
                <p className="text-right text-xs text-slate-600">{form.bio.length}/500</p>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="City, Country"
                  className="field w-full rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-600 outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Experience Level</label>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <motion.button key={opt} whileTap={{ scale: 0.94 }}
                      onClick={() => setForm({ ...form, experience: opt as any })}
                      className={`px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                        form.experience === opt
                          ? 'text-indigo-300'
                          : 'card text-slate-400 hover:text-slate-300'
                      }`}
                      style={form.experience === opt
                        ? { background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)' }
                        : undefined}>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Skills */}
          <SectionCard title="My Skills">
            <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
              {skills.length === 0
                ? <p className="text-slate-600 text-sm">No skills added yet</p>
                : skills.map(skill => (
                    <div key={skill.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-indigo-300 text-sm"
                      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                      <span>{skill.name}</span>
                      <span className="text-indigo-400/50 text-xs">· {skill.level}</span>
                      <button onClick={() => setSkills(skills.filter(s => s.name !== skill.name))}
                        className="ml-0.5 text-indigo-400/40 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3"/>
                      </button>
                    </div>
                  ))
              }
            </div>
            <div className="flex gap-2">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill..."
                className="field flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition-all"/>
              <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value as Skill['level'])}
                className="field rounded-xl px-2 py-2 text-sm text-slate-300 outline-none"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                {SKILL_LEVELS.map(l => <option key={l} value={l} style={{ background: '#111' }}>{l}</option>)}
              </select>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                onClick={addSkill}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 brand-gradient">
                <Plus className="w-4 h-4 text-white"/>
              </motion.button>
            </div>
          </SectionCard>

          {/* Looking For */}
          <SectionCard title="Looking to Learn">
            <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
              {lookingFor.length === 0
                ? <p className="text-slate-600 text-sm">Nothing added yet</p>
                : lookingFor.map(item => (
                    <div key={item} className="flex items-center gap-1.5 card px-3 py-1.5 rounded-xl text-slate-300 text-sm">
                      {item}
                      <button onClick={() => setLookingFor(lookingFor.filter(i => i !== item))}
                        className="text-slate-500 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3"/>
                      </button>
                    </div>
                  ))
              }
            </div>
            <div className="flex gap-2">
              <input value={newLookingFor} onChange={e => setNewLookingFor(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addLookingFor()}
                placeholder="e.g. Machine Learning, Design..."
                className="field flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition-all"/>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                onClick={addLookingFor}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 brand-gradient">
                <Plus className="w-4 h-4 text-white"/>
              </motion.button>
            </div>
          </SectionCard>

          {/* Save */}
          <motion.div variants={ITEM}>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 brand-gradient disabled:opacity-60 transition-opacity">
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Save Changes'}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
