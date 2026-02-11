import { forwardRef } from 'react';
import { cn, cvm } from '@_ssword/classes';
import type { AsChildProps, ClassProps, Props, RefType, VariantProps } from './types';
import Text from './Text';
import { Slot } from '@radix-ui/react-slot';

const base = Text;
type BaseComponent = typeof base;

const cardTitleVM = cvm('leading-none font-semibold', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardTitleProps
	extends Props<BaseComponent>,	
		AsChildProps,
		ClassProps,
		VariantProps<typeof cardTitleVM> {}

const CardTitle = forwardRef<RefType<BaseComponent>, CardTitleProps>(
	({ className, color, size, asChild, ...intrinsicProps }, forwardedRef) => {
		const Comp = asChild ? Slot : base;

		return (
			<Comp
				{...intrinsicProps}
				ref={forwardedRef}
				className={cn(cardTitleVM({ color, size }), className)}
			/>
		);
	},
);

export default CardTitle;
export type { CardTitleProps as Props };
