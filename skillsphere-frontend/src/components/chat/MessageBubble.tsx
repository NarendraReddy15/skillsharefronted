import { motion } from 'framer-motion';
import { Message } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { MSG } from '@/lib/motion';

const MessageBubble = ({ message }: { message: Message }) => {
  const { user } = useAuthStore();
  const isOwn = message.sender._id === user?._id;

  return (
    <motion.div
      variants={MSG} initial="initial" animate="animate"
      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && (
        message.sender.avatar
          ? <img src={message.sender.avatar} alt={message.sender.name}
              className="w-6 h-6 rounded-lg object-cover flex-shrink-0 mb-1"/>
          : <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-1 brand-gradient">
              {message.sender.name[0]}
            </div>
      )}

      <div className={`max-w-[72%] sm:max-w-sm flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`px-3.5 py-2.5 text-sm leading-relaxed break-words rounded-2xl ${
          isOwn
            ? 'text-white rounded-br-sm'
            : 'text-slate-100 rounded-bl-sm'
          }`}
          style={isOwn
            ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }
            : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }
          }
        >
          {message.content}
        </div>
        <span className="text-[10px] text-slate-600 mt-1 px-1 flex items-center gap-1">
          {format(new Date(message.createdAt), 'HH:mm')}
          {isOwn && <span className="text-indigo-500/60">{message.read ? '✓✓' : '✓'}</span>}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
