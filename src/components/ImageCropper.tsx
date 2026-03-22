import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

interface ImageCropperProps {
  imageSrc: string;
  widgetId: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, widgetId, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  let aspect = 1;
  let cropShape: 'rect' | 'round' = 'rect';
  let cropAreaStyle: React.CSSProperties = {};
  let svgOutline = '';

  if (widgetId === 'circle-1') {
    cropShape = 'round';
    svgOutline = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><circle cx="50%" cy="50%" r="calc(50% - 1px)" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" /></svg>`;
  } else if (widgetId === 'donut') {
    cropShape = 'round';
    svgOutline = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><circle cx="50%" cy="50%" r="15%" fill="rgba(0,0,0,0.5)" /><circle cx="50%" cy="50%" r="calc(50% - 1px)" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" /><circle cx="50%" cy="50%" r="15%" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" /></svg>`;
  } else if (widgetId === 'large-square') {
    cropAreaStyle = { borderRadius: '32px' };
    svgOutline = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect x="1px" y="1px" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="32" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" /></svg>`;
  } else if (widgetId === 'rect-ears') {
    aspect = 4 / 1.4;
    svgOutline = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <mask id="shape-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect x="10%" y="0" width="15%" height="100%" rx="16" fill="black" />
          <rect x="75%" y="0" width="15%" height="100%" rx="16" fill="black" />
          <rect x="0" y="15%" width="100%" height="85%" rx="32" fill="black" />
        </mask>
        <mask id="inner-stroke">
          <rect width="100%" height="100%" fill="white" />
          <rect x="calc(10% + 2px)" y="2px" width="calc(15% - 4px)" height="calc(100% - 4px)" rx="14" fill="black" />
          <rect x="calc(75% + 2px)" y="2px" width="calc(15% - 4px)" height="calc(100% - 4px)" rx="14" fill="black" />
          <rect x="2px" y="calc(15% + 2px)" width="calc(100% - 4px)" height="calc(85% - 4px)" rx="30" fill="black" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#shape-mask)" />
      <g mask="url(#inner-stroke)" fill="rgba(255,255,255,0.9)">
        <rect x="10%" y="0" width="15%" height="100%" rx="16" />
        <rect x="75%" y="0" width="15%" height="100%" rx="16" />
        <rect x="0" y="15%" width="100%" height="85%" rx="32" />
      </g>
    </svg>`;
  } else if (widgetId === 'wallpaper') {
    aspect = 9 / 19.5; // Standard modern phone aspect ratio
  }

  if (svgOutline) {
    const bgUrl = `url('data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgOutline.replace(/\n/g, '').replace(/\s+/g, ' '))}')`;
    cropAreaStyle = {
      ...cropAreaStyle,
      backgroundImage: bgUrl,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    };
  }

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={setZoom}
          showGrid={false}
          style={{
            containerStyle: { backgroundColor: '#000' },
            cropAreaStyle: { border: 'none', ...cropAreaStyle }
          }}
        />
      </div>
      <div className="h-20 bg-black flex items-center justify-between px-6 pb-4 pt-2 border-t border-white/10">
        <button onClick={onCancel} className="text-white/90 text-[16px] font-normal active:opacity-50 transition-opacity px-2 py-2">
          取消
        </button>
        <div className="text-white/60 text-[13px] font-medium tracking-wide">移动和缩放</div>
        <button onClick={handleConfirm} className="text-white text-[16px] font-semibold active:opacity-50 transition-opacity px-2 py-2">
          完成
        </button>
      </div>
    </div>
  );
}
