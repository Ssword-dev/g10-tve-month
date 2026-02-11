'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'span';

type ComponentBase = typeof base;

const terminalLineVM = cvm('inline-flex flex-row break-words', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface TerminalLineProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof terminalLineVM> {}

const TerminalLine = forwardRef<RefType<ComponentBase>, TerminalLineProps>(
	(props: TerminalLineProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(terminalLineVM({}), className)}
			>
				{props.children}
			</Comp>
		);
	},
);

export default TerminalLine;
export type { TerminalLineProps as Props };
