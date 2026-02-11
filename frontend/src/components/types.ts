import type { ClassInput, cvm, InferVariantProps, VariantManager } from '@_ssword/classes';
import React from 'react';

type RefType<T> =
	T extends React.ForwardRefExoticComponent<{ ref: React.Ref<infer R> }>
		? R
		: T extends React.FC<unknown>
			? unknown
			: T extends keyof HTMLElementTagNameMap
				? HTMLElementTagNameMap[T]
				: never;

type Props<T> = T extends keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<object>
	? React.PropsWithoutRef<Omit<React.ComponentProps<T>, 'className'>>
	: never;

type PropType<T> = Props<T>; // backwards compatible.

/**
 * infers the static props for a given variant manager.
 */
type VariantProps<V extends VariantManager> = InferVariantProps<V>;

interface AsChildProps {
	/**
	 * renders the component as a child of another component instead of the default element.
	 *
	 * this pattern is inspired by shadcn/ui's `asChild` pattern.
	 *
	 * @see https://ui.shadcn.com/docs shadcn/ui docs
	 * @see https://github.com/shadcn/ui shadcn/ui github
	 */
	asChild?: boolean;
}

interface ClassProps {
	/**
	 * classes to be merged
	 * with the component's classes.
	 * You may use this to override styling.
	 *
	 * This may be anything that could be
	 * interpreted as classes
	 * and yes, this includes arrays of
	 * other class inputs,
	 * objects (conditional classes),
	 * and strings, and other primitives.
	 *
	 * The className props is omitted from the
	 * base component's properties to allow any
	 * class input to be used instead.
	 * @see clsx
	 */
	className?: ClassInput;
}

type WithClass<T> = T & { className?: string | undefined };

type WithVariants<T, V extends ReturnType<typeof cvm>> = T & InferVariantProps<V>;

type WithAsChild<T> = T & { asChild?: boolean | undefined };

export type {
	Props,
	AsChildProps,
	ClassProps,
	VariantProps,
	RefType,
	PropType,
	WithAsChild,
	WithClass,
	WithVariants,
};
