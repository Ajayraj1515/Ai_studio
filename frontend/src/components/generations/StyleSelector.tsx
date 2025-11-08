import { Style } from '@shared/generation';

interface StyleSelectorProps {
  value: Style;
  onChange: (style: Style) => void;
  disabled?: boolean;
}

const styles: { value: Style; label: string; description: string }[] = [
  {
    value: 'photorealistic',
    label: 'Photorealistic',
    description: 'Realistic, high-quality photographs',
  },
  {
    value: 'artistic',
    label: 'Artistic',
    description: 'Creative and expressive artwork',
  },
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Clean, simple, and elegant design',
  },
  {
    value: 'vintage',
    label: 'Vintage',
    description: 'Classic, retro-inspired aesthetics',
  },
];

export function StyleSelector({ value, onChange, disabled = false }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {styles.map((style) => (
        <button
          key={style.value}
          onClick={() => onChange(style.value)}
          disabled={disabled}
          className={`
            p-3 rounded-lg border-2 text-left transition-all
            ${value === style.value
              ? 'border-primary-500 bg-primary-50 text-primary-900'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover-lift'}
          `}
          aria-pressed={value === style.value}
        >
          <div className="font-medium">{style.label}</div>
          <div className="text-sm text-gray-500 mt-1">{style.description}</div>
        </button>
      ))}
    </div>
  );
}