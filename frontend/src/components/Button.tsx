import { cn, cvm } from '@_ssword/classes';
import { forwardRef } from 'react';
import type { AsChildProps, ClassProps, Props, RefType, VariantProps } from './types';
import { Slot } from '@radix-ui/react-slot';

const base = 'button';

type ComponentBase = typeof base;

const buttonVM = cvm(
	'inline-flex items-center transition-all duration-200 ease-in-out px-4 py-2 text-base rounded-md border border-border bg-primary text-text hover:bg-accent hover:border-accent-strong hover:cursor-pointer active:scale-105 active:bg-accent active:border-accent-strong',
	{
		variants: {
			variant: {
				glass: 'bg-transparent backdrop-blur-md',
				primary: 'bg-primary',
			},
			size: {
				sm: 'px-3 py-1.5 text-sm',
				md: 'px-4 py-2 text-base',
				lg: 'px-6 py-3 text-lg',
				xl: 'px-8 py-4 text-xl',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
		compoundVariants: [],
	},
);

interface ButtonProps
	extends Props<ComponentBase>,
		ClassProps,
		AsChildProps,
		VariantProps<typeof buttonVM> {}

/**
 * A Clickable UI Primitive.
 */
const Button = forwardRef<RefType<ComponentBase>, ButtonProps>((props, forwardedRef) => {
	const { variant, size, className, asChild, ...baseProps } = props;

	const Comp = asChild ? Slot : base;
	return (
		<Comp
			{...baseProps}
			className={cn(buttonVM({ variant, size }), className)}
			ref={forwardedRef}
		/>
	);
});

export default Button;
export type { ButtonProps as Props };
