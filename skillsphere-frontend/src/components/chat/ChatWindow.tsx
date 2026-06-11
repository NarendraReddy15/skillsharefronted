import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, Video, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import { Match, Message } from '@/types';
import { useAuthStore } from '@/store/authStore';
import MessageBubble from './MessageBubble';
import { getSocket } from '@/hooks/useSocket';

const ChatWindow = ({ match }: { match: Match }) => {
  const [input,     setInput]    = useState('');
  const [isTyping,  setIsTyping] = useState(false);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const socket      = getSocket();
  const { user: me } = useAuthStore();
  const navigate    = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['messages', match._id],
    queryFn: () => api.get(`/messages/${match._id}`).then(r => r.data),
    refetchOnWindowFocus: false,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => api.post(`/messages/${match._id}`, { content }).then(r => r.data),
    onSuccess: msg => {
      queryClient.setQueryData(['messages', match._id], (old: any) => ({
        ...old, messages: [...(old?.messages ?? []), msg],
      }));
      setInput('');
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onError: () => toast.error('Failed to send'),
  });

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_match', match._id);

    const onMessage = (msg: Message) => {
      if (msg.sender._id === me?._id) return;
      queryClient.setQueryData(['messages', match._id], (old: any) => ({
        ...old, messages: [...(old?.messages ?? []), msg],
      }));
    };
    const onTyping = ({ userId, isTyping: t }: { userId: string; isTyping: boolean }) => {
      if (userId !== match.user._id) return;
      setIsTyping(t);
    };

    socket.on('new_message', onMessage);
    socket.on('user_typing',  onTyping);
    return () => {
      socket.emit('leave_match', match._id);
      socket.off('new_message', onMessage);
      socket.off('user_typing',  onTyping);
    };
  }, [socket, match._id, me?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages]);

  const send = () => {
    if (!input.trim() || sendMutation.isPending) return;
    sendMutation.mutate(input.trim());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: 'rgba(12,12,26,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/chat')}
            className="md:hidden p-1.5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5"/>
          </motion.button>
          <div className="relative">
            {match.user?.avatar
              ? <img src={match.user.avatar} alt={match.user.name} className="w-9 h-9 rounded-xl object-cover"/>
              : <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm brand-gradient">
                  {match.user?.name[0]}
                </div>
            }
            {match.user?.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2"
                style={{ borderColor: '#0c0c1a' }}/>
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{match.user?.name}</p>
            <p className="text-[11px] leading-tight">
              {isTyping
                ? <span className="text-indigo-400">typing...</span>
                : match.user?.isOnline
                  ? <span className="text-emerald-400">Active now</span>
                  : <span className="text-slate-500">Offline</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {[Phone, Video].map((Icon, i) => (
            <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors">
              <Icon className="w-4 h-4"/>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scroll-area space-y-1">
        {isLoading
          ? <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-indigo-400 animate-spin"/></div>
          : <>
              <AnimatePresence initial={false}>
                {data?.messages?.map((msg: Message) => (
                  <MessageBubble key={msg._id} message={msg}/>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 py-1">
                    <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-bl-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {[0,1,2].map(i => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 block"
                          animate={{ y: [0,-4,0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}/>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef}/>
            </>
        }
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,11,20,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.88 }}
            onClick={send}
            disabled={!input.trim() || sendMutation.isPending}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 brand-gradient disabled:opacity-40 transition-opacity">
            {sendMutation.isPending
              ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin"/>
              : <Send className="w-3.5 h-3.5 text-white"/>}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
