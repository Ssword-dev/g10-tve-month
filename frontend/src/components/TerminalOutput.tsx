'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'span';

type ComponentBase = typeof base;

const terminalOutputVM = cvm('inline-flex flex-row font-mono text-foreground', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface TerminalOutputProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof terminalOutputVM> {}

const TerminalOutput = forwardRef<RefType<ComponentBase>, TerminalOutputProps>(
	(props: TerminalOutputProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(terminalOutputVM({}), className)}
			>
				{props.children}
			</Comp>
		);
	},
);

export default TerminalOutput;
export type { TerminalOutputProps as Props };
