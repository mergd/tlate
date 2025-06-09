"use client"

import * as React from "react"
import { mergeProps } from "@base-ui-components/react"
import { useRender } from "@base-ui-components/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-200 outline-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 disabled:pointer-events-none disabled:opacity-70 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/80",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
				outline:
					"border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
				link: "text-foreground hover:underline",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/80",
				success: "bg-success text-success-foreground hover:bg-success/80",
				retro:
					"relative isolate inline-flex items-center justify-center overflow-hidden rounded-md font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] \
					shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.black/0.2)] dark:shadow-[0_1px_theme(colors.white/0.05)_inset,0_1px_3px_theme(colors.black/0.4)] \
					before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:from-white/20 dark:before:from-white/10 before:opacity-50 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] \
					after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:from-white/10 dark:after:from-white/5 after:from-[46%] after:to-[54%] after:mix-blend-overlay \
					bg-neutral-200 text-neutral-900 ring-1 ring-black/5 hover:before:opacity-100 active:brightness-95 active:shadow-[0_1px_theme(colors.black/0.05)_inset] \
					dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/10 dark:active:shadow-[0_1px_theme(colors.black/0.2)_inset]",
			},
			size: {
				sm: "h-8 px-2.5 text-sm",
				md: "h-9 px-3 text-base",
				lg: "h-10 px-3.5 text-base",
				"icon-sm": "size-8 text-sm [&>svg]:size-4",
				icon: "size-9 text-base [&>svg]:size-4",
				"icon-lg": "size-10 text-base [&>svg]:size-5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "lg",
		},
	}
)

export interface ButtonProps
	extends VariantProps<typeof buttonVariants>,
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		useRender.ComponentProps<"button"> {}

/**
 * @deprecated Use the `render` prop instead for customizing the underlying element.
 */
export interface ButtonProps {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			render = <button />,
			children,
			disabled,
			// @deprecated Use the `render` prop instead for customizing the underlying element
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			asChild,
			...props
		},
		ref
	) => {
		const defaultProps: useRender.ElementProps<"button"> = {
			className: cn(buttonVariants({ variant, size, className })),
			ref: ref,
			disabled: disabled,
		}

		const { renderElement } = useRender({
			render,
			props: mergeProps<"button">(defaultProps, props, { children }),
		})

		return renderElement()
	}
)
Button.displayName = "Button"

export { Button, buttonVariants }
