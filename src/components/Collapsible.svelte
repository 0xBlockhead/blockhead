<script lang="ts">
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { Snippet } from 'svelte'
	import { onDestroy } from 'svelte'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { incrementHeadingLevel } from '$/context/headingLevel.ts'


	// State
	let {
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		canToggle = true,
		ontoggle,
		onclose,

		Summary,
		Toolbar,
		Annotation,
		children,

		...detailsProps
	}: WithRest<
		{
			open?: boolean
			canToggle?: boolean
			ontoggle?: (e: Event) => void
			onclose?: (id?: string) => void
			Annotation?: Snippet<[{
				open?: boolean,
			}]>
			Toolbar?: Snippet<[{
				open?: boolean,
			}]>
			Summary?: Snippet<[{
				open?: boolean,
			}]>
			children?: Snippet<[{
				open?: boolean,
			}]>
		},
		SvelteHTMLElements['details']
	> = $props()


	// Inner context
	incrementHeadingLevel()
	let closeTimeout: ReturnType<typeof setTimeout> | undefined

	const cancelClose = () => {
		if (closeTimeout !== undefined) {
			clearTimeout(closeTimeout)
			closeTimeout = undefined
		}
	}

	onDestroy(cancelClose)
</script>


<details
	bind:open
	ontoggle={(e) => {
		if (e.currentTarget.open) {
			cancelClose()
		} else if (onclose) {
			cancelClose()
			closeTimeout = setTimeout(() => {
				closeTimeout = undefined
				if (!open) onclose(detailsProps.id ?? undefined)
			}, 300)
		}
		ontoggle?.(e)
	}}
	data-can-toggle={canToggle ? undefined : 'false'}
	data-scroll-container="block snap-block"
	{...detailsProps}
>
	<summary
		data-sticky
		onclick={(e) => {
			if (!canToggle) {
				e.preventDefault()
				e.stopPropagation()
			}
		}}
		onkeydown={(e) => {
			if (!canToggle && (e.key === 'Enter' || e.key === ' ')) {
				e.preventDefault()
				e.stopPropagation()
			}
		}}
	>
		<div
			data-row-item="flexible"
			data-row="align-center wrap wrap-first-last"
		>
			{#if Summary}
				{@render Summary({
					open,
				})}
			{/if}

			{#if Toolbar || Annotation}
				<div data-row="wrap">
					{#if Toolbar}
						{@render Toolbar({
							open,
						})}
					{/if}

					{#if Annotation}
						{@render Annotation({
							open,
						})}
					{/if}
				</div>
			{/if}
		</div>
	</summary>

	{#if children && open}
		<div
			data-column-item="flexible"
			data-column="gap-3"
			data-sticky-container
		>
			{@render children({
				open,
			})}
		</div>
	{/if}
</details>


<style>
	details[data-can-toggle='false'] {
		> summary {
			cursor: default;

			&::after {
				display: none;
			}

			&::-webkit-details-marker {
				display: none;
			}
		}
	}
</style>
