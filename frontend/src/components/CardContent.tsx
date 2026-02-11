import { cn, cvm } from '@_ssword/classes';
import type { ClassProps, Props, RefType, VariantProps } from './types';
import { forwardRef } from 'react';

const base = 'div';

type ComponentBase = typeof base;

const cardContentVM = cvm('px-6 flex-grow', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardContentProps
	extends Props<ComponentBase>,
		ClassProps,
		VariantProps<typeof cardContentVM> {}

const CardContent = forwardRef<RefType<ComponentBase>, CardContentProps>((props, forwardedRef) => {
	const Comp = base;
	const { className, ...baseProps } = props;

	return (
		<Comp
			{...baseProps}
			className={cn(cardContentVM({}), className)}
			ref={forwardedRef}
		/>
	);
});

export default CardContent;
export type { CardContentProps as Props };
