import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate, MotionValue, animate } from 'motion/react';
import ImageCropper from './components/ImageCropper';
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
  User,
  MoreHorizontal,
  Plus,
  Home,
  Video,
  X,
  Check,
  Smile,
} from 'lucide-react';

// --- Components ---

const LiquidBackground = ({ dragY }: { dragY?: MotionValue<number> }) => {
  return (
    <div 
      className="absolute inset-0 z-0 bg-[#e0e0e5]"
    />
  );
};

const LockScreen: React.FC<{ onUnlock: () => void; dragY: MotionValue<number> }> = ({ onUnlock, dragY }) => {
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
      <LiquidBackground dragY={smoothDragY} />
      
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
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[#707072] text-[22px] font-semibold tracking-tight"
          >
            {dateString}
          </motion.div>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white font-bold tracking-[-0.04em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] flex justify-center items-center"
            style={{ 
              fontFamily: 'Georgia',
              fontSize: '106px',
              lineHeight: '85px',
              width: '280px',
              marginTop: '5px'
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(30px)' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
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

const SettingsApp = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[60] bg-[#f2f2f7] flex flex-col pt-12 select-none"
    >
      <div className="absolute top-14 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[17px] font-semibold text-black/90">设置</span>
      </div>
      
      <div className="flex-1" />

      {/* Home Indicator to close */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[70]">
        <div 
          onClick={onClose}
          className="w-32 h-1 bg-black/20 rounded-full cursor-pointer outline-none" 
        />
      </div>
    </motion.div>
  );
};

const WeChatApp = ({ onClose }: { onClose: () => void }) => {
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryContent, setDiaryContent] = useState('');
  const [mood, setMood] = useState('✨');

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
      className="absolute inset-0 z-[60] bg-zinc-200 flex flex-col select-none overflow-hidden"
    >
      {/* iOS 26 Full Transparent Liquid Glass Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-transparent text-black pt-14 pb-16 px-8">
        <div className="flex justify-between items-center">
          <span className="text-[26px] font-black tracking-tighter text-black/90">WeChat</span>
          <Plus size={28} strokeWidth={2.5} className="text-black/90" />
        </div>
      </div>

      {/* Content Card with Aesthetic Rounded Corners and Shadow */}
      <div className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-md rounded-t-[64px] relative z-10 mt-[100px] shadow-[0_-15px_50px_rgba(0,0,0,0.12),0_-5px_15px_rgba(0,0,0,0.05)] flex flex-col">
        {/* The "Thick Edge" effect - refined for aesthetic curve */}
        <div className="absolute top-0 left-0 right-0 h-[8px] rounded-t-[64px] z-20 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black/[0.03] blur-[2px]" />
          <div className="absolute inset-x-0 top-0 h-[3px] bg-white/90" />
        </div>
        
        {/* Calendar Section - Optimized for Screen Width */}
        <div className="px-6 py-12">
          <div className="flex flex-col mb-10">
            <span className="text-[26px] font-black text-black/90 tracking-tighter">{year}年{month}月</span>
            <span className="text-[14px] text-black/25 font-black tracking-[0.25em] uppercase mt-1">本周 {month}.{weekRange}</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((item, i) => (
              <motion.div 
                key={i} 
                whileTap={item.isToday ? { scale: 0.92 } : {}}
                onClick={() => item.isToday && setIsDiaryOpen(true)}
                className="flex flex-col items-center gap-5 cursor-pointer"
              >
                <span className="text-[13px] text-black/20 font-black">{item.day}</span>
                <div className={`w-full aspect-[4/5] max-w-[42px] rounded-[22px] flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden ${
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
                  <span className="text-[18px] font-black leading-none relative z-10 tracking-tighter text-black/90">{item.date}</span>
                  <span className={`text-[10px] mt-2 font-black relative z-10 ${item.isToday ? 'text-black/40' : 'text-black/20'}`}>
                    {item.lunar}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty Chat List Section */}
        <div className="flex-1 px-6 border-t border-black/[0.02] pt-16 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center py-20 opacity-[0.02]">
            <div className="w-24 h-24 rounded-full border-[1.5px] border-black flex items-center justify-center mb-8">
              <MessageCircle size={40} strokeWidth={1} />
            </div>
            <span className="text-[14px] font-black tracking-[0.5em] uppercase">No Messages</span>
          </div>
          
          {/* Search Bar as seen in screenshot */}
          <div className="mt-auto mb-12 w-full max-w-[140px] h-10 bg-zinc-100/50 rounded-full flex items-center justify-center gap-2 text-black/20">
            <Search size={14} strokeWidth={3} />
            <span className="text-[12px] font-black tracking-widest uppercase">搜索</span>
          </div>
        </div>
      </div>

      {/* Diary Editor Overlay */}
      <AnimatePresence>
        {isDiaryOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute inset-0 z-[80] bg-white/95 backdrop-blur-2xl p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDiaryOpen(false)}
                className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400"
              >
                <X size={20} />
              </motion.button>
              <div className="flex flex-col items-center">
                <span className="text-[18px] font-bold text-black/90">今日心情</span>
                <span className="text-[12px] text-black/30 font-medium">{month}月{todayDate}日</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDiaryOpen(false)}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white"
              >
                <Check size={20} />
              </motion.button>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <div className="flex justify-center gap-4">
                {['✨', '☁️', '🌿', '🌊', '🌙'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMood(m)}
                    className={`text-2xl w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${mood === m ? 'bg-zinc-100 scale-110 shadow-sm' : 'opacity-40'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <textarea
                autoFocus
                value={diaryContent}
                onChange={(e) => setDiaryContent(e.target.value)}
                placeholder="记录下此刻的想法..."
                className="flex-1 bg-transparent text-[20px] font-medium text-black/80 placeholder:text-black/10 resize-none outline-none leading-relaxed"
              />
            </div>

            <div className="pb-12 flex items-center gap-2 text-zinc-300">
              <Smile size={18} />
              <span className="text-[13px] font-medium">此刻的心情是 {mood}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-black/[0.03] pb-8 pt-3 flex justify-around items-center px-4 z-10">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-6 bg-black rounded-full flex items-center justify-center text-white">
            <MessageCircle size={16} fill="currentColor" />
          </div>
          <span className="text-[10px] text-black font-bold">Chats</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-20">
          <User size={20} />
          <span className="text-[10px] text-black font-bold">Contacts</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-20">
          <Clock size={20} />
          <span className="text-[10px] text-black font-bold">Discover</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-20">
          <div className="w-5 h-5 border-2 border-black rounded-md flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
          <span className="text-[10px] text-black font-bold">Me</span>
        </div>
      </div>
      
      {/* Home Indicator to close */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[70]">
        <div 
          onClick={onClose}
          className="w-32 h-1 bg-black/20 rounded-full cursor-pointer outline-none" 
        />
      </div>
    </motion.div>
  );
};

const HomeScreen: React.FC<{ isLocked: boolean; onOpenApp: (app: string) => void; scale?: MotionValue<number> }> = ({ isLocked, onOpenApp, scale }) => {
  const [widgetImages, setWidgetImages] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

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
      <LiquidBackground />

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
      <motion.div whileTap={{ scale: 0.95 }} className="fixed bottom-[140px] left-1/2 -translate-x-1/2 z-10 cursor-pointer touch-manipulation will-change-transform">
        <div className="liquid-glass-dark px-4 py-1.5 rounded-full flex items-center gap-1.5 bg-black/5 border-none shadow-none">
          <Search size={12} className="text-black/40" strokeWidth={3} />
          <span className="text-[11px] text-black/60 font-medium tracking-tight">搜索</span>
        </div>
      </motion.div>

      {/* Dock */}
      <div className="fixed bottom-5 left-0 right-0 px-4 z-10">
        <div className="liquid-glass rounded-[34px] px-4 py-[14px]">
          <div className="grid grid-cols-4 gap-4">
            {[
              { color: 'bg-zinc-900' },
              { color: 'bg-zinc-800', icon: MessageCircle, iconSize: 18, onClick: () => onOpenApp('wechat') },
              { color: 'bg-zinc-600' },
              { color: 'bg-zinc-400', icon: Settings, iconSize: 18, onClick: () => onOpenApp('settings') },
            ].map((app, i) => (
              <AppIcon key={i} {...app} showLabel={false} />
            ))}
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20">
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
  const homeScreenScale = useTransform(pullOffset, (v) => {
    if (isLocked) return 1.1;
    if (v <= 0) return 1;
    const progress = Math.min(v / (window.innerHeight * 0.4), 1);
    return 1 + progress * 0.1;
  });

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
      if (velocity.current > 1.5 || currentOffset > h * 0.85) {
        setIsLocked(true);
        pullOffset.set(0);
      } else {
        setIsCancellingDrag(true);
        animate(pullOffset, 0, { type: "spring", damping: 25, stiffness: 200, onComplete: () => setIsCancellingDrag(false) });
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
      className="min-h-[100dvh] w-screen relative bg-[#e0e0e5] select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Home Screen - Always mounted to preserve state */}
      <div className="absolute inset-0 z-0">
        <HomeScreen isLocked={isLocked} onOpenApp={(app) => setActiveApp(app)} scale={homeScreenScale} />
      </div>

      {/* Background layer revealed when swiping up from lock screen */}
      {isLocked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
        >
          <LiquidBackground />
          {/* Uniform darkening overlay for the wallpaper revealed during swipe */}
          <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
        </motion.div>
      )}

      {/* Apps */}
      <AnimatePresence>
        {activeApp === 'settings' && (
          <SettingsApp onClose={() => setActiveApp(null)} />
        )}
        {activeApp === 'wechat' && (
          <WeChatApp onClose={() => setActiveApp(null)} />
        )}
      </AnimatePresence>

      {/* Lock Screen / Passcode Screen */}
      <AnimatePresence>
        {(isLocked || isDraggingLock || isCancellingDrag) && (
          <motion.div
            key="lock-container"
            className="absolute inset-0 z-50 overflow-hidden rounded-b-[48px] shadow-[0_0_40px_rgba(0,0,0,0.3)]"
            initial={false}
            style={{ 
              y: isLocked 
                ? (isEnteringPasscode ? 0 : pullOffset) 
                : (isDraggingLock ? lockScreenPullDownY : undefined)
            }}
            animate={{ 
              y: isEnteringPasscode 
                ? 0 
                : (isLocked ? 0 : -window.innerHeight),
              opacity: 1
            }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={isDraggingLock ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 200 }}
          >
            {!isEnteringPasscode ? (
              <LockScreen onUnlock={() => setIsEnteringPasscode(true)} dragY={pullOffset} />
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
