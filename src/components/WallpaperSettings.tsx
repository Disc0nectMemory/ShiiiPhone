import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check, Smartphone, Home, Image as ImageIcon, Layers } from 'lucide-react';
import ImageCropper from './ImageCropper';

interface WallpaperConfig {
  lockWallpaper: string | null;
  homeWallpaper: string | null;
  homeWallpaperMode: 'original' | 'blurred' | 'custom';
  homeBlurAmount: number;
  lockDateColor?: string;
  lockTimeColor?: string;
}

interface WallpaperSettingsPageProps {
  onBack: () => void;
  config: WallpaperConfig;
  onSave: (config: WallpaperConfig) => void;
}

export default function WallpaperSettingsPage({ onBack, config, onSave }: WallpaperSettingsPageProps) {
  const [currentConfig, setCurrentConfig] = useState<WallpaperConfig>(config);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<'lock' | 'home' | null>(null);
  const [showHomeOptions, setShowHomeOptions] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [colorTarget, setColorTarget] = useState<'date' | 'time' | null>(null);
  const [tempColor, setTempColor] = useState('');
  const [showPicker, setShowPicker] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    if (cropTarget === 'lock') {
      setCurrentConfig(prev => ({
        ...prev,
        lockWallpaper: croppedImageUrl
      }));
    } else if (cropTarget === 'home') {
      setCurrentConfig(prev => ({
        ...prev,
        homeWallpaper: croppedImageUrl,
        homeWallpaperMode: 'custom'
      }));
    }
    setPendingImage(null);
    setCropTarget(null);
  };

  const handleSave = () => {
    onSave(currentConfig);
    onBack();
  };

  const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setCurrentConfig(prev => ({ ...prev, homeBlurAmount: val }));
  };

  const switchToSync = () => {
    setCurrentConfig(prev => ({ ...prev, homeWallpaperMode: 'original', homeBlurAmount: 0 }));
    setShowHomeOptions(true);
  };

  const time = new Date();
  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dateString = `${time.getMonth() + 1}月${time.getDate()}日 ${weekDays[time.getDay()]}`;

  return (
    <div className="flex flex-col h-full bg-white font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="pt-16 pb-6 px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-black/[0.02]">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 -ml-2 text-black/90"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </motion.button>
        <span className="text-[17px] font-black tracking-tighter text-black/90">Wallpaper</span>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          className="p-2 -mr-2 text-black/90"
        >
          <Check size={28} strokeWidth={2.5} />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-32 space-y-12">
        {/* Previews Section */}
        <div className="flex flex-col items-center gap-10 mt-4">
          <div className="flex justify-center gap-8 w-full">
            {/* Lock Screen Preview */}
            <div className="flex flex-col items-center gap-4 flex-1 max-w-[160px]">
              <span className="text-[11px] font-black text-black/20 tracking-[0.2em] uppercase">Lock Screen</span>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCropTarget('lock');
                  fileInputRef.current?.click();
                }}
                className="w-full aspect-[9/19.5] rounded-[40px] bg-[#f0f0f5] shadow-2xl relative overflow-hidden border-[6px] border-white cursor-pointer group"
              >
                {currentConfig.lockWallpaper && (
                  <img src={currentConfig.lockWallpaper} className="absolute inset-0 w-full h-full object-cover" alt="" />
                )}
                {/* Mock Lock Screen UI */}
                <div className="absolute inset-0 flex flex-col items-center pt-8 pointer-events-none">
                  <span 
                    className="text-[10px] font-black tracking-tight drop-shadow-sm transition-colors duration-300"
                    style={{ color: currentConfig.lockDateColor || 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {dateString}
                  </span>
                  <span 
                    className="text-[36px] font-bold leading-none mt-1 drop-shadow-md transition-colors duration-300" 
                    style={{ 
                      fontFamily: 'Georgia',
                      color: currentConfig.lockTimeColor || 'white'
                    }}
                  >
                    {timeString}
                  </span>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Check size={20} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Home Screen Preview */}
            <div className="flex flex-col items-center gap-4 flex-1 max-w-[160px]">
              <span className="text-[11px] font-black text-black/20 tracking-[0.2em] uppercase">Home Screen</span>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsHomeMenuOpen(true);
                  setShowHomeOptions(true);
                }}
                className="w-full aspect-[9/19.5] rounded-[40px] bg-[#f0f0f5] shadow-2xl relative overflow-hidden border-[6px] border-white cursor-pointer group"
              >
                {currentConfig.homeWallpaperMode === 'custom' && currentConfig.homeWallpaper ? (
                  <img src={currentConfig.homeWallpaper} className="absolute inset-0 w-full h-full object-cover" alt="" />
                ) : currentConfig.lockWallpaper ? (
                  <img 
                    src={currentConfig.lockWallpaper} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    style={{ 
                      filter: currentConfig.homeWallpaperMode === 'blurred' ? `blur(${currentConfig.homeBlurAmount}px)` : 'none', 
                      transform: currentConfig.homeWallpaperMode === 'blurred' ? 'scale(1.15)' : 'none' 
                    }}
                    alt="" 
                  />
                ) : null}
                {/* Mock Home Screen UI - Replicating App Grid Exactly */}
                <div className="absolute inset-0 p-3 flex flex-col pointer-events-none">
                  <div className="grid grid-cols-4 gap-1.5 mt-auto mb-12 opacity-40">
                    {/* Row 1 */}
                    <div className="col-span-1 aspect-square bg-white rounded-full" />
                    <div className="col-span-3 bg-white rounded-full h-full" />
                    {/* Row 2 */}
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    <div className="col-span-2 row-span-2 bg-white rounded-[10px]" />
                    {/* Row 3 */}
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    {/* Row 4 */}
                    <div className="col-span-2 row-span-2 aspect-square bg-white rounded-full" />
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    {/* Row 5 */}
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    <div className="col-span-1 aspect-square bg-white rounded-[6px]" />
                    {/* Row 6 */}
                    <div className="col-span-4 aspect-[4/1.4] mt-1 relative">
                      <div className="absolute top-0 left-2 w-3 h-full rounded-t-sm bg-white" />
                      <div className="absolute top-0 right-2 w-3 h-full rounded-t-sm bg-white" />
                      <div className="absolute bottom-0 left-0 right-0 h-[85%] rounded-[8px] bg-white" />
                    </div>
                  </div>
                  {/* Search Pill Mock */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-3 bg-white/20 rounded-full opacity-60" />
                  {/* Dock Mock */}
                  <div className="absolute bottom-3 left-2 right-2 h-8 bg-white/20 backdrop-blur-md rounded-[12px] flex items-center justify-around px-2 opacity-60">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-[6px] bg-white/40" />
                    ))}
                  </div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Layers size={20} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Lock Screen Font Color Button */}
        <div className="flex flex-col items-center pt-4 pb-12">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsColorMenuOpen(true)}
            className="px-12 py-5 bg-white/10 backdrop-blur-[40px] border border-white/20 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center group active:bg-white/20 transition-all"
          >
            <span className="text-[12px] font-black text-black/30 tracking-[0.2em] uppercase group-hover:text-black/50 transition-colors">锁屏字体颜色</span>
          </motion.button>
        </div>
      </div>

      {/* Blur Slider - Only visible when blurred mode is active or being adjusted */}
      <AnimatePresence>
        {isHomeMenuOpen && currentConfig.homeWallpaperMode === 'blurred' && !showHomeOptions && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-[100px] left-8 right-8 z-30 flex flex-col items-center gap-6"
          >
            <div className="w-full bg-white/5 backdrop-blur-[40px] rounded-[40px] p-8 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] flex flex-col gap-6">
              <div className="w-full flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-black/15 tracking-[0.4em] uppercase">Blur Intensity</span>
                <span className="text-[10px] font-black text-black/30 tracking-widest">{currentConfig.homeBlurAmount}px</span>
              </div>
              <div className="relative w-full h-8 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={currentConfig.homeBlurAmount}
                  onChange={handleBlurChange}
                  className="w-full h-1 bg-black/5 rounded-full appearance-none cursor-pointer accent-black"
                  style={{
                    WebkitAppearance: 'none',
                    background: `linear-gradient(to right, rgba(0,0,0,0.2) ${currentConfig.homeBlurAmount / 40 * 100}%, rgba(0,0,0,0.05) ${currentConfig.homeBlurAmount / 40 * 100}%)`
                  }}
                />
                <style jsx>{`
                  input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    cursor: pointer;
                    transition: transform 0.2s;
                  }
                  input[type='range']::-webkit-slider-thumb:active {
                    transform: scale(1.2);
                  }
                `}</style>
              </div>
              
              {/* Blur detected as 0 hint */}
              <AnimatePresence>
                {currentConfig.homeBlurAmount === 0 && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={switchToSync}
                    className="flex flex-col items-center gap-1 mt-2 group"
                  >
                    <span className="text-[10px] font-medium text-black/30 tracking-tight group-hover:text-black/60 transition-colors">检测到模糊为0 将切换为Sync</span>
                    <span className="text-[9px] font-black text-black/20 uppercase tracking-widest group-hover:text-black/40 transition-colors">点击确认</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Confirmation Button to return to options */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHomeOptions(true)}
              className="w-full bg-white/10 backdrop-blur-[40px] border border-white/20 py-5 rounded-[32px] shadow-xl flex items-center justify-center gap-2 group"
            >
              <span className="text-[14px] font-black text-black/60 tracking-tight">Done</span>
              <Check size={16} className="text-black/20 group-hover:text-black/40 transition-colors" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill UI for Home Screen Options */}
      <AnimatePresence>
        {isHomeMenuOpen && showHomeOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/10 backdrop-blur-sm flex items-end justify-center pb-20 px-8"
            onClick={() => setIsHomeMenuOpen(false)}
          >
            <div className="flex flex-col items-center gap-6 w-full">
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                className="bg-white/10 backdrop-blur-[40px] rounded-[44px] p-2 flex items-center gap-1 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/20"
                onClick={e => e.stopPropagation()}
              >
                {[
                  { id: 'original', label: 'Sync', icon: Smartphone },
                  { id: 'blurred', label: 'Blur', icon: Layers },
                  { id: 'custom', label: 'Custom', icon: Home },
                ].map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (opt.id === 'custom') {
                        setCropTarget('home');
                        fileInputRef.current?.click();
                      } else if (opt.id === 'blurred') {
                        setCurrentConfig(prev => ({ ...prev, homeWallpaperMode: 'blurred', homeBlurAmount: prev.homeBlurAmount || 15 }));
                        setShowHomeOptions(false);
                      } else {
                        setCurrentConfig(prev => ({ ...prev, homeWallpaperMode: opt.id as any }));
                      }
                    }}
                    className={`flex items-center gap-2 px-8 py-4 rounded-[36px] transition-all duration-300 ${
                      currentConfig.homeWallpaperMode === opt.id 
                        ? 'bg-white/20 text-black/80 shadow-inner shadow-black/5' 
                        : 'text-black/30 hover:bg-white/10'
                    }`}
                  >
                    <opt.icon size={16} strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight">{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Confirmation Button below pill */}
              <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsHomeMenuOpen(false)}
                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/20 py-5 rounded-[32px] shadow-xl flex items-center justify-center gap-2 group"
              >
                <span className="text-[14px] font-black text-black/60 tracking-tight">Done</span>
                <Check size={16} className="text-black/20 group-hover:text-black/40 transition-colors" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color Selection Menu */}
      <AnimatePresence>
        {isColorMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[110] bg-black/5 backdrop-blur-md flex items-end justify-center pb-20 px-8"
            onClick={() => {
              if (colorTarget) {
                setColorTarget(null);
                setShowPicker(false);
              } else {
                setIsColorMenuOpen(false);
              }
            }}
          >
            <div className="flex flex-col items-center gap-6 w-full" onClick={e => e.stopPropagation()}>
              {!colorTarget ? (
                <motion.div
                  initial={{ y: 100, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 100, opacity: 0, scale: 0.9 }}
                  className="bg-white/10 backdrop-blur-[40px] rounded-[44px] p-2 flex items-center gap-1 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/20"
                >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setColorTarget('date');
                        setTempColor(currentConfig.lockDateColor || '#707072');
                        setShowPicker(true);
                      }}
                      className="flex items-center gap-2 px-12 py-4 rounded-[36px] text-black/30 hover:bg-white/10 transition-all"
                    >
                      <span className="text-[14px] font-black tracking-widest">日期</span>
                    </motion.button>
                    <div className="w-[1px] h-6 bg-black/5" />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setColorTarget('time');
                        setTempColor(currentConfig.lockTimeColor || '#FFFFFF');
                        setShowPicker(true);
                      }}
                      className="flex items-center gap-2 px-12 py-4 rounded-[36px] text-black/30 hover:bg-white/10 transition-all"
                    >
                      <span className="text-[14px] font-black tracking-widest">时间</span>
                    </motion.button>
                </motion.div>
              ) : (
                  <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    className="w-full bg-white/5 backdrop-blur-[40px] rounded-[40px] p-8 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] flex flex-col gap-8 relative overflow-hidden"
                  >
                    {/* Liquid Glass Accents */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-black/5 rounded-full blur-[60px] pointer-events-none" />
                    
                    <div className="flex justify-between items-center px-2 relative z-10">
                      <span className="text-[10px] font-black text-black/15 tracking-[0.4em] uppercase">
                        {colorTarget === 'date' ? 'Date Color' : 'Time Color'}
                      </span>
                      <div 
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm" 
                        style={{ backgroundColor: tempColor }}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-6 relative z-10">
                      <div className="relative group">
                        <input 
                          type="text"
                          value={tempColor}
                          onChange={(e) => setTempColor(e.target.value)}
                          placeholder="#000000"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          tabIndex={-1}
                          className="w-full bg-black/[0.02] border border-white/5 outline-none px-8 py-4 rounded-[24px] text-[13px] font-sans font-black text-black/40 placeholder:text-black/5 text-center tracking-[0.2em] transition-all focus:bg-black/[0.04]"
                        />
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        {/* iOS Palette UI - Now always visible and more refined */}
                        <div className="w-full flex flex-col items-center">
                          <div className="w-full h-28 rounded-[28px] relative overflow-hidden shadow-inner border border-white/10 bg-white/5">
                            <input 
                              type="color"
                              value={tempColor.startsWith('#') ? tempColor : '#FFFFFF'}
                              onChange={(e) => setTempColor(e.target.value.toUpperCase())}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div 
                              className="absolute inset-0 pointer-events-none opacity-80"
                              style={{ 
                                background: `linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`
                              }}
                            />
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/40 via-transparent to-black/40 opacity-40" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-[9px] font-black text-white/30 tracking-[0.5em] uppercase">iOS Palette</span>
                            </div>
                            {/* Liquid Glass Overlay */}
                            <div className="absolute inset-0 pointer-events-none backdrop-blur-[2px] bg-white/5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (colorTarget === 'date') {
                          setCurrentConfig(prev => ({ ...prev, lockDateColor: tempColor }));
                        } else {
                          setCurrentConfig(prev => ({ ...prev, lockTimeColor: tempColor }));
                        }
                        setColorTarget(null);
                        setShowPicker(true);
                      }}
                      className="w-full bg-black/5 text-black/30 py-4 rounded-[24px] text-[12px] font-black tracking-[0.3em] uppercase active:bg-black/10 transition-all border border-white/5 shadow-sm relative z-10"
                    >
                      Done
                    </motion.button>
                  </motion.div>
              )}

              {/* Outer Confirmation Button */}
              {!colorTarget && (
                <motion.button
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsColorMenuOpen(false)}
                  className="w-full bg-white/10 backdrop-blur-[40px] border border-white/20 py-5 rounded-[32px] shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span className="text-[14px] font-black text-black/60 tracking-tight">Done</span>
                  <Check size={16} className="text-black/20 group-hover:text-black/40 transition-colors" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {pendingImage && (
        <ImageCropper
          imageSrc={pendingImage}
          widgetId="wallpaper"
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setPendingImage(null);
            setCropTarget(null);
          }}
        />
      )}
    </div>
  );
}
