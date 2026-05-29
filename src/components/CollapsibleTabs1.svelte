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
			scrollContainerProps?: SvelteHTMLElements['div']
		},
		SvelteHTMLElements['details']
	> = $props()


	// State
	incrementHeadingLevel()
</script>


<section
	data-column-item="flexible basis-4"
	data-column
>
	<details
		bind:open
		ontoggle={(e) => {
			if (!e.currentTarget.open && onclose) {
				setTimeout(() => onclose(detailsProps.id ?? undefined), 300)
			}
			ontoggle?.(e)
		}}
		data-column-item="flexible"
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
						data-scroll-container="layout-carousel"
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
				data-collapsible-tabs-pane-host
				data-scroll-container="layout-carousel"
				data-row="align-start"
			>
				{@render body({
					open,
				})}
			</div>
		{/if}
	</details>
</section>



<style>
	[data-carousel-markers] {
		&[data-scroll-container~="layout-carousel"] {
			height: 2rem;
			--carousel-basis: 6rem;
		}
	}
</style>
