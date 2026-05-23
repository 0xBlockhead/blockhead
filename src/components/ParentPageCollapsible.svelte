<script lang="ts">
	// Types/constants
	import type { ResolvedPathname } from '$app/types'


	// Context
	import {
		getOnNestedCollapsibleClose,
		setOnNestedCollapsibleClose,
	} from '$/context/onNestedCollapsibleClose.ts'

	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()


	// Props
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { ComponentProps, Snippet } from 'svelte'

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

			Summary?: Snippet<[context?: {
				open?: boolean,
			}]>
			children?: Snippet<[context?: {
				open?: boolean,
			}]>
		},
		ComponentProps<typeof Collapsible>
	> = $props()


	// Inner context
	import { goto } from '$app/navigation'

	setOnNestedCollapsibleClose((collapsibleId?: string) => {
		if(href)
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
	onclose={id => onNestedCollapsibleClose?.(id ?? undefined)}
	data-card
	{...CollapsibleProps}
>
	{#snippet Summary({
		open,
	})}
		{#if _Summary}
			{@render _Summary({
				open,
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

	{#snippet children({
		open,
	})}
		{#if _children}
			{@render _children({
				open,
			})}
		{/if}
	{/snippet}
</Collapsible>
