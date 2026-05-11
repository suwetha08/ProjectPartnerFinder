import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Users, 
  Search,
  MessageSquare,
  Code as CodeIcon,
  User as UserIcon,
  Circle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import GlassCard from '../components/ui/GlassCard';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const TeamChatPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchTeamProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API}/api/projects`, {
          params: { member: user._id },
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(data);
        if (projectId) {
          const active = data.find(p => p._id === projectId);
          setCurrentProject(active);
        } else if (data.length > 0) {
          setCurrentProject(data[0]);
        }
      } catch (error) {
        toast.error('Failed to load team projects');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTeamProjects();
  }, [user, projectId]);

  useEffect(() => {
    if (socket && currentProject) {
      socket.emit('join_project', currentProject._id);

      socket.on('new_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket, currentProject]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      projectId: currentProject._id,
      message: {
        _id: Date.now().toString(),
        sender: {
          _id: user._id,
          name: user.name,
          profileImage: user.profileImage
        },
        content: newMessage,
        createdAt: new Date().toISOString(),
      }
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 h-[calc(100vh-120px)] flex gap-6">
      {/* Sidebar - Project List */}
      <div className="hidden md:flex flex-col w-80 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Teams</h2>
          <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Search size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {projects.map((p) => (
            <button
              key={p._id}
              onClick={() => setCurrentProject(p)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                currentProject?._id === p._id 
                  ? 'bg-purple-500/20 border-purple-500/50' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0">
                  <Users size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{p.title}</p>
                  <p className="text-xs text-slate-500 truncate">{p.domain}</p>
                </div>
                {currentProject?._id === p._id && (
                  <Circle size={8} className="fill-purple-500 text-purple-500" />
                )}
              </div>
            </button>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 text-sm">No teams joined yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden">
        {currentProject ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-purple-400">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{currentProject.title}</h3>
                  <p className="text-xs text-green-500 flex items-center space-x-1">
                    <Circle size={8} className="fill-green-500" />
                    <span>8 Members Online</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                  <Users size={20} />
                </button>
                <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="text-center py-10">
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest bg-white/5 inline-block px-4 py-2 rounded-full border border-white/10">
                  Beginning of team collaboration
                </p>
              </div>
              
              {messages.map((msg, i) => {
                const isMe = msg.sender?._id === user?._id;
                return (
                  <motion.div
                    key={msg._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end space-x-3`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                        <img src={msg.sender?.profileImage || `https://ui-avatars.com/api/?name=${msg.sender?.name}`} alt="" />
                      </div>
                    )}
                    <div className={`max-w-[70%] space-y-1`}>
                      {!isMe && <p className="text-[10px] font-bold text-slate-500 ml-2">{msg.sender?.name}</p>}
                      <div className={`p-4 rounded-2xl text-sm ${
                        isMe 
                          ? 'bg-purple-600 text-white rounded-br-none' 
                          : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <p className={`text-[10px] text-slate-600 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 bg-white/5 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="relative flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button type="button" className="p-3 text-slate-500 hover:text-white transition-colors">
                    <Paperclip size={22} />
                  </button>
                </div>
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-purple-500 outline-none transition-all text-white pr-14"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    <Smile size={22} />
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={22} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 text-slate-700">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Team Collaboration</h3>
            <p className="text-slate-500 max-w-sm">Select a project from the sidebar to start chatting with your team members in real-time.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default TeamChatPage;
