<script lang="ts">
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { ComponentProps } from 'svelte'
	import type { Snippet } from 'svelte'


	// State
	let {
		sectionIdPrefix,
		sections,

		Summary,
		Toolbar,
		Annotation,

		...collapsibleTabsProps
	}: WithRest<
		{
			sectionIdPrefix: string
			sections: CollapsibleTabs2Section[]

			Summary?: Snippet<[context?: {
				open?: boolean,
			}]>
			Toolbar?: Snippet<[context?: {
				open?: boolean,
			}]>
			Annotation?: Snippet<[context?: {
				open?: boolean,
			}]>
		},
		Omit<
			ComponentProps<typeof CollapsibleTabs1>,
			'Markers' | 'body' | 'Summary' | 'Toolbar' | 'Annotation'
		>
	> = $props()


	// Functions
	const sectionAnchorId = (sectionId: string) => (
		`${sectionIdPrefix}:${sectionId}`
	)


	// State
	export type CollapsibleTabs2SectionContentProps = {
		id: string
		label: string
	}

	export type CollapsibleTabs2Section = {
		id: string
		label: string
		Content: Snippet<[CollapsibleTabs2SectionContentProps]>
	}


	// Components
	import CollapsibleTabs1 from '$/components/CollapsibleTabs1.svelte'
</script>


<CollapsibleTabs1
	{...collapsibleTabsProps}
	{Summary}
	{Toolbar}
	{Annotation}
>
	{#snippet Markers({ open: _markersOpen })}
		{#each sections as section (section.id)}
			<a
				data-scroll-marker-label={section.label}
				href={`#${sectionAnchorId(section.id)}`}
			>{section.label}</a>
		{/each}
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#each sections as section (section.id)}
			<section id={sectionAnchorId(section.id)}>
				{@render section.Content({
					id: sectionAnchorId(section.id),
					label: section.label,
				})}
			</section>
		{/each}
	{/snippet}
</CollapsibleTabs1>
