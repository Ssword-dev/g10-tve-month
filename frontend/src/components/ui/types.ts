import type {
  ClassInput,
  cvm,
  InferVariantProps,
  VariantManager,
} from "@_ssword/classes";
import React from "react";

type RefType<T> =
  T extends React.ForwardRefExoticComponent<{ ref: React.Ref<infer R> }>
    ? R
    : T extends React.FC<unknown>
      ? unknown
      : T extends keyof HTMLElementTagNameMap
        ? HTMLElementTagNameMap[T]
        : never;

type Props<T extends React.ElementType> = Omit<
  React.ComponentPropsWithoutRef<T>,
  "className"
>;

type PropType<T extends React.ElementType> = Props<T>;

type VariantProps<V extends VariantManager> = InferVariantProps<V>;

interface AsChildProps {
  asChild?: boolean;
}

interface ClassProps {
  className?: ClassInput;
}

type WithClass<T> = T & { className?: string | undefined };
type WithVariants<T, V extends ReturnType<typeof cvm>> = T &
  InferVariantProps<V>;
type WithAsChild<T> = T & { asChild?: boolean | undefined };

export type {
  AsChildProps,
  ClassProps,
  PropType,
  Props,
  RefType,
  VariantProps,
  WithAsChild,
  WithClass,
  WithVariants,
};
