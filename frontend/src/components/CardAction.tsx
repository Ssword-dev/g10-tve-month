import { cn, cvm } from '@_ssword/classes';
import { forwardRef } from 'react';
import type { ClassProps, Props, RefType, VariantProps } from './types';

const base = 'div';

type ComponentBase = typeof base;

const cardActionVM = cvm('col-start-2 row-span-2 row-start-1 self-start justify-self-end', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardActionProps
	extends Props<ComponentBase>,
		ClassProps,
		VariantProps<typeof cardActionVM> {}

const CardAction = forwardRef<RefType<ComponentBase>, CardActionProps>((props, forwardedRef) => {
	const { className, ...baseProps } = props;
	const Comp = base;

	return (
		<Comp
			{...baseProps}
			className={cn(cardActionVM({}), className)}
			ref={forwardedRef}
		/>
	);
});

export default CardAction;
export type { CardActionProps as Props };
