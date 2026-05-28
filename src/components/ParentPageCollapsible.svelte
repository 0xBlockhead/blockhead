<script lang="ts">
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { ComponentProps, Snippet } from 'svelte'


	// Context
	import type { ResolvedPathname } from '$app/types'

	import {
		getOnNestedCollapsibleClose,
		setOnNestedCollapsibleClose,
	} from '$/context/onNestedCollapsibleClose.ts'

	import { goto } from '$app/navigation'


	// State
	let {
		title,
		href,

		open = $bindable(true),
		ontoggle,

		Summary: _Summary,
		children: _children,

		...CollapsibleProps
	}: WithRest<
		{
			title?: string
			href?: ResolvedPathname

			open?: boolean
			ontoggle?: (e: Event) => void

			Summary?: Snippet<[{
				open?: boolean,
			}]>
			children?: Snippet
		},
		ComponentProps<typeof Collapsible>
	> = $props()


	// Inner context
	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()

	setOnNestedCollapsibleClose((collapsibleId?: string) => {
		if (href)
			goto(
				collapsibleId ?
					`${href.replace(/#.*$/, '')}#${encodeURIComponent(collapsibleId)}`
				:
					href
			)
	})


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Heading from '$/components/Heading.svelte'
</script>


<Collapsible
	bind:open
	{ontoggle}
	onclose={(id) => onNestedCollapsibleClose?.(id ?? undefined)}
	data-card
	data-column-item="flexible"
	{...CollapsibleProps}
>
	{#snippet Summary({ open: _open })}
		{#if _Summary}
			{@render _Summary({
				open: _open,
			})}
		{:else}
			<Heading>
				{#if href}
					<a
						data-link
						href={href}
					>{title ?? ''}</a>
				{:else}
					{title ?? ''}
				{/if}
			</Heading>
		{/if}
	{/snippet}

	{#snippet children({ open })}
		{#if _children}
			{@render _children()}
		{/if}
	{/snippet}
</Collapsible>
