import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
      variant: {
        default: 'bg-secondary',
        success: 'bg-success/20',
        warning: 'bg-warning/20',
        error: 'bg-destructive/20',
        ai: 'bg-ai-100 dark:bg-ai-900',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 bg-primary transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-destructive',
        ai: 'bg-gradient-to-r from-ai-500 to-ai-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>['variant'];
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, variant, indicatorVariant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size, variant, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ variant: indicatorVariant || variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants };