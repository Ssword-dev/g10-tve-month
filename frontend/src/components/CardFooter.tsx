import { cn, cvm } from '@_ssword/classes';
import type { ClassProps, Props, RefType, VariantProps } from './types';
import { forwardRef } from 'react';

const base = 'div';

type ComponentBase = typeof base;

const cardFooterVM = cvm('flex items-center px-6 [.border-t]:pt-6', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardFooterProps
	extends Props<ComponentBase>,
		ClassProps,
		VariantProps<typeof cardFooterVM> {}

const CardFooter = forwardRef<RefType<ComponentBase>, CardFooterProps>((props, forwardedRef) => {
	const { className, ...intrinsicProps } = props;
	const Comp = base;

	return (
		<Comp
			{...intrinsicProps}
			className={cn(cardFooterVM({}), className)}
			ref={forwardedRef}
		/>
	);
});

export default CardFooter;
export type { CardFooterProps as Props };
