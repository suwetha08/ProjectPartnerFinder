import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, UserPlus, Star } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'apply',
      message: 'You applied to "AI Content Generator"',
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-blue-400'
    },
    {
      id: 2,
      type: 'message',
      message: 'New message in "Crypto Portfolio Tracker"',
      time: '5 hours ago',
      icon: MessageSquare,
      color: 'text-purple-400'
    },
    {
      id: 3,
      type: 'team',
      message: 'You were accepted into "EduTech Platform"',
      time: '1 day ago',
      icon: UserPlus,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity, i) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center space-x-4 p-4 glass-effect rounded-xl"
        >
          <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${activity.color}`}>
            <activity.icon size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{activity.message}</p>
            <p className="text-xs text-slate-500">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;
