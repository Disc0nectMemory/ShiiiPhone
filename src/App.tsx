import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Battery, 
  Wifi, 
  Signal, 
  Camera, 
  Flashlight, 
  Lock,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Music,
  Calendar,
  Settings,
  AppWindow,
  Compass,
  Map,
  Clock,
  Wallet,
  Cloud,
  Play
} from 'lucide-react';

// --- Components ---

const StatusBar = ({ dark = false }: { dark?: boolean }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex justify-between items-center px-8 pt-4 pb-2 w-full fixed top-0 z-50 ${dark ? 'text-black' : 'text-white'}`}>
      <div className="text-[15px] font-semibold">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>
      <div className="flex items-center gap-1.5">
        <Signal size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <Battery size={20} strokeWidth={2} className="rotate-0" />
      </div>
    </div>
  );
};

const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = time.toLocaleDateString('zh-CN', { 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative h-screen w-full bg-cover bg-center flex flex-col items-center justify-between py-16 overflow-hidden"
      style={{ backgroundImage: 'url(https://picsum.photos/seed/ios16/1170/2532)' }}
      onClick={onUnlock}
    >
      <div className="absolute inset-0 bg-black/10" />
      
      <StatusBar />

      <div className="z-10 flex flex-col items-center mt-12">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-white/90 text-xl font-medium mb-1"
        >
          {dateString}
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-white text-8xl font-bold tracking-tighter"
        >
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </motion.div>
      </div>

      <div className="z-10 w-full px-10 flex justify-between items-end mb-8">
        <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
          <Flashlight size={24} />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="text-white/70 text-sm font-medium animate-pulse-subtle">
            点击或上滑解锁
          </div>
          <div className="w-32 h-1.5 bg-white/40 rounded-full" />
        </div>
        <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
          <Camera size={24} />
        </div>
      </div>
    </motion.div>
  );
};

const AppIcon = ({ icon: Icon, label, color, onClick, showLabel = true }: any) => (
  <motion.div 
    whileTap={{ scale: 0.9 }}
    className="flex flex-col items-center gap-1.5"
    onClick={onClick}
  >
    <div className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center shadow-lg ${color}`}>
      <Icon size={34} color={color === 'bg-white' ? '#1c1c1e' : 'white'} strokeWidth={1.5} />
    </div>
    {showLabel && <span className="text-[11px] text-white font-medium">{label}</span>}
  </motion.div>
);

const HomeScreen = () => {
  const apps = [
    { icon: Mail, label: '邮件', color: 'bg-blue-500' },
    { icon: Calendar, label: '日历', color: 'bg-white' }, // Calendar is usually white
    { icon: Camera, label: '照片', color: 'bg-white' }, // Photos icon is complex, white bg is safer
    { icon: Camera, label: '相机', color: 'bg-gray-200' },
    { icon: Clock, label: '时钟', color: 'bg-black' },
    { icon: Map, label: '地图', color: 'bg-emerald-500' },
    { icon: Cloud, label: '天气', color: 'bg-sky-400' },
    { icon: MessageCircle, label: '信息', color: 'bg-green-500' },
    { icon: Music, label: '音乐', color: 'bg-white' },
    { icon: Compass, label: '浏览器', color: 'bg-white' },
    { icon: Wallet, label: '钱包', color: 'bg-black' },
    { icon: Settings, label: '设置', color: 'bg-gray-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="relative h-screen w-full bg-cover bg-center flex flex-col overflow-hidden"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)' }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      
      <StatusBar />

      {/* App Grid */}
      <div className="flex-1 px-6 pt-24 grid grid-cols-4 gap-x-4 gap-y-7 content-start z-10">
        {apps.map((app, i) => (
          <AppIcon key={i} {...app} />
        ))}
      </div>

      {/* Page Indicator */}
      <div className="flex justify-center gap-2 mb-6 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>

      {/* Dock */}
      <div className="px-4 pb-8 z-10">
        <div className="ios-blur rounded-[36px] px-4 py-4 flex justify-around items-center ios-shadow border border-white/10">
          <AppIcon icon={Phone} color="bg-green-500" showLabel={false} />
          <AppIcon icon={Compass} color="bg-white" showLabel={false} />
          <AppIcon icon={MessageCircle} color="bg-green-500" showLabel={false} />
          <AppIcon icon={Music} color="bg-white" showLabel={false} />
        </div>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2 z-10">
        <div className="w-32 h-1.5 bg-white/40 rounded-full" />
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto relative overflow-hidden shadow-2xl border-x border-white/10 bg-black">
      <AnimatePresence mode="wait">
        {isLocked ? (
          <LockScreen key="lock" onUnlock={() => setIsLocked(false)} />
        ) : (
          <HomeScreen key="home" />
        )}
      </AnimatePresence>
    </div>
  );
}
