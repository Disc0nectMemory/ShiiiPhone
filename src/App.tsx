import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import { 
  Camera, 
  Flashlight, 
  Search,
  MessageCircle,
  Phone,
  Mail,
  Music,
  Calendar,
  Settings,
  Compass,
  Map,
  Clock,
  Wallet,
  Cloud,
  Lock,
  ChevronUp,
  Wifi,
  Signal,
} from 'lucide-react';

// --- Components ---

const LiquidBackground = ({ dragY }: { dragY?: any }) => {
  const defaultDragY = useMotionValue(0);
  const activeDragY = dragY || defaultDragY;
  
  const blurValue = useTransform(activeDragY, [0, -400], [60, 100]);
  const scaleValue = useTransform(activeDragY, [0, -400], [1, 1.15]);
  const filterValue = useMotionTemplate`blur(${blurValue}px)`;
  
  // Dynamic blob movements based on drag
  const dragY1 = useTransform(activeDragY, [0, -400], [0, -120]);
  const dragY2 = useTransform(activeDragY, [0, -400], [0, 100]);
  const dragX1 = useTransform(activeDragY, [0, -400], [0, 60]);
  const dragX2 = useTransform(activeDragY, [0, -400], [0, -40]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <motion.div 
      onClick={toggleFullscreen}
      style={{ filter: filterValue, scale: scaleValue }}
      className="absolute inset-0 z-0 overflow-hidden bg-[#e0e0e5] cursor-pointer"
    >
      {/* Primary Blobs - Grayscale with more contrast */}
      <motion.div 
        style={{ y: dragY1 }} 
        className="liquid-blob w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-slate-400/40 top-[-10%] left-[-10%] opacity-80" 
      />
      <motion.div 
        style={{ y: dragY2, animationDelay: '-7s' }} 
        className="liquid-blob w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-zinc-500/30 bottom-[-5%] right-[-5%] opacity-70" 
      />
      <motion.div 
        style={{ x: dragX1, animationDelay: '-14s' }} 
        className="liquid-blob w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-stone-400/30 top-[20%] right-[-10%] opacity-60" 
      />
      <motion.div 
        style={{ x: dragX2, animationDelay: '-21s' }} 
        className="liquid-blob w-[75vw] h-[75vw] max-w-[750px] max-h-[750px] bg-gray-400/30 bottom-[10%] left-[-5%] opacity-50" 
      />
      
      {/* Accent Blobs for Mesh Effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-white/60 rounded-full blur-[80px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[30%] right-[20%] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] bg-slate-200/40 rounded-full blur-[90px]" 
      />

      {/* Noise Texture */}
      <div className="liquid-noise" />
      
      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
    </motion.div>
  );
};

