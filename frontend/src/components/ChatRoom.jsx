import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, ArrowLeft } from 'lucide-react';
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
    <div className="flex h-screen flex-col bg-gray-900">
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Room: {roomId}</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-400"></span> Connected
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center pt-20">
              <p className="text-gray-500">No messages yet. Be the first to say hi!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === localStorage.getItem('userId');
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="mb-1 text-xs text-gray-500">
                    {msg.sender?.email || 'Unknown'}
                  </span>
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900 p-4">
        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-4xl items-center gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-700 bg-gray-800 px-6 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
}
