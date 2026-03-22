import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ImageIcon, Sparkles, Zap, Shield } from 'lucide-react';

const DEMO_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';

export default function Index() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      navigate('/editor', { state: { imageUrl: reader.result as string } });
    };
    reader.readAsDataURL(file);
  };

  const handleDemo = () => {
    navigate('/editor', { state: { imageUrl: DEMO_IMAGE } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="animate-fade-up flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="snap-heading text-4xl mb-3" style={{ lineHeight: '1.1' }}>
            SnapBoost
          </h1>
          <p className="snap-body text-lg max-w-[280px]">
            Make any photo look better instantly
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm mt-12 space-y-3 animate-fade-up" style={{ animationDelay: '150ms' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.97]"
          >
            <Upload className="w-5 h-5" />
            Upload Photo
          </button>
          <button
            onClick={handleDemo}
            className="w-full flex items-center justify-center gap-3 bg-secondary text-secondary-foreground py-4 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.97]"
          >
            <ImageIcon className="w-5 h-5" />
            Try Demo Photo
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-10 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Zap, title: 'Fast', desc: 'Instant results' },
            { icon: Sparkles, title: 'Smart', desc: 'AI-powered' },
            { icon: Shield, title: 'Private', desc: 'No uploads' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl bg-card border border-border">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">{title}</span>
              <span className="text-[11px] text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
