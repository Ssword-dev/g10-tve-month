'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'span';

type ComponentBase = typeof base;

const terminalPromptVM = cvm('inline-flex flex-row select-none whitespace-nowrap', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface TerminalPromptProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof terminalPromptVM> {}

const TerminalPrompt = forwardRef<RefType<ComponentBase>, TerminalPromptProps>(
	(props: TerminalPromptProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(terminalPromptVM({}), className)}
			>
				{props.children}
			</Comp>
		);
	},
);

export default TerminalPrompt;
export type { TerminalPromptProps as Props };
