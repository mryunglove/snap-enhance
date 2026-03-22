import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Wand2, Download, RotateCcw, Loader2, Check } from 'lucide-react';
import PresetButtons from '@/components/PresetButtons';
import BeforeAfterToggle from '@/components/BeforeAfterToggle';
import { enhanceImage, downloadImage, type PresetType } from '@/lib/imageEnhance';
import { toast } from 'sonner';

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const originalImage = (location.state as { imageUrl?: string })?.imageUrl;

  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetType | null>(null);
  const [showAfter, setShowAfter] = useState(false);

  const applyEnhancement = useCallback(async (preset: PresetType) => {
    if (!originalImage) return;
    setIsLoading(true);
    setSelectedPreset(preset);
    try {
      await new Promise(r => setTimeout(r, 800));
      const result = await enhanceImage(originalImage, preset);
      setEnhancedImage(result);
      setShowAfter(true);
      toast.success('Photo enhanced!');
    } catch {
      toast.error('Enhancement failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  if (!originalImage) {
    navigate('/');
    return null;
  }

  const applyEnhancement = useCallback(async (preset: PresetType) => {
    setIsLoading(true);
    setSelectedPreset(preset);
    try {
      // Simulate slight delay for perceived AI processing
      await new Promise(r => setTimeout(r, 800));
      const result = await enhanceImage(originalImage, preset);
      setEnhancedImage(result);
      setShowAfter(true);
      toast.success('Photo enhanced!');
    } catch {
      toast.error('Enhancement failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleEnhance = () => applyEnhancement('enhance');
  const handlePreset = (preset: PresetType) => applyEnhancement(preset);

  const handleSave = () => {
    if (enhancedImage) {
      downloadImage(enhancedImage);
      toast.success('Image saved!');
    }
  };

  const handleReset = () => {
    setEnhancedImage(null);
    setSelectedPreset(null);
    setShowAfter(false);
  };

  const displayImage = showAfter && enhancedImage ? enhancedImage : originalImage;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold">Editor</h1>
        {enhancedImage ? (
          <button
            onClick={handleReset}
            className="p-2 -mr-2 rounded-lg hover:bg-muted transition-colors active:scale-95 text-muted-foreground"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}
      </header>

      {/* Image Display */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-lg">
          <img
            src={displayImage}
            alt={showAfter ? 'Enhanced photo' : 'Original photo'}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
              <span className="text-primary-foreground text-sm font-medium">Enhancing your photo...</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-6 pt-2 space-y-4 bg-card border-t border-border rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        {/* Before/After Toggle */}
        {enhancedImage && (
          <div className="flex justify-center animate-fade-up">
            <BeforeAfterToggle showAfter={showAfter} onToggle={setShowAfter} />
          </div>
        )}

        {/* Presets */}
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Presets</p>
          <PresetButtons selected={selectedPreset} onSelect={handlePreset} disabled={isLoading} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
          {!enhancedImage ? (
            <button
              onClick={handleEnhance}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              Enhance Photo
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/', { state: { imageUrl: originalImage } })}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-4 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.97]"
              >
                <RotateCcw className="w-4 h-4" />
                Edit Again
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.97]"
              >
                <Download className="w-5 h-5" />
                Save Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
