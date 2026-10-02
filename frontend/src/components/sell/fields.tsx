import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

const BOX =
  'flex flex-col rounded-xl border px-4 py-3 transition-colors border-white/10 bg-white/[0.03] focus-within:border-amber-200/40 light:border-black/10 light:bg-white light:focus-within:border-black/30';
const LABEL = 'text-xs text-neutral-500';
const CONTROL =
  'w-full bg-transparent text-sm font-medium text-white focus:outline-none light:text-neutral-900';

interface BaseProps {
  label: string;
  className?: string;
}

interface TextFieldProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: 'numeric' | 'text';
}

export const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  inputMode = 'text',
  className = '',
}: TextFieldProps) => (
  <label className={`${BOX} ${className}`}>
    <span className={LABEL}>{label}</span>
    <input
      value={value}
      inputMode={inputMode}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${CONTROL} placeholder:font-normal placeholder:text-neutral-600`}
    />
  </label>
);

interface SelectFieldProps extends BaseProps {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

export const SelectField = ({
  label,
  value,
  options,
  onChange,
  className = '',
}: SelectFieldProps) => (
  <label className={`${BOX} relative ${className}`}>
    <span className={LABEL}>{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${CONTROL} appearance-none pr-6`}
    >
      {options.map((option) => (
        <option key={option} value={option} className="text-black">
          {option}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
    />
  </label>
);

interface TextAreaFieldProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  className = '',
}: TextAreaFieldProps) => (
  <label className={`${BOX} ${className}`}>
    <span className={LABEL}>{label}</span>
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${CONTROL} resize-none placeholder:font-normal placeholder:text-neutral-600`}
    />
  </label>
);

interface CheckboxFieldProps {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxField = ({
  label,
  checked,
  onChange,
}: CheckboxFieldProps) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-neutral-300 light:border-black/10 light:bg-white light:text-neutral-700">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 accent-amber-300"
    />
    {label}
  </label>
);
