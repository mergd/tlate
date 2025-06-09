import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define the previous variant types directly
type PreviousBadgeVariant =
	| "default"
	| "outline"
	| "secondary"
	| "success"
	| "warning"
	| "info"
	| "danger"

// Define previous indicator variant types directly
type PreviousIndicatorVariant = "success" | "warning" | "info" | "danger"

const badgeVariants = cva(
	"inline-flex items-center whitespace-nowrap font-medium rounded-full",
	{
		variants: {
			badgeStyle: {
				solid: "border",
				surface: "border",
				soft: "",
				outline: "bg-transparent",
			},
			badgeColor: {
				gray: "",
				primary: "",
				blue: "",
				green: "",
				yellow: "",
				purple: "",
				red: "",
			},
			size: {
				sm: "px-1.5 py-px text-xs gap-1",
				md: "px-2 py-0.5 text-xs gap-1.5",
				lg: "px-2.5 py-1 text-sm gap-1.5",
			},
		},
		compoundVariants: [
			{
				badgeStyle: "solid",
				badgeColor: "gray",
				className:
					"bg-gray-500 border-gray-500 text-white dark:bg-gray-600 dark:border-gray-600 dark:text-gray-100",
			},
			{
				badgeStyle: "solid",
				badgeColor: "primary",
				className: "bg-primary border-primary text-primary-foreground",
			},
			{
				badgeStyle: "solid",
				badgeColor: "blue",
				className:
					"bg-blue-500 border-blue-500 text-white dark:bg-blue-600 dark:border-blue-600 dark:text-blue-100",
			},
			{
				badgeStyle: "solid",
				badgeColor: "green",
				className:
					"bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600 dark:text-green-100",
			},
			{
				badgeStyle: "solid",
				badgeColor: "yellow",
				className:
					"bg-yellow-500 border-yellow-500 text-yellow-950 dark:bg-yellow-600 dark:border-yellow-600 dark:text-yellow-950",
			},
			{
				badgeStyle: "solid",
				badgeColor: "purple",
				className:
					"bg-purple-500 border-purple-500 text-white dark:bg-purple-600 dark:border-purple-600 dark:text-purple-100",
			},
			{
				badgeStyle: "solid",
				badgeColor: "red",
				className:
					"bg-red-500 border-red-500 text-white dark:bg-red-600 dark:border-red-600 dark:text-red-100",
			},
			{
				badgeStyle: "surface",
				badgeColor: "gray",
				className:
					"bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300",
			},
			{
				badgeStyle: "surface",
				badgeColor: "primary",
				className: "bg-primary/10 border-primary/20 text-primary",
			},
			{
				badgeStyle: "surface",
				badgeColor: "blue",
				className:
					"bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700/50 dark:text-blue-300",
			},
			{
				badgeStyle: "surface",
				badgeColor: "green",
				className:
					"bg-green-100 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700/50 dark:text-green-300",
			},
			{
				badgeStyle: "surface",
				badgeColor: "yellow",
				className:
					"bg-yellow-100 border-yellow-200 text-yellow-700 dark:bg-yellow-900/50 dark:border-yellow-700/50 dark:text-yellow-300",
			},
			{
				badgeStyle: "surface",
				badgeColor: "purple",
				className:
					"bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/50 dark:border-purple-700/50 dark:text-purple-300",
			},
			{
				badgeStyle: "surface",
				badgeColor: "red",
				className:
					"bg-red-100 border-red-200 text-red-700 dark:bg-red-900/50 dark:border-red-700/50 dark:text-red-300",
			},
			{
				badgeStyle: "soft",
				badgeColor: "gray",
				className:
					"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
			},
			{
				badgeStyle: "soft",
				badgeColor: "primary",
				className: "bg-primary/10 text-primary",
			},
			{
				badgeStyle: "soft",
				badgeColor: "blue",
				className:
					"bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
			},
			{
				badgeStyle: "soft",
				badgeColor: "green",
				className:
					"bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
			},
			{
				badgeStyle: "soft",
				badgeColor: "yellow",
				className:
					"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
			},
			{
				badgeStyle: "soft",
				badgeColor: "purple",
				className:
					"bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
			},
			{
				badgeStyle: "soft",
				badgeColor: "red",
				className:
					"bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
			},
			{
				badgeStyle: "outline",
				badgeColor: "gray",
				className:
					"text-gray-700 ring-1 ring-inset ring-gray-200 dark:text-gray-300 dark:ring-gray-800",
			},
			{
				badgeStyle: "outline",
				badgeColor: "primary",
				className: "text-primary ring-1 ring-inset ring-primary/30",
			},
			{
				badgeStyle: "outline",
				badgeColor: "blue",
				className:
					"text-blue-700 ring-1 ring-inset ring-blue-200 dark:text-blue-300 dark:ring-blue-800",
			},
			{
				badgeStyle: "outline",
				badgeColor: "green",
				className:
					"text-green-700 ring-1 ring-inset ring-green-200 dark:text-green-300 dark:ring-green-800",
			},
			{
				badgeStyle: "outline",
				badgeColor: "yellow",
				className:
					"text-yellow-700 ring-1 ring-inset ring-yellow-200 dark:text-yellow-300 dark:ring-yellow-800",
			},
			{
				badgeStyle: "outline",
				badgeColor: "purple",
				className:
					"text-purple-700 ring-1 ring-inset ring-purple-200 dark:text-purple-300 dark:ring-purple-800",
			},
			{
				badgeStyle: "outline",
				badgeColor: "red",
				className:
					"text-red-700 ring-1 ring-inset ring-red-200 dark:text-red-300 dark:ring-red-800",
			},
		],
		defaultVariants: {
			badgeStyle: "soft",
			badgeColor: "primary",
			size: "md",
		},
	}
)

