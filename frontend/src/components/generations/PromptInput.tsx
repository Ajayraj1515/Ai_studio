interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function PromptInput({ value, onChange, disabled = false, placeholder }: PromptInputProps) {
  const characterCount = value.length;
  const maxLength = 500;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isAtLimit = characterCount >= maxLength;

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= maxLength) {
            onChange(newValue);
          }
        }}
        disabled={disabled}
        placeholder={placeholder || "Describe your fashion design..."}
        className="input resize-none h-24"
        aria-label="Generation prompt"
        aria-describedby="prompt-help"
      />
      <div className="flex items-center justify-between">
        <p id="prompt-help" className="text-sm text-gray-500">
          Be descriptive about colors, style, mood, and details you want to see.
        </p>
        <div className="text-sm">
          <span className={`${isNearLimit ? (isAtLimit ? 'text-red-600' : 'text-yellow-600') : 'text-gray-500'}`}>
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
}