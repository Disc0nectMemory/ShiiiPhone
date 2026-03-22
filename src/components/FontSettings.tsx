import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';

export type FontFamily = 'sans' | 'serif' | 'tech' | 'mono' | 'elegant';

interface FontOption {
  id: FontFamily;
  name: string;
  preview: string;
  className: string;
}

const FONT_OPTIONS: FontOption[] = [
  { id: 'sans', name: '极简无衬线 (Inter)', preview: 'The quick brown fox', className: 'font-sans' },
  { id: 'serif', name: '经典衬线 (Playfair)', preview: 'The quick brown fox', className: 'font-serif' },
  { id: 'tech', name: '未来科技 (Space)', preview: 'The quick brown fox', className: 'font-tech' },
  { id: 'mono', name: '极客等宽 (JetBrains)', preview: 'The quick brown fox', className: 'font-mono' },
  { id: 'elegant', name: '优雅古典 (Cormorant)', preview: 'The quick brown fox', className: 'font-elegant' },
];

interface FontSettingsProps {
  onBack: () => void;
  currentFont: FontFamily;
  onSave: (font: FontFamily) => void;
}

const FontSettingsPage: React.FC<FontSettingsProps> = ({ onBack, currentFont, onSave }) => {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] select-none">
      {/* Header */}
      <div className="pt-16 pb-4 flex flex-col items-center relative">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute left-6 top-16 p-2 -ml-2 text-black/40"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <span className="text-[15px] font-semibold text-black/80 tracking-widest mb-4">更换手机字体</span>
        <div className="w-full h-[1px] bg-black/5" />
      </div>

      {/* Font List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {FONT_OPTIONS.map((font) => (
          <motion.div
            key={font.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSave(font.id)}
            className={`p-6 rounded-[32px] bg-white border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${
              currentFont === font.id 
                ? 'border-black/20 shadow-lg shadow-black/5' 
                : 'border-transparent shadow-sm'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-black tracking-[0.2em] uppercase text-black/40">
                {font.name}
              </span>
              {currentFont === font.id && (
                <Check size={16} className="text-black/60" />
              )}
            </div>
            <span className={`text-[24px] ${font.className} text-black/80 mt-2`}>
              {font.preview}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Footer Hint */}
      <div className="px-10 pb-12 pt-4 text-center">
        <p className="text-[11px] text-black/20 font-black tracking-[0.2em] uppercase leading-relaxed">
          选择一个符合您审美的字体<br />系统界面将全局应用此设置
        </p>
      </div>
    </div>
  );
};

export default FontSettingsPage;
