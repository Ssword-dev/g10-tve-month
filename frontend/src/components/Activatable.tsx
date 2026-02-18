import { useState, useEffect, useRef, type PointerEvent, forwardRef } from 'react';
import { cn, cvm } from '@_ssword/classes';
import { Slot } from '@radix-ui/react-slot';
import type { AsChildProps, ClassProps, Props, RefType } from './types';

export interface ActivatableChangeEventMetadata {
	value: boolean;
}

const activatableVM = cvm(
	cn(
		'inline-flex items-center justify-center',
		'px-2 py-1 text-sm font-medium',
		'text-muted-foreground bg-transparent',
		'rounded-md border border-transparent',
		'transition-all duration-150 ease-in-out',
		'hover:bg-muted hover:text-foreground',
		'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
		'data-active:bg-accent',
		'data-active:text-primary',
		'data-active:border-primary',
		'data-active:scale-95',
	),
	{
		variants: {},
		defaultVariants: {},
		compoundVariants: [],
	},
);
export interface ActivatableProps
	extends Omit<Props<'button'>, 'onToggle'>,
		ClassProps,
		AsChildProps {
	normallyOpen?: boolean;
	onToggle?: (e: ActivatableChangeEventMetadata) => void;
}

const Activatable = forwardRef<RefType<'button'>, ActivatableProps>(
	({ normallyOpen = false, asChild = false, onToggle, className, children, ...rest }, ref) => {
		const [active, setActive] = useState(normallyOpen);
		const hydrating = useRef(true);

		useEffect(() => {
			const id = setTimeout(() => {
				hydrating.current = false;
			}, 0);
			return () => clearTimeout(id);
		}, []);

		const Comp = asChild ? Slot : 'button';

		const handleClick = (evt: PointerEvent<HTMLButtonElement>) => {
			const next = !active;
			onToggle?.({ value: next });
			setActive(next);
			rest.onClick?.(evt);
		};

		return (
			<Comp
				ref={ref}
				role="checkbox"
				data-active={active ? true : undefined}
				onClick={handleClick}
				className={cn(activatableVM({}), className)}
				{...rest}
			>
				{children}
			</Comp>
		);
	},
);

export default Activatable;
export type { ActivatableProps as Props };