export interface BadgeProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "color">,
		VariantProps<typeof badgeVariants> {
	variant?: PreviousBadgeVariant
}

const Badge = ({
	className,
	badgeStyle,
	badgeColor,
	size,
	variant,
	...props
}: BadgeProps) => {
	let finalBadgeStyle = badgeStyle
	let finalBadgeColor = badgeColor

	if (variant && badgeStyle === undefined && badgeColor === undefined) {
		switch (variant) {
			case "default":
				finalBadgeStyle = "solid"
				finalBadgeColor = "primary"
				break
			case "outline":
				finalBadgeStyle = "outline"
				finalBadgeColor = "primary"
				break
			case "secondary":
				finalBadgeStyle = "soft"
				finalBadgeColor = "gray"
				break
			case "success":
				finalBadgeStyle = "soft"
				finalBadgeColor = "green"
				break
			case "warning":
				finalBadgeStyle = "soft"
				finalBadgeColor = "yellow"
				break
			case "info":
				finalBadgeStyle = "soft"
				finalBadgeColor = "blue"
				break
			case "danger":
				finalBadgeStyle = "soft"
				finalBadgeColor = "red"
				break
		}
	}

	return (
		<div
			className={cn(
				badgeVariants({
					badgeStyle: finalBadgeStyle,
					badgeColor: finalBadgeColor,
					size,
				}),
				className
			)}
			{...props}
		/>
	)
}

const badgeIndicatorVariants = cva("rounded-full size-1.5", {
	variants: {
		badgeColor: {
			gray: "bg-gray-500",
			primary: "bg-primary",
			blue: "bg-blue-500",
			green: "bg-green-500",
			yellow: "bg-yellow-500",
			purple: "bg-purple-500",
			red: "bg-red-500",
		},
	},
	defaultVariants: {
		badgeColor: "primary",
	},
})

export interface BadgeIndicatorProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
		VariantProps<typeof badgeIndicatorVariants> {
	variant?: PreviousIndicatorVariant
}

const BadgeIndicator = ({
	className,
	badgeColor,
	variant,
	...props
}: BadgeIndicatorProps) => {
	let finalBadgeColor = badgeColor

	if (variant && badgeColor === undefined) {
		switch (variant) {
			case "success":
				finalBadgeColor = "green"
				break
			case "warning":
				finalBadgeColor = "yellow"
				break
			case "info":
				finalBadgeColor = "blue"
				break
			case "danger":
				finalBadgeColor = "red"
				break
		}
	}

	return (
		<span
			className={cn(
				badgeIndicatorVariants({ badgeColor: finalBadgeColor }),
				className
			)}
			{...props}
		/>
	)
}

export { Badge, badgeVariants, BadgeIndicator, badgeIndicatorVariants }
