import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-ai-600 dark:text-white dark:hover:bg-ai-700',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-dark-card dark:text-dark-text dark:hover:bg-dark-border dark:border dark:border-dark-border',
        ai: 'bg-gradient-to-r from-ai-500 to-ai-600 text-white hover:from-ai-600 hover:to-ai-700 shadow-lg dark:from-ai-600 dark:to-ai-700 dark:hover:from-ai-700 dark:hover:to-ai-800',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-dark-border dark:bg-transparent dark:text-dark-text dark:hover:bg-dark-card',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:text-dark-text dark:hover:bg-dark-border',
        link: 'text-primary underline-offset-4 hover:underline dark:text-ai-400 dark:hover:text-ai-300',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };