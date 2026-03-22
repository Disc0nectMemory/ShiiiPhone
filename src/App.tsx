import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate, MotionValue, animate } from 'motion/react';
import ImageCropper from './components/ImageCropper';
import { ApiSettingsPage } from './components/ApiSettings';
import WallpaperSettingsPage from './components/WallpaperSettings';
import FontSettingsPage, { FontFamily } from './components/FontSettings';
import { DEFAULT_AVATAR } from './constants';
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
  ChevronRight,
  ChevronLeft,
  Wifi,
  Signal,
  User,
  MoreHorizontal,
  Plus,
  BookUser,
  Globe,
  Home,
  Video,
  X,
  Check,
  Smile,
  Info,
  Key,
  Palette,
  Type,
  HeartPulse,
} from 'lucide-react';

// --- Components ---

const LiquidBackground = ({ src, blur = 0, dragY }: { src?: string | null, blur?: number, dragY?: MotionValue<number> }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {src ? (
        <img 
          src={src} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ filter: `blur(${blur}px)`, transform: blur > 0 ? 'scale(1.1)' : 'scale(1)' }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-[#e0e0e5]" />
      )}
    </div>
  );
};

const LockScreen: React.FC<{ onUnlock: () => void; dragY: MotionValue<number>; config: WallpaperConfig }> = ({ onUnlock, dragY, config }) => {
  const [time, setTime] = useState(new Date());
  const smoothDragY = useSpring(dragY as any, { damping: 25, stiffness: 120 }) as unknown as MotionValue<number>;
  
  const contentOpacity = useTransform(smoothDragY, [0, -250], [1, 0]);
  const contentScale = useTransform(smoothDragY, [0, -250], [1, 0.85]);
  const contentBlurValue = useTransform(smoothDragY, [0, -250], [0, 15]);
  const contentFilter = useTransform(contentBlurValue, (v) => `blur(${v}px)`);
  
  const glassOpacity = useTransform(smoothDragY, [0, -150], [0, 0.6]);
  const glassBlur = useTransform(smoothDragY, [0, -400], [0, 60]);
  const backdropFilter = useTransform(glassBlur, (v) => `blur(${v}px)`);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dateString = `${time.getMonth() + 1}月${time.getDate()}日${weekDays[time.getDay()]}`;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between pt-16 pb-6 select-none">
      <LiquidBackground src={config.lockWallpaper} dragY={smoothDragY} />
      
      <motion.div 
        style={{ 
          opacity: contentOpacity, 
          scale: contentScale,
          filter: contentFilter
        }}
        className="z-20 flex flex-col items-center mt-[2vh]"
      >
        <div className="flex flex-col items-center gap-0">
          <motion.div 
            className="text-[22px] font-semibold tracking-tight transition-colors duration-500"
            style={{ color: config.lockDateColor || '#707072' }}
          >
            {dateString}
          </motion.div>
          <motion.div 
            className="font-bold tracking-[-0.04em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] flex justify-center items-center transition-colors duration-500"
            style={{ 
              fontFamily: 'Georgia',
              fontSize: '106px',
              lineHeight: '85px',
              width: '280px',
              marginTop: '5px',
              color: config.lockTimeColor || 'white'
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
        <div className="w-full max-w-[600px] px-12 flex justify-between items-end pb-12">
          <motion.div whileTap={{ scale: 0.9 }} className="ios-liquid-button cursor-pointer outline-none touch-manipulation will-change-transform">
            <Flashlight size={24} strokeWidth={1.8} />
          </motion.div>
          
          <motion.div whileTap={{ scale: 0.9 }} className="ios-liquid-button cursor-pointer outline-none touch-manipulation will-change-transform">
            <Camera size={24} strokeWidth={1.8} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const PasscodeScreen: React.FC<{ onCancel: () => void; onSuccess: () => void; dragY: MotionValue<number> }> = ({ onCancel, onSuccess, dragY }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const passcodeRef = useRef('');
  const smoothDragY = useSpring(dragY as any, { damping: 25, stiffness: 120 }) as unknown as MotionValue<number>;

  const handleNumber = (num: string) => {
    if (error) return;
    if (navigator.vibrate) navigator.vibrate(10);
    if (passcodeRef.current.length < 4) {
      const next = passcodeRef.current + num;
      passcodeRef.current = next;
      setPasscode(next);
      
      if (next.length === 4) {
        if (next === '0000') {
          onSuccess();
        } else {
          setError(true);
          if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
          setTimeout(() => {
            passcodeRef.current = '';
            setPasscode('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    if (error) return;
    if (passcodeRef.current.length > 0) {
      const next = passcodeRef.current.slice(0, -1);
      passcodeRef.current = next;
      setPasscode(next);
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

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center pt-20 pb-12 select-none"
    >
      {/* Uniform darkening overlay for the wallpaper */}
      <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
      
      <div className="z-20 flex flex-col items-center mt-[8vh] gap-6">
        <div 
          className="text-white font-normal tracking-wide"
          style={{ fontSize: '20px' }}
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
              className={`passcode-dot ${
                passcode.length > i ? 'filled' : ''
              }`} 
            />
          ))}
        </motion.div>
      </div>

      <div className="z-20 mt-[7vh] grid grid-cols-3 gap-x-[24px] gap-y-[16px]">
        {buttons.map((btn) => (
          <button 
            key={btn.num} 
            onPointerDown={(e) => {
              e.preventDefault();
              handleNumber(btn.num);
            }} 
            className="keypad-button outline-none touch-manipulation will-change-transform"
          >
            <span className="text-[32px] font-bold leading-none">{btn.num}</span>
            {btn.letters && (
              <span className="text-[9px] font-bold tracking-[0.05em] mt-0.5 opacity-90">{btn.letters}</span>
            )}
          </button>
        ))}
        <div />
        <button 
          onPointerDown={(e) => {
            e.preventDefault();
            handleNumber('0');
          }} 
          className="keypad-button outline-none"
        >
          <span className="text-[32px] font-bold leading-none">0</span>
        </button>
        <div />
      </div>

      <div className="z-20 mt-auto w-full max-w-[320px] flex justify-between items-center px-8 pb-12">
        <button 
          className="text-white font-normal active:opacity-40 transition-opacity outline-none" 
          style={{ 
            fontSize: '16px',
          }}
        >
          紧急情况
        </button>
        <button 
          onPointerDown={(e) => {
            e.preventDefault();
            if (passcode.length > 0) {
              handleDelete();
            } else {
              onCancel();
            }
          }}
          className="text-white font-normal active:opacity-40 transition-opacity w-[64px] text-right outline-none" 
          style={{ 
            fontSize: '16px',
          }}
        >
          {passcode.length > 0 ? '删除' : '取消'}
        </button>
      </div>
    </motion.div>
  );
};

interface WallpaperConfig {
  lockWallpaper: string | null;
  homeWallpaper: string | null;
  homeWallpaperMode: 'original' | 'blurred' | 'custom';
  homeBlurAmount: number;
  lockDateColor?: string;
  lockTimeColor?: string;
  fontFamily?: FontFamily;
}

const AppIcon = ({ icon: Icon, image, label, color, onClick, showLabel = true, className = "", iconSize = 32 }: any) => (
  <div 
    className={`flex flex-col items-center gap-1.5 cursor-pointer select-none ${className}`}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
  >
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className={`w-full aspect-square rounded-[22px] flex items-center justify-center shadow-sm relative overflow-hidden outline-none touch-manipulation will-change-transform ${color}`}
    >
      {/* Liquid Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
      {image ? (
        <img src={image} alt={label} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        Icon && <Icon size={iconSize} color={color.includes('white') || color.includes('100') || color.includes('200') ? '#1c1c1e' : 'white'} strokeWidth={1.5} className="relative z-10 opacity-60" />
      )}
    </motion.div>
    {showLabel && <span className="text-[12px] text-black/80 font-medium tracking-tight">{label}</span>}
  </div>
);

const SettingsApp = ({ onClose, wallpaperConfig, onUpdateWallpaper }: { 
  onClose: () => void; 
  wallpaperConfig: WallpaperConfig;
  onUpdateWallpaper: (config: WallpaperConfig) => void;
}) => {
  const [activePage, setActivePage] = useState<'main' | 'api' | 'aesthetic' | 'wallpaper' | 'font'>('main');

  const settingsItems = [
    { id: 'api', label: 'API设定', icon: Key, action: () => setActivePage('api') },
    { id: 'aesthetic', label: '美化设置', icon: Palette, action: () => setActivePage('aesthetic') },
    { id: 'font', label: '字体设置', icon: Type, action: () => setActivePage('font') },
    { id: 'heartbeat', label: '角色心跳', icon: HeartPulse, action: () => {} },
  ];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[60] bg-[#f5f5f5] flex flex-col select-none"
    >
      {activePage === 'main' ? (
        <>
          <div className="pt-16 pb-4 flex flex-col items-center">
            <span className="text-[15px] font-semibold text-black/80 tracking-widest mb-4">设置</span>
            <div className="w-full h-[1px] bg-black/5" />
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 pb-10 bg-[#f5f5f5] space-y-1 mt-2">
            {settingsItems.map((item) => (
              <div key={item.id}>
                <div 
                  className="py-4 flex items-center cursor-pointer active:opacity-50 transition-opacity"
                  onClick={item.action}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-black/60" strokeWidth={1.5} />
                    <span className="text-[14px] font-bold text-black/80 tracking-widest">{item.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : activePage === 'aesthetic' ? (
        <>
          <div className="pt-16 pb-4 flex flex-col items-center relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setActivePage('main')}
              className="absolute left-6 top-16 p-2 -ml-2 text-black/40"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <span className="text-[15px] font-semibold text-black/80 tracking-widest mb-4">美化设置</span>
            <div className="w-full h-[1px] bg-black/5" />
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 pb-10 bg-[#f5f5f5] space-y-4 mt-4">
            <div 
              className="py-4 flex items-center justify-between cursor-pointer active:opacity-50 transition-opacity"
              onClick={() => setActivePage('wallpaper')}
            >
              <span className="text-[14px] font-bold text-black/80 tracking-widest">更换手机壁纸</span>
            </div>
            <div className="w-full h-[1px] bg-black/5" />
            <div 
              className="py-4 flex items-center justify-between cursor-pointer active:opacity-50 transition-opacity"
              onClick={() => setActivePage('font')}
            >
              <span className="text-[14px] font-bold text-black/80 tracking-widest">更换手机字体</span>
            </div>
          </div>
        </>
      ) : activePage === 'api' ? (
        <div className="absolute inset-0 z-10 bg-[#f5f5f5]">
          <ApiSettingsPage onBack={() => setActivePage('main')} />
        </div>
      ) : activePage === 'font' ? (
        <div className="absolute inset-0 z-10 bg-[#f5f5f5]">
          <FontSettingsPage 
            onBack={() => setActivePage('aesthetic')} 
            currentFont={wallpaperConfig.fontFamily || 'sans'}
            onSave={(font) => onUpdateWallpaper({ ...wallpaperConfig, fontFamily: font })}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-10 bg-[#f5f5f5]">
          <WallpaperSettingsPage 
            onBack={() => setActivePage('aesthetic')} 
            config={wallpaperConfig}
            onSave={onUpdateWallpaper}
          />
        </div>
      )}

      {/* Home Indicator to close */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[70]">
        <div 
          onClick={onClose}
          className="w-32 h-1 bg-black/20 rounded-full cursor-pointer outline-none" 
        />
      </div>
    </motion.div>
  );
};

const WorldBookApp = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[60] bg-[#f5f5f5] flex flex-col select-none"
    >
      <div className="pt-16 pb-4 flex flex-col items-center relative">
        <span className="text-[15px] font-semibold text-black/80 tracking-widest mb-4">世界书</span>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="absolute right-6 top-16 p-2 -mr-2 text-black/40"
        >
          <Plus size={24} />
        </motion.button>
        <div className="w-full h-[1px] bg-black/5" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-10 bg-[#f5f5f5] flex flex-col items-center justify-center opacity-40">
        <div className="w-16 h-16 rounded-full border-2 border-black/20 flex items-center justify-center mb-4">
          <Globe size={24} className="text-black/40" />
        </div>
        <span className="text-[14px] font-black tracking-[0.2em] uppercase text-black/60">世界列表为空</span>
      </div>

      {/* Home Indicator to close */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[70]">
        <div 
          onClick={onClose}
          className="w-32 h-1 bg-black/20 rounded-full cursor-pointer outline-none" 
        />
      </div>
    </motion.div>
  );
};

const CharacterBookApp = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[60] bg-[#f5f5f5] flex flex-col select-none"
    >
      <div className="pt-16 pb-4 flex flex-col items-center relative">
        <span className="text-[15px] font-semibold text-black/80 tracking-widest mb-4">角色书</span>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="absolute right-6 top-16 p-2 -mr-2 text-black/40"
        >
          <Plus size={24} />
        </motion.button>
        <div className="w-full h-[1px] bg-black/5" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-10 bg-[#f5f5f5] flex flex-col items-center justify-center opacity-40">
        <div className="w-16 h-16 rounded-full border-2 border-black/20 flex items-center justify-center mb-4">
          <BookUser size={24} className="text-black/40" />
        </div>
        <span className="text-[14px] font-black tracking-[0.2em] uppercase text-black/60">角色列表为空</span>
      </div>

      {/* Home Indicator to close */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[70]">
        <div 
          onClick={onClose}
          className="w-32 h-1 bg-black/20 rounded-full cursor-pointer outline-none" 
        />
      </div>
    </motion.div>
  );
};

const ChatApp = ({ onClose }: { onClose: () => void }) => {
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [diaryContent, setDiaryContent] = useState('');
  const [mood, setMood] = useState('✨');
  const [activeTab, setActiveTab] = useState('Chats');
  const [direction, setDirection] = useState(0);

  const TABS = ['Chats', 'Contacts', 'Discover', 'Me'];

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;
    const currentIndex = TABS.indexOf(activeTab);
    const newIndex = TABS.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '20%' : '-20%',
      opacity: 0,
      scale: 0.96,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.4, type: 'spring', stiffness: 300, damping: 30 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '20%' : '-20%',
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.4, type: 'spring', stiffness: 300, damping: 30 },
      },
    }),
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const todayDate = now.getDate();
  const dayOfWeek = now.getDay(); // 0 is Sunday

  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(todayDate - dayOfWeek);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      date: d.getDate(),
      day: ['日', '一', '二', '三', '四', '五', '六'][i],
      isToday: d.getDate() === todayDate && d.getMonth() === now.getMonth(),
      lunar: ['初七', '初八', '初九', '初十', '十一', '十二', '十三'][i] // Mock lunar for aesthetic
    };
  });

  const weekRange = `${weekDates[0].date} ~ ${weekDates[6].date}`;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="absolute inset-0 z-[60] bg-white flex flex-col select-none overflow-hidden"
    >
      {/* iOS 26 Full Transparent Liquid Glass Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-transparent text-black pt-14 pb-16 px-8">
        <div className="flex justify-between items-center">
          <span className="text-[26px] font-black tracking-tighter text-black/90">
            {activeTab === 'Chats' ? 'Chat' : activeTab === 'Contacts' ? 'Contacts' : activeTab === 'Discover' ? 'Discover' : ''}
          </span>
          {activeTab === 'Chats' && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsPlusMenuOpen(true)}>
              <Plus size={28} strokeWidth={2.5} className="text-black/90" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content Card - Clean White Design */}
      <div className="flex-1 overflow-hidden bg-white rounded-t-[64px] relative z-10 mt-[100px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex flex-col">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 w-full h-full flex flex-col overflow-y-auto"
          >
            {activeTab === 'Chats' ? (
          <>
            {/* Calendar Section - Optimized for Screen Width */}
            <div className="px-6 py-8">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl shadow-black/5">
                <div className="flex flex-col mb-6">
                  <span className="text-[20px] font-black text-black/90 tracking-tighter">{year}年{month}月</span>
                  <span className="text-[12px] text-black/25 font-black tracking-[0.25em] uppercase mt-1">本周 {month}.{weekRange}</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDates.map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileTap={item.isToday ? { scale: 0.92 } : {}}
                      onClick={() => item.isToday && setIsDiaryOpen(true)}
                      className="flex flex-col items-center gap-3 cursor-pointer"
                    >
                      <span className="text-[11px] text-black/20 font-black">{item.day}</span>
                      <div className={`w-full aspect-[4/5] max-w-[36px] rounded-[18px] flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden ${
                        item.isToday 
                          ? 'bg-white/30 backdrop-blur-[30px] text-black shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_15px_35px_rgba(0,0,0,0.12)] border border-white/60' 
                          : 'text-black/80 hover:bg-zinc-50'
                      }`}>
                        {item.isToday && (
                          <>
                            {/* Advanced Liquid Glass Highlights */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-black/5 opacity-40" />
                            <div className="absolute top-1.5 left-3 right-3 h-[1.5px] bg-white/90 rounded-full blur-[0.5px]" />
                          </>
                        )}
                        <span className="text-[15px] font-black leading-none relative z-10 tracking-tighter text-black/90">{item.date}</span>
                        <span className={`text-[9px] mt-1.5 font-black relative z-10 ${item.isToday ? 'text-black/40' : 'text-black/20'}`}>
                          {item.lunar}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty Chat List Section */}
            <div className="flex-1 px-6 pt-16 flex flex-col items-center">
              <div className="flex flex-col items-center justify-center py-20 opacity-[0.02]">
                <div className="w-24 h-24 rounded-full border-[1.5px] border-black flex items-center justify-center mb-8">
                  <MessageCircle size={40} strokeWidth={1} />
                </div>
                <span className="text-[14px] font-black tracking-[0.5em] uppercase">No Messages</span>
              </div>
            </div>
          </>
        ) : activeTab === 'Me' ? (
          <div className="flex-1 bg-white" />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <div className="w-16 h-16 rounded-full border-2 border-black/20 flex items-center justify-center mb-4">
              <Settings size={24} className="text-black/40 animate-[spin_4s_linear_infinite]" />
            </div>
            <span className="text-[14px] font-black tracking-[0.2em] uppercase text-black/60">开发中...</span>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Plus Menu Overlay */}
      <AnimatePresence>
        {isPlusMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[110] bg-black/20 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsPlusMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full border-2 border-black/20 flex items-center justify-center mb-4">
                <Settings size={24} className="text-black/40 animate-[spin_4s_linear_infinite]" />
              </div>
              <span className="text-[14px] font-black tracking-[0.2em] uppercase text-black/60">开发中...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary Editor Overlay */}
      <AnimatePresence>
        {isDiaryOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[100] bg-white/40 backdrop-blur-[80px] p-8 flex flex-col select-none"
          >
            {/* Top Header */}
            <div className="flex flex-col items-center mb-6">
              <span className="text-[20px] font-black text-black/90 tracking-tighter">今日心情</span>
              <span className="text-[12px] text-black/30 font-black tracking-widest mt-1 uppercase">{month}月{todayDate}日</span>
            </div>

            {/* Browser-like Top Bar (1) */}
            <div className="flex justify-center mb-8">
              <div className="bg-black/5 backdrop-blur-md border border-white/40 rounded-full px-4 py-2 flex items-center gap-6 shadow-sm">
                <Info size={18} className="text-black/40" />
                <div className="w-[1px] h-4 bg-black/10" />
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDiaryOpen(false)}
                  className="text-black/60"
                >
                  <X size={18} strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>

            {/* URL-like Date Display */}
            <div className="flex justify-center mb-10">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-6 py-3 shadow-lg shadow-black/5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[14px] font-black text-black/60 tracking-tight font-mono">
                  {year}/{month.toString().padStart(2, '0')}/{todayDate.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Mood Selection */}
            <div className="flex justify-center gap-3 mb-12">
              {['✨', '☁️', '🌿', '🌊', '🌙'].map(m => (
                <motion.button 
                  key={m}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMood(m)}
                  className={`text-2xl w-14 h-14 rounded-[24px] flex items-center justify-center transition-all duration-500 relative overflow-hidden ${
                    mood === m 
                      ? 'bg-white/60 backdrop-blur-xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_10px_25px_rgba(0,0,0,0.1)] border border-white/80' 
                      : 'bg-black/5 opacity-40 grayscale'
                  }`}
                >
                  {mood === m && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-40" />
                  )}
                  <span className="relative z-10">{m}</span>
                </motion.button>
              ))}
            </div>

            {/* Lined Text Area */}
            <div className="flex-1 relative mb-12">
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex-1 border-b border-black/[0.05]" />
                ))}
              </div>
              <textarea
                autoFocus
                value={diaryContent}
                onChange={(e) => setDiaryContent(e.target.value)}
                placeholder="td."
                className="absolute inset-0 bg-transparent text-[18px] font-black text-black/80 placeholder:text-black/10 resize-none outline-none leading-[1.8] py-2 px-1"
                style={{ lineHeight: 'calc((100% - 0px) / 10)' }}
              />
            </div>

            {/* Bottom Buttons (2 & 3) */}
            <div className="flex justify-center pb-12">
              <div className="bg-black/5 backdrop-blur-xl border border-white/40 rounded-[28px] flex overflow-hidden shadow-xl shadow-black/5">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDiaryOpen(false)}
                  className="px-10 py-4 text-[15px] font-black text-black/40 hover:bg-black/5 transition-colors border-r border-white/20"
                >
                  取消
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDiaryOpen(false)}
                  className="px-10 py-4 text-[15px] font-black text-black/90 hover:bg-black/5 transition-colors"
                >
                  确认
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - Frosted Ins-Style Design */}
      <div className="px-6 pb-10 z-10 relative">
        <div className="bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[40px] py-1.5 flex justify-around items-center px-2">
          {[
            { id: 'Chats', label: 'Chats', icon: MessageCircle },
            { id: 'Contacts', label: 'Contacts', icon: User },
            { id: 'Discover', label: 'Discover', icon: Clock },
            { id: 'Me', label: 'Me', icon: User },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.div 
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center justify-center gap-0.5 cursor-pointer z-20 py-2 px-4 min-w-[75px] h-[58px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    transition={{
                      type: "spring",
                      bounce: 0.1,
                      duration: 0.4
                    }}
                    className="absolute inset-0 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-[28px]"
                  />
                )}
                
                <div className={`relative z-10 transition-all duration-300 ${isActive ? 'text-black scale-105' : 'opacity-20 text-black'}`}>
                  {item.id === 'Me' ? (
                    <div className="w-5 h-5 border-2 border-current rounded-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-current rounded-full" />
                    </div>
                  ) : (
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  )}
                </div>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black tracking-tight relative z-10 text-black"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Home Indicator to close */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[70]">
        <div 
          onClick={onClose}
          className="w-32 h-1 bg-black/20 rounded-full cursor-pointer outline-none" 
        />
      </div>
    </motion.div>
  );
};

