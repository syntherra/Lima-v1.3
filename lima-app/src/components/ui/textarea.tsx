import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:placeholder:text-dark-text-muted',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-dark-border dark:focus:border-ai-500 dark:focus:ring-ai-500',
        destructive: 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400',
        outline: 'border-gray-200 bg-transparent focus:border-gray-400 dark:border-dark-border dark:bg-transparent dark:focus:border-dark-text-muted',
      },
      size: {
        default: 'min-h-[80px]',
        sm: 'min-h-[60px] text-xs',
        lg: 'min-h-[120px] text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
export type { TextareaProps };