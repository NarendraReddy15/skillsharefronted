import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, UserPlus, CheckCheck, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/api/axios';
import { Notification } from '@/types';
import { useNotificationStore } from '@/store/notificationStore';
import { STAGGER, ITEM } from '@/lib/motion';

const iconMap: Record<string, { Icon: any; pill: string; iconColor: string }> = {
  match:          { Icon: Heart,         pill: 'bg-rose-500/12 border-rose-500/25',   iconColor: 'text-rose-400' },
  message:        { Icon: MessageCircle, pill: 'bg-blue-500/12  border-blue-500/25',  iconColor: 'text-blue-400' },
  friend_request: { Icon: UserPlus,      pill: 'bg-emerald-500/12 border-emerald-500/25', iconColor: 'text-emerald-400' },
  friend_accept:  { Icon: CheckCheck,    pill: 'bg-indigo-500/12 border-indigo-500/25', iconColor: 'text-indigo-400' },
};

const labelMap: Record<string, string> = {
  match:          'You matched with',
  message:        'New message from',
  friend_request: 'Friend request from',
  friend_accept:  'accepted your friend request',
};

const NotificationPanel = () => {
  const queryClient = useQueryClient();
  const { markAllRead } = useNotificationStore();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data),
  });

  const markRead = useMutation({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => {
      markAllRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Bell className="w-5 h-5 text-indigo-400"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Notifications</h1>
            <p className="text-slate-500 text-sm">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
          </div>
        </div>
        <AnimatePresence>
          {unread > 0 && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              onClick={() => markRead.mutate()} disabled={markRead.isPending}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors disabled:opacity-50">
              {markRead.isPending
                ? <Loader2 className="w-3 h-3 animate-spin"/>
                : <CheckCheck className="w-3.5 h-3.5"/>}
              Mark all read
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {isLoading
        ? <div className="space-y-2.5">
            {Array.from({length: 4}).map((_,i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }}/>
            ))}
          </div>
        : notifications.length === 0
          ? <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)' }}>
                <Bell className="w-9 h-9 text-slate-600"/>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">No notifications yet</p>
                <p className="text-slate-500 text-sm">We'll let you know when something happens</p>
              </div>
            </motion.div>
          : <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-2">
              {notifications.map(n => {
                const cfg = iconMap[n.type] || iconMap.message;
                const { Icon } = cfg;
                return (
                  <motion.div key={n._id} variants={ITEM}
                    className={`flex items-start gap-3.5 rounded-2xl p-4 transition-all ${
                      n.read ? 'card' : ''
                    }`}
                    style={!n.read
                      ? { background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)' }
                      : undefined
                    }>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.pill}`}>
                      <Icon className={`w-4 h-4 ${cfg.iconColor}`}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-snug">
                        <span className="text-slate-500">{labelMap[n.type]} </span>
                        <span className="text-white font-semibold">{n.from?.name}</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5"
                        style={{ boxShadow: '0 0 8px rgba(99,102,241,0.6)' }}/>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
      }
    </div>
  );
};

export default NotificationPanel;