const HomeScreen: React.FC<{ 
  isLocked: boolean; 
  onOpenApp: (app: string) => void; 
  scale?: MotionValue<number>;
  wallpaperConfig: WallpaperConfig;
}> = ({ isLocked, onOpenApp, scale, wallpaperConfig }) => {
  const [widgetImages, setWidgetImages] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const homeWallpaper = wallpaperConfig.homeWallpaperMode === 'custom' 
    ? wallpaperConfig.homeWallpaper 
    : wallpaperConfig.lockWallpaper;
  
  const blurAmount = wallpaperConfig.homeWallpaperMode === 'blurred' ? wallpaperConfig.homeBlurAmount : 0;

  const handleWidgetClick = (id: string) => {
    setActiveWidgetId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeWidgetId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPendingImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    if (activeWidgetId) {
      setWidgetImages(prev => ({
        ...prev,
        [activeWidgetId]: croppedImageUrl
      }));
    }
    setPendingImage(null);
    setActiveWidgetId(null);
  };

  const handleCropCancel = () => {
    setPendingImage(null);
    setActiveWidgetId(null);
  };

  return (
    <motion.div 
      initial={false}
      style={{ scale }}
      animate={{ 
        opacity: isLocked ? 0 : 1, 
        scale: isLocked ? 1.1 : 1,
        pointerEvents: isLocked ? 'none' : 'auto'
      }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="relative h-screen w-full flex flex-col"
    >
      <LiquidBackground src={homeWallpaper} blur={blurAmount} />

      {pendingImage && activeWidgetId && (
        <ImageCropper
          imageSrc={pendingImage}
          widgetId={activeWidgetId}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {/* App Grid */}
      <div className="flex-1 px-8 pt-16 z-10 overflow-y-auto pb-[200px] flex flex-col">
        <div className="grid grid-cols-4 gap-4 auto-rows-auto mt-auto">
          {/* Row 1 */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWidgetClick('circle-1')}
            className="col-span-1 aspect-square bg-white/90 rounded-full shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform"
          >
            {widgetImages['circle-1'] && <img src={widgetImages['circle-1']} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-3 bg-white/90 rounded-full shadow-sm p-4 flex flex-col justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />
          
          {/* Row 2 */}
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-white/90 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-white/90 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWidgetClick('large-square')}
            className="col-span-2 row-span-2 bg-white/90 rounded-[32px] shadow-sm p-5 flex flex-col relative overflow-hidden cursor-pointer touch-manipulation will-change-transform"
          >
            {widgetImages['large-square'] && <img src={widgetImages['large-square']} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          </motion.div>
          
          {/* Row 3 */}
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-zinc-200/80 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-zinc-200/80 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />

          {/* Row 4 */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWidgetClick('donut')}
            className="col-span-2 row-span-2 aspect-square shadow-xl cursor-pointer rounded-full touch-manipulation will-change-transform"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ 
                WebkitMaskImage: 'radial-gradient(circle, transparent 15%, black 16%)', 
                maskImage: 'radial-gradient(circle, transparent 15%, black 16%)',
                willChange: 'transform, mask-image'
              }}
              className="w-full h-full bg-gradient-to-tr from-zinc-400 via-zinc-200 to-zinc-50 rounded-full relative overflow-hidden"
            >
               {widgetImages['donut'] && <img src={widgetImages['donut']} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            </motion.div>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-zinc-300/80 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-zinc-400/80 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />

          {/* Row 5 */}
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-zinc-100/80 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />
          <motion.div whileTap={{ scale: 0.95 }} className="col-span-1 aspect-square bg-zinc-100/80 rounded-[22px] shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer touch-manipulation will-change-transform" />

          {/* Row 6 */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWidgetClick('rect-ears')}
            className="col-span-4 aspect-[4/1.4] mt-4 relative cursor-pointer pointer-events-none touch-manipulation will-change-transform filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]"
          >
             {/* Left Ear */}
             <div className="absolute top-0 left-8 w-12 h-full overflow-hidden rounded-t-2xl bg-white/90 pointer-events-auto">
               {widgetImages['rect-ears'] && (
                 <img src={widgetImages['rect-ears']} className="absolute top-0 left-[-32px] w-[calc(100vw-4rem)] h-full object-cover max-w-none" alt="" />
               )}
             </div>
             {/* Right Ear */}
             <div className="absolute top-0 right-8 w-12 h-full overflow-hidden rounded-t-2xl bg-white/90 pointer-events-auto">
               {widgetImages['rect-ears'] && (
                 <img src={widgetImages['rect-ears']} className="absolute top-0 right-[-32px] w-[calc(100vw-4rem)] h-full object-cover max-w-none" alt="" />
               )}
             </div>
             {/* Main Body */}
             <div className="absolute bottom-0 left-0 right-0 h-[85%] overflow-hidden rounded-[32px] bg-white/90 pointer-events-auto">
               {widgetImages['rect-ears'] && (
                 <img src={widgetImages['rect-ears']} className="absolute bottom-0 left-0 w-full h-[calc(100%/0.85)] object-cover" alt="" />
               )}
             </div>
             
             {/* Inner shadow for main body to make ears look like they are behind */}
             <div className="absolute bottom-0 left-0 right-0 h-[85%] rounded-[32px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] pointer-events-none z-20" />
          </motion.div>
        </div>
      </div>

      {/* Search Pill */}
      <motion.div whileTap={{ scale: 0.95 }} className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-10 cursor-pointer touch-manipulation will-change-transform">
        <div className="liquid-glass-dark px-4 py-1.5 rounded-full flex items-center gap-1.5 bg-black/5 border-none shadow-none">
          <Search size={12} className="text-black/40" strokeWidth={3} />
          <span className="text-[11px] text-black/60 font-medium tracking-tight">搜索</span>
        </div>
      </motion.div>

      {/* Dock */}
      <div className="absolute bottom-5 left-0 right-0 px-4 z-10">
        <div className="liquid-glass rounded-[34px] px-4 py-[14px]">
          <div className="grid grid-cols-4 gap-4">
            {[
              { color: 'bg-zinc-900', icon: Globe, iconSize: 18, onClick: () => onOpenApp('world') },
              { color: 'bg-zinc-800', icon: MessageCircle, iconSize: 18, onClick: () => onOpenApp('chat') },
              { color: 'bg-zinc-600', icon: BookUser, iconSize: 18, onClick: () => onOpenApp('characters') },
              { color: 'bg-zinc-400', icon: Settings, iconSize: 18, onClick: () => onOpenApp('settings') },
            ].map((app, i) => (
              <AppIcon key={i} {...app} showLabel={false} />
            ))}
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
        <div className="w-32 h-1 bg-black/20 rounded-full" />
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [isEnteringPasscode, setIsEnteringPasscode] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperConfig>({
    lockWallpaper: null,
    homeWallpaper: null,
    homeWallpaperMode: 'original',
    homeBlurAmount: 15,
    lockDateColor: '#707072',
    lockTimeColor: '#FFFFFF',
    fontFamily: 'sans'
  });

  const updateWallpaperConfig = (newConfig: WallpaperConfig) => {
    setWallpaperConfig(newConfig);
  };

  const pullOffset = useMotionValue(0);
  const [isDraggingLock, setIsDraggingLock] = useState(false);
  const [isCancellingDrag, setIsCancellingDrag] = useState(false);
  const startY = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  /* 
    [FEATURE: FAKE NO-BOUNCE]
    This logic "fakes" the no-bounce feature by preventing default touch behavior 
    at the scroll boundaries. It is currently "not running" as requested.
  */
  /*
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e: TouchEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      if (isAtTop && e.touches[0].clientY > startY.current) {
        e.preventDefault();
      }
      if (isAtBottom && e.touches[0].clientY < startY.current) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => container.removeEventListener('touchmove', handleTouchMove);
  }, []);
  */

  const lockScreenPullDownY = useTransform(pullOffset, v => v - window.innerHeight);
  const lockBorderRadius = useTransform(pullOffset, (v) => {
    const threshold = 80;
    const maxRadius = 48;
    if (isLocked) {
      // v is 0 (locked) to negative (swiping up)
      const progress = Math.min(Math.abs(v) / threshold, 1);
      return progress * maxRadius;
    } else {
      // v is 0 (hidden) to window.innerHeight (locked)
      const progress = Math.min(Math.abs(v - window.innerHeight) / threshold, 1);
      return progress * maxRadius;
    }
  });

  const lockScreenY = useMotionValue(isLocked ? 0 : -window.innerHeight);

  useEffect(() => {
    if (isDraggingLock || isCancellingDrag) {
      return pullOffset.on("change", (v) => {
        if (isLocked) {
          lockScreenY.set(v);
        } else {
          lockScreenY.set(v - window.innerHeight);
        }
      });
    }
  }, [isDraggingLock, isCancellingDrag, isLocked, pullOffset, lockScreenY]);

  useEffect(() => {
    if (!isDraggingLock && !isCancellingDrag) {
      const targetY = isEnteringPasscode ? 0 : (isLocked ? 0 : -window.innerHeight);
      animate(lockScreenY, targetY, {
        type: "spring",
        damping: 30,
        stiffness: 300,
        restDelta: 0.001
      });
    }
  }, [isLocked, isEnteringPasscode, isDraggingLock, isCancellingDrag, lockScreenY]);

  const homeScreenScale = useTransform(pullOffset, (v) => {
    if (isLocked) return 1.1;
    if (v <= 0) return 1;
    const progress = Math.min(v / (window.innerHeight * 0.4), 1);
    return 1 + progress * 0.1;
  });

  // Dynamically update body background color to match the active app
  // This ensures the iOS rubber-band bounce area matches the app's background seamlessly
  useEffect(() => {
    if (activeApp === 'settings' || activeApp === 'characters' || activeApp === 'world') {
      document.body.style.backgroundColor = '#f5f5f5';
      document.documentElement.style.backgroundColor = '#f5f5f5';
    } else if (activeApp === 'chat') {
      document.body.style.backgroundColor = '#ffffff';
      document.documentElement.style.backgroundColor = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#e0e0e5';
      document.documentElement.style.backgroundColor = '#e0e0e5';
    }
    
    return () => {
      document.body.style.backgroundColor = '#e0e0e5';
      document.documentElement.style.backgroundColor = '#e0e0e5';
    };
  }, [activeApp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default browser scrolling only when we are actively dragging for our gestures
      if (isDraggingLock) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => container.removeEventListener('touchmove', handleTouchMove);
  }, [isDraggingLock]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const clientY = e.clientY;
    const h = window.innerHeight;

    if (!isLocked) {
      // Pull down from home screen to lock - restricted to top area to avoid accidental triggers
      if (clientY < 64) {
        startY.current = clientY;
        lastY.current = clientY;
        lastTime.current = Date.now();
        setIsDraggingLock(true);
        setIsCancellingDrag(false);
        pullOffset.set(0);
      }
    } else if (!isEnteringPasscode) {
      // Swipe up from lock screen to passcode - broadened area
      if (clientY > h * 0.5) {
        startY.current = clientY;
        lastY.current = clientY;
        lastTime.current = Date.now();
        setIsDraggingLock(true);
        setIsCancellingDrag(false);
        pullOffset.set(0);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingLock) return;
    const clientY = e.clientY;
    const deltaY = clientY - startY.current;

    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (clientY - lastY.current) / dt;
    }
    lastY.current = clientY;
    lastTime.current = now;

    if (!isLocked) {
      if (deltaY > 0) pullOffset.set(deltaY);
    } else {
      if (deltaY < 0) pullOffset.set(deltaY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingLock) return;
    setIsDraggingLock(false);

    const h = window.innerHeight;
    const currentOffset = pullOffset.get();

    if (!isLocked) {
      // Only lock if velocity is high (flick) OR if distance is very large (near bottom)
      if (velocity.current > 1.5 || currentOffset > h * 0.8) {
        // Smoothly finish the lock animation instead of jumping
        setIsCancellingDrag(true);
        animate(pullOffset, h, { 
          type: "spring", 
          damping: 30, 
          stiffness: 300, 
          onComplete: () => {
            setIsLocked(true);
            pullOffset.set(0);
            setIsCancellingDrag(false);
          } 
        });
      } else {
        setIsCancellingDrag(true);
        animate(pullOffset, 0, { 
          type: "spring", 
          damping: 30, 
          stiffness: 300, 
          onComplete: () => setIsCancellingDrag(false) 
        });
      }
    } else {
      if (currentOffset < -h * 0.2 || velocity.current < -0.5) {
        setIsEnteringPasscode(true);
      } else {
        setIsCancellingDrag(true);
        setTimeout(() => setIsCancellingDrag(false), 300);
      }
      pullOffset.set(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      /* 
        [FEATURE: HARD-LOCK POSITIONING]
        To activate "Fixed Positioning", change className to include "hard-lock-active" 
        (defined in index.css) or "fixed inset-0 overflow-hidden touch-none".
      */
      className={`min-h-[100dvh] w-screen relative bg-[#e0e0e5] select-none font-${wallpaperConfig.fontFamily || 'sans'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Home Screen - Always mounted to preserve state */}
      <div className="absolute inset-0 z-0">
        <HomeScreen 
          isLocked={isLocked} 
          onOpenApp={(app) => setActiveApp(app)} 
          scale={homeScreenScale} 
          wallpaperConfig={wallpaperConfig}
        />
      </div>

      {/* Background layer revealed when swiping up from lock screen */}
      {isLocked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
        >
          <LiquidBackground src={wallpaperConfig.lockWallpaper} />
          {/* Uniform darkening overlay for the wallpaper revealed during swipe */}
          <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
        </motion.div>
      )}

      {/* Apps */}
      <AnimatePresence>
        {activeApp === 'settings' && (
          <SettingsApp 
            onClose={() => setActiveApp(null)} 
            wallpaperConfig={wallpaperConfig}
            onUpdateWallpaper={updateWallpaperConfig}
          />
        )}
        {activeApp === 'chat' && (
          <ChatApp onClose={() => setActiveApp(null)} />
        )}
        {activeApp === 'characters' && (
          <CharacterBookApp onClose={() => setActiveApp(null)} />
        )}
        {activeApp === 'world' && (
          <WorldBookApp onClose={() => setActiveApp(null)} />
        )}
      </AnimatePresence>

      {/* Lock Screen / Passcode Screen */}
      <AnimatePresence>
        {(isLocked || isDraggingLock || isCancellingDrag) && (
          <motion.div
            key="lock-container"
            className="absolute inset-0 z-50 overflow-hidden"
            initial={false}
            style={{ 
              y: lockScreenY,
              borderBottomLeftRadius: lockBorderRadius,
              borderBottomRightRadius: lockBorderRadius
            }}
            animate={{ 
              opacity: 1
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!isEnteringPasscode ? (
              <LockScreen 
                onUnlock={() => setIsEnteringPasscode(true)} 
                dragY={pullOffset} 
                config={wallpaperConfig}
              />
            ) : (
              <PasscodeScreen 
                onCancel={() => setIsEnteringPasscode(false)} 
                onSuccess={() => {
                  setIsLocked(false);
                  setIsEnteringPasscode(false);
                }} 
                dragY={pullOffset}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
