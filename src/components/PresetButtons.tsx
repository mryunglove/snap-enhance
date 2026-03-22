import { Sparkles, Sun, Focus } from 'lucide-react';
import type { PresetType } from '@/lib/imageEnhance';

interface PresetButtonsProps {
  selected: PresetType | null;
  onSelect: (preset: PresetType) => void;
  disabled?: boolean;
}

const presets: { type: PresetType; label: string; icon: typeof Sparkles; desc: string }[] = [
  { type: 'portrait', label: 'Portrait', icon: Sun, desc: 'Soft & warm' },
  { type: 'vibrant', label: 'Vibrant', icon: Sparkles, desc: 'Bold colors' },
  { type: 'sharp', label: 'Sharp', icon: Focus, desc: 'Crisp detail' },
];

export default function PresetButtons({ selected, onSelect, disabled }: PresetButtonsProps) {
  return (
    <div className="flex gap-3">
      {presets.map(({ type, label, icon: Icon, desc }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          disabled={disabled}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border-2 transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${
            selected === type
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-primary/30'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-[11px] opacity-70">{desc}</span>
        </button>
      ))}
    </div>
  );
}
