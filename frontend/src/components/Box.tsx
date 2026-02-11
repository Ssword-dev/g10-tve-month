import { cn, cvm } from '@_ssword/classes';
import { forwardRef } from 'react';
import type { AsChildProps, ClassProps, Props, RefType, VariantProps } from './types';
import { Slot } from '@radix-ui/react-slot';

const base = 'div';

type ComponentBase = typeof base;

const boxVM = cvm('p-2', {
	variants: {
		// alignment of the box
		align: {
			start: 'self-start',
			end: 'self-end',
			center: 'self-center',
		},

		justify: {
			start: '[.flex-row>&]:ml-0 [.flex-col>&]:mt-0',
			end: '[.flex-row>&]:ml-auto [.flex-col>&]:mt-auto',
			center: '[.flex-row>&]:my-auto [.flex-col>&]:my-auto',
		},
	},
	defaultVariants: {
		align: 'start',
		justify: 'start',
	},
	compoundVariants: [],
});

interface BoxProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof boxVM> {}

/**
 * A design primitive. the base of all box model block components.
 */
const Box = forwardRef<RefType<ComponentBase>, BoxProps>((props, forwardedRef) => {
	const { align, justify, className, asChild = false, ...baseProps } = props;
	const Comp = asChild ? Slot : base;
	return (
		<Comp
			{...baseProps}
			className={cn(boxVM({ align, justify }), className)}
			ref={forwardedRef}
		/>
	);
});

export default Box;
export type { BoxProps as Props };
