import { cn, cvm } from '@_ssword/classes';
import { forwardRef } from 'react';
import type { ClassProps, PropType, RefType, VariantProps } from './types';

const base = 'div';

type ComponentBase = typeof base;

const cardDescriptionVM = cvm('text-muted-foreground text-sm', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardDescriptionProps
	extends PropType<ComponentBase>,
		ClassProps,
		VariantProps<typeof cardDescriptionVM> {}

const CardDescription = forwardRef<RefType<ComponentBase>, CardDescriptionProps>(
	(props, forwardedRef) => {
		const { className, ...intrinsicProps } = props;
		const Comp = base;

		return (
			<Comp
				{...intrinsicProps}
				className={cn(cardDescriptionVM({}), className)}
				ref={forwardedRef}
			/>
		);
	},
);

export default CardDescription;
export type { CardDescriptionProps as Props };
