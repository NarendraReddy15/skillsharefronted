import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { User, FriendRequest } from '@/types';
import { PAGE, STAGGER, ITEM, ITEM_LEFT, HOVER_LIFT } from '@/lib/motion';

const Av = ({ user, size = 'md' }: { user: { name: string; avatar?: string }; size?: 'sm'|'md' }) => {
  const cls = size === 'sm' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';
  return user.avatar
    ? <img src={user.avatar} alt={user.name} className={`${cls} rounded-xl object-cover flex-shrink-0`}/>
    : <div className={`${cls} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 brand-gradient`}>
        {user.name[0].toUpperCase()}
      </div>;
};

const Friends = () => {
  const queryClient = useQueryClient();

  const { data: friends  = [], isLoading } = useQuery<User[]>({
    queryKey: ['friends'],
    queryFn: () => api.get('/friends').then(r => r.data),
  });
  const { data: requests = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests'],
    queryFn: () => api.get('/friends/requests').then(r => r.data),
  });

  const respond = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept'|'reject' }) =>
      api.put(`/friends/request/${requestId}`, { action }),
    onSuccess: (_, { action }) => {
      toast.success(action === 'accept' ? 'Friend accepted!' : 'Request rejected');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-8">

        {/* Header */}
        <motion.div variants={ITEM} initial="hidden" animate="visible" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Users className="w-5 h-5 text-indigo-400"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Friends</h1>
            <p className="text-slate-500 text-sm">{friends.length} connections</p>
          </div>
        </motion.div>

        {/* Pending requests */}
        {requests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Requests</p>
              <span className="text-xs font-semibold text-indigo-400 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                {requests.length}
              </span>
            </div>
            <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-2.5">
              {requests.map(req => (
                <motion.div key={req._id} variants={ITEM_LEFT}
                  className="flex items-center gap-3.5 card rounded-2xl p-3.5">
                  <Av user={req.from}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{req.from.name}</p>
                    <p className="text-slate-500 text-xs truncate mt-0.5">
                      {req.from.skills.slice(0, 2).map(s => s.name).join(' · ')}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                      onClick={() => respond.mutate({ requestId: req._id, action: 'accept' })}
                      disabled={respond.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 disabled:opacity-50 transition-colors"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <UserCheck className="w-3.5 h-3.5"/> Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                      onClick={() => respond.mutate({ requestId: req._id, action: 'reject' })}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <UserX className="w-4 h-4"/>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Friends grid */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">My Friends</p>
          {friends.length > 0 && <p className="text-xs text-slate-600">{friends.length} total</p>}
        </div>

        {isLoading
          ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin"/></div>
          : friends.length === 0
            ? <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="text-5xl">🤝</div>
                <div>
                  <p className="text-white font-black text-lg mb-1">No friends yet</p>
                  <p className="text-slate-500 text-sm">Match with people and send friend requests!</p>
                </div>
              </motion.div>
            : <motion.div variants={STAGGER} initial="hidden" animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friends.map(friend => (
                  <motion.div key={friend._id} variants={ITEM} whileHover={HOVER_LIFT}
                    className="card card-hover rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <Av user={friend}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm truncate">{friend.name}</p>
                          {friend.isOnline && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                              style={{ boxShadow: '0 0 6px rgba(52,211,153,0.7)' }}/>
                          )}
                        </div>
                        {friend.location && (
                          <p className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                            <MapPin className="w-3 h-3"/>{friend.location}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {friend.skills.slice(0, 2).map(s => (
                            <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full font-medium text-indigo-300"
                              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Link to={`/profile/${friend._id}`}>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center w-full mt-3 py-2 rounded-xl text-xs font-semibold text-slate-400 card hover:text-indigo-400 hover:border-indigo-500/20 transition-colors cursor-pointer">
                        View Profile
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
        }
      </div>
    </motion.div>
  );
};

export default Friends;
