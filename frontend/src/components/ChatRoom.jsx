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
    <div className="flex h-screen flex-col bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between glass-panel border-x-0 border-t-0 border-b-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
            className="rounded-full p-2.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="animated-gradient-text">{roomId}</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <p className="text-xs text-cyan-400 font-medium">Live connection</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 text-gray-400">
          <Users size={18} />
        </div>
      </header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full items-center justify-center pt-32"
            >
              <div className="text-center p-8 glass-panel rounded-3xl max-w-sm border border-white/5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-purple-400 mb-4">
                  <Send size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">It's quiet here...</h3>
                <p className="text-sm text-gray-400">Be the first to send a message in this space!</p>
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
                    <span className="mb-1.5 px-1 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                      {msg.sender?.email?.split('@')[0] || 'Unknown'}
                    </span>
                    <div
                      className={`max-w-[75%] px-5 py-3.5 shadow-xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm'
                          : 'glass-panel text-gray-100 rounded-2xl rounded-tl-sm'
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
      <footer className="relative z-20 border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl p-4 sm:p-6">
        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-4xl items-center gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full rounded-full glass-input px-6 py-4 pr-12 text-sm font-medium"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newMessage.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Send size={18} className="ml-1 shrink-0" />
          </motion.button>
        </form>
      </footer>
    </div>
  );
}
