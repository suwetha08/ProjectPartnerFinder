import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(data);
      } catch (error) {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification removed');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application': return { emoji: '👤', color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'acceptance': return { emoji: '✅', color: 'text-green-400', bg: 'bg-green-500/10' };
      case 'rejection': return { emoji: '❌', color: 'text-pink-400', bg: 'bg-pink-500/10' };
      case 'team_invite': return { emoji: '⭐', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      default: return { emoji: '🔔', color: 'text-purple-400', bg: 'bg-purple-500/10' };
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
          <span>🔔</span>
          <span>Notifications</span>
        </h1>
        {notifications.length > 0 && (
          <button className="text-sm text-slate-500 hover:text-white transition-colors">Mark all as read</button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((n, i) => {
          const config = getIcon(n.type);
          return (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className={`p-5 flex items-start space-x-4 group ${n.read ? 'opacity-60' : 'border-purple-500/30'}`}>
                <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0 ${config.color} text-xl`}>
                  {config.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-white ${n.read ? 'text-slate-400' : ''}`}>{n.title}</h3>
                    <div className="flex items-center space-x-2">
                      {!n.read && (
                        <button 
                          onClick={() => markAsRead(n._id)}
                          className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-green-400 transition-colors"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(n._id)}
                        className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-pink-400 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{n.message}</p>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    🕐
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="py-20 text-center glass-effect rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-600 text-3xl">
              🔔
            </div>
            <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
            <p className="text-slate-500">You don't have any new notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
