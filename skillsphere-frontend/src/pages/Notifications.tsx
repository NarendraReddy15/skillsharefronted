import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/api/axios';
import { useNotificationStore } from '@/store/notificationStore';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import { PAGE } from '@/lib/motion';

const Notifications = () => {
  const { setUnreadCount } = useNotificationStore();

  const { data } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => api.get('/notifications/unread-count').then(r => r.data),
  });

  useEffect(() => {
    if (data) setUnreadCount(data.count);
  }, [data, setUnreadCount]);

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[#080b14] pt-14 pb-20 md:pt-0 md:pl-64">
      <div className="max-w-xl mx-auto px-4 pt-8 pb-8">
        <NotificationPanel/>
      </div>
    </motion.div>
  );
};

export default Notifications;
