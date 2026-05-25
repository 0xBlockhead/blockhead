<script lang="ts">
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { Snippet } from 'svelte'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { incrementHeadingLevel } from '$/context/headingLevel.ts'


	// State
	let {
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		ontoggle,
		onclose,

		Summary,
		Markers,
		Toolbar,
		Annotation,
		body,

		scrollContainerProps = {},

		...detailsProps
	}: WithRest<
		{
			open?: boolean
			ontoggle?: (e: Event) => void
			onclose?: (id?: string) => void

			Annotation?: Snippet<[context?: {
				open?: boolean,
			}]>
			Toolbar?: Snippet<[context?: {
				open?: boolean,
			}]>
			Summary?: Snippet<[context?: {
				open?: boolean,
			}]>
			Markers?: Snippet<[context?: {
				open?: boolean,
			}]>
			body?: Snippet<[context?: {
				open?: boolean,
			}]>
			scrollContainerProps?: Record<string, unknown>
		},
		SvelteHTMLElements['details']
	> = $props()


	// State
	incrementHeadingLevel()


	const collapsibleTabsPaneScrollContainer = $derived(
		typeof scrollContainerProps['data-scroll-container'] === 'string' ?
			scrollContainerProps['data-scroll-container']
		:
			'inline layout-carousel'
	)

	const collapsibleTabsPaneCarouselChrome = $derived(
		collapsibleTabsPaneScrollContainer.includes('layout-carousel')
	)

	const collapsibleTabsPaneSpreadRest = $derived.by(() => {
		const spread = { ...scrollContainerProps }
		delete spread.class
		delete spread.style
		delete spread['data-scroll-container']
		return spread
	})

	const collapsibleTabsPaneClassMerged = $derived(
		[
			...(collapsibleTabsPaneCarouselChrome ?
				['carousel']
			:
				[]),
			typeof scrollContainerProps.class === 'string' ?
				scrollContainerProps.class
			:
				'',
		]
			.filter(Boolean)
			.join(' ')
	)

	const collapsibleTabsPaneStyleMerged = $derived(
		[
			typeof scrollContainerProps.style === 'string' ?
				scrollContainerProps.style
			:
				'',
			...(collapsibleTabsPaneCarouselChrome ?
				['scroll-marker-group: none']
			:
				[]),
		]
			.filter(Boolean)
			.join('; ')
	)
</script>


<!--
	DOM markers: `[data-carousel-markers]` (`scroll-target-group` + `#…` links). Tab-strip styling: `details:has([data-collapsible-tabs-pane-host]) [data-carousel-markers]` in components.css.
-->
<details
	bind:open
	ontoggle={(e) => {
		if (!e.currentTarget.open && onclose) {
			setTimeout(() => onclose(detailsProps.id ?? undefined), 300)
		}
		ontoggle?.(e)
	}}
	data-scroll-container="block snap-block"
	{...detailsProps}
>
	<summary data-sticky>
		<div data-row="align-center gap-4">
			{#if Summary}
				<div data-row-item="wrap-start">
					{@render Summary({
						open,
					})}
				</div>
			{/if}

			{#if Markers}
				<div
					data-carousel-markers
					data-row-item="flexible"
				>
					{@render Markers({
						open,
					})}
				</div>
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

	{#if body && open}
		<div
			data-column-item="flexible"
			data-column="layout-flex"
			data-sticky-container
		>
			<div
				data-collapsible-tabs-pane-host=""
				{...collapsibleTabsPaneSpreadRest}
				class={collapsibleTabsPaneClassMerged}
				data-scroll-container={collapsibleTabsPaneScrollContainer}
				style={collapsibleTabsPaneStyleMerged}
			>
				{@render body({
					open,
				})}
			</div>
		</div>
	{/if}
</details>
