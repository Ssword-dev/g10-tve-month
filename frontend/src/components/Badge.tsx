import { cn, cvm } from '@_ssword/classes';
import { forwardRef } from 'react';
import type { ClassProps, Props, RefType, VariantProps } from './types';

const base = 'span';

type ComponentBase = typeof base;

const badgeVM = cvm('inline-flex px-2 py-1 text-text', {
	variants: {
		variant: {
			default: '',
			primary: 'bg-primary',
			secondary: 'bg-secondary',
			info: 'bg-info',
			warn: 'bg-warn',
			destructive: 'bg-destructive',
		},
	},
	defaultVariants: {},
	compoundVariants: [],
});

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
