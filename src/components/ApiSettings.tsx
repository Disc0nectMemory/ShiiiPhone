import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export interface ApiConfig {
  text: { baseUrl: string; apiKey: string; model: string; };
  vision?: { baseUrl: string; apiKey: string; model: string; };
  voice?: { baseUrl: string; apiKey: string; model: string; };
  image?: { baseUrl: string; apiKey: string; model: string; };
}

export const getApiConfig = (): ApiConfig => {
  const config = localStorage.getItem('api_config');
  if (config) {
    return JSON.parse(config);
  }
  return {
    text: { baseUrl: '', apiKey: '', model: '' },
  };
};

export const saveApiConfig = (config: ApiConfig) => {
  localStorage.setItem('api_config', JSON.stringify(config));
};

export const fetchModels = async (baseUrl: string, apiKey: string): Promise<string[]> => {
  try {
    const proxyResponse = await fetch('/api/proxy/models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ baseUrl, apiKey })
    });
    
    if (!proxyResponse.ok) {
      const errorData = await proxyResponse.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch models via proxy');
    }
    
    const data = await proxyResponse.json();
    if (data && data.data && Array.isArray(data.data)) {
      return Array.from(new Set(data.data.map((m: any) => m.id))) as string[];
    } else if (Array.isArray(data)) {
      return Array.from(new Set(data.map((m: any) => m.id || m.name || m))) as string[];
    }
    
    throw new Error('Invalid response format from proxy');
  } catch (proxyError: any) {
    console.error('Proxy fetch failed:', proxyError);
    throw new Error('网络请求失败，请检查API地址是否正确，或API服务是否可用');
  }
};

export const ApiSettingsPage = ({ onBack }: { onBack: () => void }) => {
  const [activeType, setActiveType] = useState<'text' | 'vision' | 'voice' | 'image'>('text');
  const [configs, setConfigs] = useState<ApiConfig>(getApiConfig());
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState('');

  const currentConfig = configs[activeType] || { baseUrl: '', apiKey: '', model: '' };

  useEffect(() => {
    const config = getApiConfig();
    setConfigs(config);
  }, []);

  const updateCurrentConfig = (field: keyof typeof currentConfig, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [activeType]: {
        ...(prev[activeType] || { baseUrl: '', apiKey: '', model: '' }),
        [field]: value
      }
    }));
  };

  const handleFetchModels = async () => {
    if (activeType === 'text' && (!currentConfig.baseUrl || !currentConfig.apiKey)) {
      setMessage('请先输入文本API地址和API密钥');
      return;
    }
    if (activeType !== 'text' && (!currentConfig.baseUrl || !currentConfig.apiKey)) {
      setMessage('请先输入API地址和API密钥');
      return;
    }
    setIsFetching(true);
    setMessage('');
    try {
      const models = await fetchModels(currentConfig.baseUrl, currentConfig.apiKey);
      setAvailableModels(models);
      // Removed automatic model selection
      setMessage('拉取成功，请点击输入框选取或手动输入');
    } catch (error) {
      setMessage('拉取失败，请检查地址和密钥');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = () => {
    saveApiConfig(configs);
    setMessage('配置已保存');
  };

  const handleApply = () => {
    saveApiConfig(configs);
    setMessage('配置已应用');
  };

  const handleClear = () => {
    setConfigs(prev => ({
      ...prev,
      [activeType]: { baseUrl: '', apiKey: '', model: '' }
    }));
    setAvailableModels([]);
    setMessage('已清空');
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] select-none font-sans">
      {/* Header */}
      <div className="pt-16 pb-4 flex flex-col items-center relative">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute left-6 top-16 p-2 -ml-2 text-black/40"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <span className="text-[15px] font-semibold text-black/80 tracking-widest mb-4">API设定</span>
        <div className="w-full h-[1px] bg-black/5" />
      </div>

      {/* Floating Selector */}
      <div className="sticky top-0 z-30 pt-2 pb-4">
        <div className="mx-auto w-fit bg-white/30 backdrop-blur-2xl rounded-full p-1 shadow-lg border border-white/40 flex">
          {[
            { id: 'text', label: '文本' },
            { id: 'vision', label: '识图' },
            { id: 'voice', label: '语音' },
            { id: 'image', label: '生图' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id as any)}
              className={`relative px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${activeType === type.id ? 'text-black' : 'text-black/60'}`}
            >
              {activeType === type.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/80 rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-12">
        {/* Connection Settings */}
        <div className="mt-2">
          <span className="text-[11px] font-medium text-black/40 tracking-widest uppercase ml-2 mb-2 block">
            Connection ({activeType === 'text' ? 'Text' : activeType === 'vision' ? 'Vision' : activeType === 'voice' ? 'Voice' : 'Image'})
          </span>
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/5">
              <span className="text-[12px] font-medium text-black/50 block mb-1.5 tracking-wide">
                API地址 <span className="text-black/30">{activeType === 'text' ? '(必填)' : '(选填)'}</span>
              </span>
              <input 
                type="text" 
                value={currentConfig.baseUrl}
                onChange={(e) => updateCurrentConfig('baseUrl', e.target.value)}
                placeholder="https://example.com/v1"
                className="w-full text-[14px] text-black/80 outline-none bg-transparent placeholder:text-black/20 font-medium"
              />
            </div>
            <div className="px-5 py-4">
              <span className="text-[12px] font-medium text-black/50 block mb-1.5 tracking-wide">
                API密钥
              </span>
              <input 
                type="password" 
                value={currentConfig.apiKey}
                onChange={(e) => updateCurrentConfig('apiKey', e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full text-[14px] text-black/80 outline-none bg-transparent placeholder:text-black/20 font-medium tracking-widest"
              />
            </div>
          </div>
        </div>

        {/* Model Selection */}
        <div className="mt-8">
          <span className="text-[11px] font-medium text-black/40 tracking-widest uppercase ml-2 mb-2 block">Model</span>
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <span className="text-[12px] font-medium text-black/50 block mb-1.5 tracking-wide">选取API模型</span>
                <input
                  type="text"
                  value={currentConfig.model}
                  onChange={(e) => updateCurrentConfig('model', e.target.value)}
                  list="model-list"
                  placeholder="请选择或输入模型"
                  className="w-full text-[14px] text-black/80 outline-none bg-transparent font-medium"
                />
                <datalist id="model-list">
                  {availableModels.map(m => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
              <button 
                onClick={handleFetchModels}
                disabled={isFetching}
                className="shrink-0 bg-black/5 hover:bg-black/10 text-black/70 text-[12px] font-medium px-4 py-3 rounded-full active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isFetching ? '拉取中...' : '获取列表'}
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 text-center text-[12px] font-medium text-black/40 tracking-wide">
            {message}
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3">
          <button 
            onClick={handleApply}
            className="w-full bg-black/80 hover:bg-black text-white text-[14px] font-medium py-3.5 rounded-full active:scale-[0.98] transition-all shadow-md shadow-black/10 tracking-wide"
          >
            应用配置
          </button>
          <button 
            onClick={handleSave}
            className="w-full bg-black/5 hover:bg-black/10 text-black/70 text-[14px] font-medium py-3.5 rounded-full active:scale-[0.98] transition-all tracking-wide"
          >
            仅保存
          </button>
          <button 
            onClick={handleClear}
            className="w-full bg-white/40 backdrop-blur-xl border border-white/50 hover:bg-white/60 text-black/50 text-[14px] font-medium py-3.5 rounded-full active:scale-[0.98] transition-all tracking-wide shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            清空
          </button>
        </div>
      </div>
    </div>
  );
};
