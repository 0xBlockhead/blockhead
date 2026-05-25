<script lang="ts">
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { Snippet } from 'svelte'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { incrementHeadingLevel } from '$/context/headingLevel.ts'


	// Props
	let {
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
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


	// State
	incrementHeadingLevel()
</script>


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
			data-column="layout-flex"
			data-sticky-container
		>
			{@render children({
				open,
			})}
		</div>
	{/if}
</details>
