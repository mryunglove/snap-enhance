export type PresetType = 'enhance' | 'portrait' | 'vibrant' | 'sharp';

interface EnhanceOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: number;
  warmth?: number;
  softness?: number;
}

const PRESET_CONFIG: Record<PresetType, EnhanceOptions> = {
  enhance: { brightness: 1.08, contrast: 1.12, saturation: 1.15, sharpness: 0.4 },
  portrait: { brightness: 1.05, contrast: 1.05, saturation: 0.95, softness: 1.2, warmth: 0.08 },
  vibrant: { brightness: 1.1, contrast: 1.18, saturation: 1.4, sharpness: 0.2 },
  sharp: { brightness: 1.02, contrast: 1.15, saturation: 1.05, sharpness: 0.8 },
};

export function enhanceImage(
  imageUrl: string,
  preset: PresetType
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }

        canvas.width = img.width;
        canvas.height = img.height;

        const config = PRESET_CONFIG[preset];

        // Apply CSS-like filters via canvas
        const filters: string[] = [];
        if (config.brightness) filters.push(`brightness(${config.brightness})`);
        if (config.contrast) filters.push(`contrast(${config.contrast})`);
        if (config.saturation) filters.push(`saturate(${config.saturation})`);
        if (config.softness) filters.push(`blur(${config.softness}px)`);

        ctx.filter = filters.join(' ');
        ctx.drawImage(img, 0, 0);

        // Apply warmth via overlay
        if (config.warmth && config.warmth > 0) {
          ctx.filter = 'none';
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = `rgba(255, 180, 100, ${config.warmth})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'source-over';
        }

        // Apply sharpening via unsharp mask
        if (config.sharpness && config.sharpness > 0 && !config.softness) {
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCtx.filter = `blur(1px)`;
            tempCtx.drawImage(canvas, 0, 0);

            ctx.filter = 'none';
            ctx.globalCompositeOperation = 'source-over';
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const blurData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
            const amount = config.sharpness;

            for (let i = 0; i < imageData.data.length; i += 4) {
              imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + amount * (imageData.data[i] - blurData.data[i])));
              imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + amount * (imageData.data[i + 1] - blurData.data[i + 1])));
              imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + amount * (imageData.data[i + 2] - blurData.data[i + 2])));
            }
            ctx.putImageData(imageData, 0, 0);
          }
        }

        // For portrait, re-draw without blur but keep color adjustments, then selectively soften
        if (config.softness) {
          // Redraw sharp version blended
          ctx.filter = 'none';
          ctx.globalAlpha = 0.3;
          ctx.drawImage(img, 0, 0);
          ctx.globalAlpha = 1;
        }

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

export function downloadImage(dataUrl: string, filename = 'snapboost-enhanced.jpg') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
