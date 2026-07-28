import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label} {props.required && <span className="text-rose-400">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-slate-900/90 text-slate-100 rounded-lg text-sm border px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500',
              error
                ? 'border-rose-500/80 text-rose-200 focus:ring-rose-500/40 focus:border-rose-500'
                : 'border-slate-800 hover:border-slate-700',
              className
            )
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-slate-900 text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
