"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn, cvm } from "@_ssword/classes";
import type { AsChildProps, ClassProps, Props, RefType, VariantProps } from "./types";

const terminalBase = "div";
type TerminalComponentBase = typeof terminalBase;
const terminalVM = cvm("", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface TerminalProps
  extends
    Props<TerminalComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof terminalVM> {}
const Terminal = forwardRef<RefType<TerminalComponentBase>, TerminalProps>(
  (props: TerminalProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : terminalBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(terminalVM({}), className)}
      >
        {props.children}
      </Comp>
    );
  },
);

const terminalHeaderBase = "div";
type TerminalHeaderComponentBase = typeof terminalHeaderBase;
const terminalHeaderVM = cvm("flex flex-row gap-2 px-2 py-3 bg-card rounded-t-md", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface TerminalHeaderProps
  extends
    Omit<Props<TerminalHeaderComponentBase>, "children">,
    ClassProps,
    AsChildProps,
    VariantProps<typeof terminalHeaderVM> {}
const TerminalHeader = forwardRef<RefType<TerminalHeaderComponentBase>, TerminalHeaderProps>(
  (props: TerminalHeaderProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : terminalHeaderBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(terminalHeaderVM({}), className)}
      >
        <div className="w-4 aspect-square bg-accent rounded-full" />
        <div className="w-4 aspect-square bg-secondary rounded-full" />
        <div className="w-4 aspect-square bg-primary rounded-full" />
      </Comp>
    );
  },
);

const terminalInterfaceBase = "div";
type TerminalInterfaceComponentBase = typeof terminalInterfaceBase;
const terminalInterfaceVM = cvm("px-2 py-1 bg-card/70 font-mono", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface TerminalInterfaceProps
  extends
    Props<TerminalInterfaceComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof terminalInterfaceVM> {}
const TerminalInterface = forwardRef<RefType<TerminalInterfaceComponentBase>, TerminalInterfaceProps>(
  (props: TerminalInterfaceProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : terminalInterfaceBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(terminalInterfaceVM({}), className)}
      >
        {props.children}
      </Comp>
    );
  },
);

const terminalLineBase = "span";
type TerminalLineComponentBase = typeof terminalLineBase;
const terminalLineVM = cvm("inline-flex flex-row break-words", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface TerminalLineProps
  extends
    Props<TerminalLineComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof terminalLineVM> {}
const TerminalLine = forwardRef<RefType<TerminalLineComponentBase>, TerminalLineProps>(
  (props: TerminalLineProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : terminalLineBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(terminalLineVM({}), className)}
      >
        {props.children}
      </Comp>
    );
  },
);

const terminalOutputBase = "span";
type TerminalOutputComponentBase = typeof terminalOutputBase;
const terminalOutputVM = cvm("inline-flex flex-row font-mono text-foreground", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface TerminalOutputProps
  extends
    Props<TerminalOutputComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof terminalOutputVM> {}
const TerminalOutput = forwardRef<RefType<TerminalOutputComponentBase>, TerminalOutputProps>(
  (props: TerminalOutputProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : terminalOutputBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(terminalOutputVM({}), className)}
      >
        {props.children}
      </Comp>
    );
  },
);

const terminalPromptBase = "span";
type TerminalPromptComponentBase = typeof terminalPromptBase;
const terminalPromptVM = cvm("inline-flex flex-row select-none whitespace-nowrap", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface TerminalPromptProps
  extends
    Props<TerminalPromptComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof terminalPromptVM> {}
const TerminalPrompt = forwardRef<RefType<TerminalPromptComponentBase>, TerminalPromptProps>(
  (props: TerminalPromptProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : terminalPromptBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(terminalPromptVM({}), className)}
      >
        {props.children}
      </Comp>
    );
  },
);

const terminalInputBase = "div";
type TerminalInputComponentBase = typeof terminalInputBase;
const terminalInputVM = cvm("inline-flex flex-row text-wrap", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface TerminalInputProps
  extends
    Props<TerminalInputComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof terminalInputVM> {}
const TerminalInput = forwardRef<RefType<TerminalInputComponentBase>, TerminalInputProps>(
  (props: TerminalInputProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : terminalInputBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(terminalInputVM({}), className)}
      >
        {props.children}
      </Comp>
    );
  },
);

export {
  Terminal,
  TerminalHeader,
  TerminalInput,
  TerminalInterface,
  TerminalLine,
  TerminalOutput,
  TerminalPrompt,
};
