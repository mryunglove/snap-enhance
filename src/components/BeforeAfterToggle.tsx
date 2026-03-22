interface BeforeAfterToggleProps {
  showAfter: boolean;
  onToggle: (showAfter: boolean) => void;
  disabled?: boolean;
}

export default function BeforeAfterToggle({ showAfter, onToggle, disabled }: BeforeAfterToggleProps) {
  return (
    <div className="inline-flex items-center bg-muted rounded-full p-1 gap-0.5">
      <button
        onClick={() => onToggle(false)}
        disabled={disabled}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          !showAfter
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Before
      </button>
      <button
        onClick={() => onToggle(true)}
        disabled={disabled}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          showAfter
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        After
      </button>
    </div>
  );
}
