import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, MessageCircle } from 'lucide-react';
import api from '@/api/axios';
import { Match } from '@/types';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { PAGE } from '@/lib/motion';

const Chat = () => {
  const { matchId } = useParams();

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: () => api.get('/matches').then(r => r.data),
  });

  const active = matchId ? matches.find(m => m._id === matchId) : null;

  return (
    <motion.div variants={PAGE} initial="initial" animate="animate" exit="exit"
      className="bg-[#080b14] md:pl-64">
      <div className="flex" style={{ height: '100dvh' }}>
        {/* Inner layout handles mobile top/bottom bars */}
        <div className="flex w-full pt-14 pb-16 md:pt-0 md:pb-0">

          {/* Sidebar list */}
          <div className={`w-full md:w-80 flex flex-col flex-shrink-0 ${matchId ? 'hidden md:flex' : 'flex'}`}
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0c0c1a' }}>
            <div className="px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h1 className="text-lg font-black text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-400"/>
                Messages
              </h1>
            </div>
            {isLoading
              ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 text-indigo-400 animate-spin"/></div>
              : <ChatList matches={matches}/>
            }
          </div>

          {/* Chat window */}
          <div className={`flex-1 flex flex-col ${matchId ? 'flex' : 'hidden md:flex'}`}>
            {active
              ? <ChatWindow match={active}/>
              : <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-5">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <MessageCircle className="w-9 h-9 text-indigo-400"/>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">Select a conversation</h3>
                    <p className="text-slate-500 text-sm max-w-xs">Choose from your matches on the left to start chatting</p>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
