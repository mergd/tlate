import * as React from "react"
import { Select as BaseSelect } from "@base-ui-components/react/select"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const SelectGroup = BaseSelect.Group
SelectGroup.displayName = "SelectGroup"

const Select = <T,>(props: BaseSelect.Root.Props<T>) => (
	<BaseSelect.Root alignItemToTrigger={false} modal={false} {...props} />
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>(({ children, className, ...props }, ref) => (
	<BaseSelect.Trigger
		ref={ref}
		className={cn(
			"flex h-10 min-w-36 cursor-pointer items-center justify-between gap-3 rounded-md border border-input bg-background px-3.5 py-2 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground [&>span]:line-clamp-1",
			className
		)}
		{...props}
	>
		{children}
		<BaseSelect.Icon className="flex">
			<ChevronsUpDownIcon className="size-4 opacity-50" />
		</BaseSelect.Icon>
	</BaseSelect.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof BaseSelect.Value>
>(({ className, ...props }, ref) => (
	<BaseSelect.Value ref={ref} className={cn("text-sm", className)} {...props} />
))
SelectValue.displayName = "SelectValue"

interface SelectContentProps
	extends React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> {
	positionerProps?: BaseSelect.Positioner.Props
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
	({ children, className, positionerProps, ...props }, ref) => (
		<BaseSelect.Positioner
			sideOffset={8}
			{...positionerProps}
			className={cn("z-50 w-[--anchor-width]", positionerProps?.className)}
		>
			<BaseSelect.Popup
				ref={ref}
				className={cn(
					"relative z-50 max-h-[var(--available-height)] w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-md border bg-popover py-1 text-popover-foreground shadow-lg outline-none",
					"transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
					className
				)}
				{...props}
			>
				{children}
			</BaseSelect.Popup>
		</BaseSelect.Positioner>
	)
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof BaseSelect.Item>
>(({ children, className, ...props }, ref) => (
	<BaseSelect.Item
		ref={ref}
		className={cn(
			"relative grid cursor-default select-none grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1.5 pl-2.5 pr-4 text-sm outline-none",
			"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<div className="col-start-1 flex size-4 items-center justify-center">
			<BaseSelect.ItemIndicator>
				<CheckIcon className="size-3" />
			</BaseSelect.ItemIndicator>
		</div>
		<BaseSelect.ItemText className="col-start-2">
			{children}
		</BaseSelect.ItemText>
	</BaseSelect.Item>
))
SelectItem.displayName = "SelectItem"

const SelectGroupLabel = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => (
	<BaseSelect.GroupLabel
		ref={ref}
		className={cn(
			"px-2 py-1.5 text-sm font-medium text-muted-foreground",
			className
		)}
		{...props}
	/>
))
SelectGroupLabel.displayName = "SelectGroupLabel"

const SelectSeparator = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof BaseSelect.Separator>
>(({ className, ...props }, ref) => (
	<BaseSelect.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-muted", className)}
		{...props}
	/>
))
SelectSeparator.displayName = "SelectSeparator"

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectGroupLabel,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
}
