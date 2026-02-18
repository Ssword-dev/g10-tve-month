'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'div';

type ComponentBase = typeof base;

const terminalInterfaceVM = cvm('px-2 py-1 bg-card/70 font-mono', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface TerminalInterfaceProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof terminalInterfaceVM> {}

const TerminalInterface = forwardRef<RefType<ComponentBase>, TerminalInterfaceProps>(
	(props: TerminalInterfaceProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(terminalInterfaceVM({}), className)}
			>
				{props.children}
			</Comp>
		);
	},
);

export default TerminalInterface;
export type { TerminalInterfaceProps as Props };
