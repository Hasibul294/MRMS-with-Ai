import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label} {props.required && <span className="text-rose-400">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={twMerge(
            clsx(
              'w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-lg text-sm border px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 resize-y',
              error
                ? 'border-rose-500/80 text-rose-200 focus:ring-rose-500/40 focus:border-rose-500'
                : 'border-slate-800 hover:border-slate-700',
              className
            )
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
