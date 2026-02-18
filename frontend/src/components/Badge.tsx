import { cn, cvm } from '@_ssword/classes';
import { forwardRef } from 'react';
import type { ClassProps, Props, RefType, VariantProps } from './types';

const base = 'span';

type ComponentBase = typeof base;

const badgeVM = cvm(
	'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none',
	{
		variants: {
			variant: {
				default: 'border-border bg-muted text-muted-foreground',
				primary: 'border-transparent bg-primary text-primary-foreground',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
				info: 'border-transparent bg-info/15 text-info',
				warn: 'border-transparent bg-warning/20 text-foreground',
				destructive:
					'border-transparent bg-destructive/15 text-destructive',
			},
		},
		defaultVariants: {},
		compoundVariants: [],
	},
);

interface BadgeProps extends Props<ComponentBase>, ClassProps, VariantProps<typeof badgeVM> {}

/**
 * A non-interactable indicator that looks like a badge.
 */
const Badge = forwardRef<RefType<ComponentBase>, BadgeProps>((props, forwardedRef) => {
	const { variant, className, ...baseProps } = props;
	const Comp = base;

	return (
		<Comp
			{...baseProps}
			className={cn(badgeVM({ variant }), className)}
			ref={forwardedRef}
		/>
	);
});

Badge.displayName = 'Badge';

export default Badge;
export type { BadgeProps as Props };
