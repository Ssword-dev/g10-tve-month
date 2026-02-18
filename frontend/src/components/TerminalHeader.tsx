'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'div';

type ComponentBase = typeof base;

const terminalHeaderVM = cvm('flex flex-row gap-2 px-2 py-3 bg-card rounded-t-md', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface TerminalHeaderProps
	extends Omit<Props<ComponentBase>, 'children'>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof terminalHeaderVM> {}

const TerminalHeader = forwardRef<RefType<ComponentBase>, TerminalHeaderProps>(
	(props: TerminalHeaderProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(terminalHeaderVM({}), className)}
			>
				<div className="w-4 aspect-square bg-accent rounded-full" />
				<div className="w-4 aspect-square bg-secondary rounded-full" />
				<div className="w-4 aspect-square bg-primary rounded-full" />
			</Comp>
		);
	},
);

export default TerminalHeader;
export type { TerminalHeaderProps as Props };
