'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'div';

type ComponentBase = typeof base;

const terminalVM = cvm('', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface TerminalProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof terminalVM> {}

const Terminal = forwardRef<RefType<ComponentBase>, TerminalProps>(
	(props: TerminalProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(terminalVM({}), className)}
			>
				{props.children}
			</Comp>
		);
	},
);

export default Terminal;
export type { TerminalProps as Props };