const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [time, setTime] = useState(new Date());
  const dragY = useMotionValue(0);
  const smoothDragY = useSpring(dragY, { damping: 25, stiffness: 120 });
  
  const contentOpacity = useTransform(smoothDragY, [0, -250], [1, 0]);
  const contentScale = useTransform(smoothDragY, [0, -250], [1, 0.85]);
  const contentBlurValue = useTransform(smoothDragY, [0, -250], [0, 15]);
  const contentFilter = useMotionTemplate`blur(${contentBlurValue}px)`;
  
  const glassOpacity = useTransform(smoothDragY, [0, -150], [0, 0.6]);
  const glassBlur = useTransform(smoothDragY, [0, -400], [0, 60]);
  const backdropFilter = useMotionTemplate`blur(${glassBlur}px)`;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = time.toLocaleDateString('zh-CN', { 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  });

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y < -150) {
      onUnlock();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(60px)' }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      drag="y"
      dragConstraints={{ top: -600, bottom: 0 }}
      dragElastic={{ top: 0.15, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ y: smoothDragY }}
      className="relative h-screen w-full flex flex-col items-center justify-between pt-16 pb-6 overflow-hidden touch-none"
    >
      <LiquidBackground dragY={smoothDragY} />
      
      {/* Liquid Glass Overlay during swipe */}
      <motion.div 
        style={{ 
          opacity: glassOpacity,
          backdropFilter,
        }}
        className="absolute inset-0 z-10 bg-white/5 pointer-events-none"
      >
        {/* Shine effect */}
        <motion.div 
          style={{ 
            y: useTransform(smoothDragY, [0, -600], [400, -200]),
            opacity: useTransform(smoothDragY, [0, -300], [0, 0.4])
          }}
          className="absolute inset-x-0 h-[400px] bg-gradient-to-b from-white/20 to-transparent blur-3xl"
        />
      </motion.div>

      <motion.div 
        style={{ 
          opacity: contentOpacity, 
          scale: contentScale,
          filter: contentFilter
        }}
        className="z-20 flex flex-col items-center mt-[2vh]"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-black/50 text-[clamp(18px,4vw,24px)] font-semibold tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
            style={{ fontFamily: 'system-ui' }}
          >
            {dateString}
          </motion.div>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white font-bold tracking-[-0.04em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)] flex justify-center items-center"
            style={{ 
              fontFamily: 'Georgia',
              fontSize: '106px',
              lineHeight: '85px',
              width: '280px'
            }}
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        style={{ opacity: contentOpacity }}
        className="z-20 w-full flex flex-col items-center mb-0 gap-4"
      >
        <div className="w-full max-w-[600px] px-12 flex justify-between items-end pb-4">
          <div className="ios-liquid-button">
            <Flashlight size={24} strokeWidth={1.8} />
          </div>
          
          <div className="ios-liquid-button">
            <Camera size={24} strokeWidth={1.8} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PasscodeScreen: React.FC<{ onCancel: () => void; onSuccess: () => void }> = ({ onCancel, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleNumber = (num: string) => {
    if (passcode.length < 4) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);
      if (newPasscode.length === 4) {
        if (newPasscode === '0000') {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => {
            setPasscode('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const buttons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
  ];

  const keypadWidth = 264; // 72*3 + 24*2

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(30px)' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center pt-20 pb-12 overflow-hidden touch-none bg-black/20 backdrop-blur-sm"
    >
      <LiquidBackground />

      <div className="z-20 flex flex-col items-center mt-[8vh] gap-4">
        <div 
          className="text-white font-medium tracking-wide"
          style={{ fontFamily: 'system-ui', fontSize: '20px' }}
        >
          输入密码
        </div>
        
        <motion.div 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-5 mt-1"
        >
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full border-[1.5px] border-white transition-colors duration-200 ${
                passcode.length > i ? 'bg-white' : 'bg-transparent'
              }`} 
            />
          ))}
        </motion.div>
      </div>

      <div className="z-20 mt-[7vh] grid grid-cols-3 gap-x-[24px] gap-y-[16px]">
        {buttons.map((btn) => (
          <button key={btn.num} onClick={() => handleNumber(btn.num)} className="keypad-button">
            <span className="text-[32px] font-normal leading-none">{btn.num}</span>
            {btn.letters && (
              <span className="text-[9px] font-bold tracking-[0.05em] mt-0.5 opacity-90">{btn.letters}</span>
            )}
          </button>
        ))}
        <div />
        <button onClick={() => handleNumber('0')} className="keypad-button">
          <span className="text-[32px] font-normal leading-none">0</span>
        </button>
        <div />
      </div>

      <button 
        className="z-20 absolute text-white font-normal active:opacity-40 transition-opacity drop-shadow-md" 
        style={{ 
          fontFamily: 'system-ui', 
          fontSize: '16px',
          left: `calc((100vw - ${keypadWidth}px) / 2)`,
          bottom: `calc((100vw - ${keypadWidth}px) / 2)`
        }}
      >
        紧急情况
      </button>
      <button 
        onClick={onCancel}
        className="z-20 absolute text-white font-normal active:opacity-40 transition-opacity drop-shadow-md" 
        style={{ 
          fontFamily: 'system-ui', 
          fontSize: '16px',
          right: `calc((100vw - ${keypadWidth}px) / 2)`,
          bottom: `calc((100vw - ${keypadWidth}px) / 2)`
        }}
      >
        取消
      </button>
    </motion.div>
  );
};

const AppIcon = ({ icon: Icon, label, color, onClick, showLabel = true }: any) => (
  <motion.div 
    whileTap={{ scale: 0.9 }}
    className="flex flex-col items-center gap-1.5"
    onClick={onClick}
  >
    <div className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center shadow-lg relative overflow-hidden ${color}`}>
      {/* Liquid Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      <Icon size={38} color={color === 'bg-white' ? '#1c1c1e' : 'white'} strokeWidth={1.5} className="relative z-10" />
    </div>
    {showLabel && <span className="text-[12px] text-black/80 font-medium tracking-tight">{label}</span>}
  </motion.div>
);

const HomeScreen: React.FC = () => {
  const apps = [
    { icon: Mail, label: '邮件', color: 'bg-blue-500' },
    { icon: Calendar, label: '日历', color: 'bg-white' },
    { icon: Camera, label: '照片', color: 'bg-white' },
    { icon: Camera, label: '相机', color: 'bg-gray-100' },
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
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="relative h-screen w-full flex flex-col overflow-hidden"
    >
      <LiquidBackground />

      {/* App Grid */}
      <div className="flex-1 px-7 pt-16 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-4 gap-y-7 content-start z-10 overflow-y-auto pb-32">
        {apps.map((app, i) => (
          <AppIcon key={i} {...app} />
        ))}
      </div>

      {/* Search Pill */}
      <div className="fixed bottom-[140px] left-1/2 -translate-x-1/2 z-10">
        <div className="liquid-glass-dark px-4 py-1.5 rounded-full flex items-center gap-1.5">
          <Search size={12} className="text-black/40" strokeWidth={3} />
          <span className="text-[11px] text-black/60 font-bold tracking-tight">搜索</span>
        </div>
      </div>

      {/* Page Indicator */}
      <div className="fixed bottom-[115px] left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
      </div>

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[95%] sm:max-w-[600px] px-4 z-10">
        <div className="liquid-glass rounded-[38px] px-4 py-4 flex justify-around items-center">
          <AppIcon icon={Phone} color="bg-green-500" showLabel={false} />
          <AppIcon icon={Compass} color="bg-white" showLabel={false} />
          <AppIcon icon={MessageCircle} color="bg-green-500" showLabel={false} />
          <AppIcon icon={Music} color="bg-white" showLabel={false} />
        </div>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2 z-10">
        <div className="w-32 h-1.25 bg-white/20 rounded-full" />
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [isEnteringPasscode, setIsEnteringPasscode] = useState(false);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-white">
      <AnimatePresence mode="wait">
        {isLocked ? (
          !isEnteringPasscode ? (
            <LockScreen key="lock" onUnlock={() => setIsEnteringPasscode(true)} />
          ) : (
            <PasscodeScreen 
              key="passcode" 
              onCancel={() => setIsEnteringPasscode(false)} 
              onSuccess={() => {
                setIsLocked(false);
                setIsEnteringPasscode(false);
              }} 
            />
          )
        ) : (
          <HomeScreen key="home" />
        )}
      </AnimatePresence>
    </div>
  );
}
