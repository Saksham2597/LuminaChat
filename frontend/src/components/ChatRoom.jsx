import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, ArrowLeft, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const newSocket = io(API_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_room', roomId);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId, navigate]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      roomId,
      content: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div className="flex h-screen flex-col bg-[#e0e5ec] relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between neu-flat px-6 py-5 rounded-b-[2rem] mx-2 mt-2">
        <div className="flex items-center gap-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
            className="rounded-full p-3 neu-convex neu-active text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-700 flex items-center gap-2">
              {roomId}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Live connection</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-12 w-12 rounded-full neu-pressed text-indigo-500">
          <Users size={20} strokeWidth={2.5} />
        </div>
      </header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="mx-auto max-w-4xl space-y-8 pb-4">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full items-center justify-center pt-32"
            >
              <div className="text-center p-10 neu-flat rounded-[3rem] max-w-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full neu-pressed text-indigo-400 mb-6">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-700 mb-3">It's quiet here...</h3>
                <p className="text-base text-slate-500 font-medium">Be the first to send a message in this space!</p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === localStorage.getItem('userId');
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="mb-2 px-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                      {msg.sender?.email?.split('@')[0] || 'Unknown'}
                    </span>
                    <div
                      className={`max-w-[75%] px-6 py-4 text-base font-medium leading-relaxed ${
                        isMe
                          ? 'neu-flat text-indigo-700 rounded-3xl rounded-tr-md border border-white/40'
                          : 'neu-pressed text-slate-700 rounded-3xl rounded-tl-md border border-white/20'
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="relative z-20 pb-6 px-6 pt-2">
        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-4xl items-center gap-4 p-3 neu-flat rounded-full"
        >
          <div className="relative flex-1 h-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-full rounded-full neu-pressed neu-pressed-focus px-6 py-4 text-base font-medium text-slate-700 placeholder-slate-400 border border-white/20"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!newMessage.trim()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full neu-convex neu-active text-indigo-600 focus:outline-none transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Send size={22} strokeWidth={2.5} className="ml-1 shrink-0" />
          </motion.button>
        </form>
      </footer>
    </div>
  );
}
