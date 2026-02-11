'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'div';

type ComponentBase = typeof base;

const terminalInputVM = cvm('inline-flex flex-row text-wrap', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface TerminalInputProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof terminalInputVM> {}

const TerminalInput = forwardRef<RefType<ComponentBase>, TerminalInputProps>(
	(props: TerminalInputProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(terminalInputVM({}), className)}
			>
				{props.children}
			</Comp>
		);
	},
);

export default TerminalInput;
export type { TerminalInputProps as Props };
