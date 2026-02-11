'use client';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn, cvm } from '@_ssword/classes';

import type { RefType, Props, ClassProps, AsChildProps, VariantProps } from './types.ts';

const base = 'div';

type ComponentBase = typeof base;

const screenVM = cvm(
	'pointer-events-none *:pointer-events-auto z-10000 fixed h-screen w-screen m-0 p-0 bg-transparent',
	{
		variants: {},
		defaultVariants: {},
		compoundVariants: [],
	},
);

interface ScreenProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof screenVM> {}

const Screen = forwardRef<RefType<ComponentBase>, ScreenProps>(
	(props: ScreenProps, forwardedRef) => {
		const { className, asChild = false, ...restProps } = props;
		const Comp = asChild ? Slot : base;
		return (
			<Comp
				{...restProps}
				ref={forwardedRef}
				className={cn(screenVM({}), className)}
			>
				{props.children}
			</Comp>
		);
	},
);

export default Screen;
export type { ScreenProps as Props };
