'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';
import Box from './Box.tsx';

const base = Box;

type ComponentBase = typeof base;

const stackVM = cvm('flex', {
	variants: {
		orientation: {
			horizontal: 'flex-row data-[order=reversed]:flex-row-reversed',
			vertical: 'flex-col data-[order=reversed]:flex-col-reversed',
		},
	},
	defaultVariants: {
		orientation: 'vertical',
	},
	compoundVariants: [],
});

interface StackProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof stackVM> {
	order?: 'normal' | 'reversed';
	gap?: string;
}

const Stack = forwardRef<RefType<ComponentBase>, StackProps>((props: StackProps, forwardedRef) => {
	const {
		className,
		order = 'normal',
		orientation = 'vertical',
		asChild = false,
		gap = '0.5rem', // 2px
		...restProps
	} = props;
	const Comp = asChild ? Slot : base;
	return (
		<Comp
			{...restProps}
			ref={forwardedRef}
			className={cn(stackVM({ orientation }), className)}
			style={{ gap }}
			data-order={order}
		>
			{props.children}
		</Comp>
	);
});

export default Stack;
export type { StackProps as Props };
