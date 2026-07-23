<script module lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	export type CollapsibleTabsSectionContentProps = {
		id: string
		label: string
		open?: boolean
		active?: boolean
	}

	export type CollapsibleTabsSectionSnippet = Snippet<[
		CollapsibleTabsSectionContentProps,
	]>
	export type CollapsibleTabsMarkerSnippet = Snippet<[
		CollapsibleTabsSectionContentProps,
		Content: Snippet,
	]>


	export type CollapsibleTabsSectionRow<SectionId extends string = string> = {
		id: SectionId
		label: string
		description?: string
		ownsSection?: boolean
	}


	export type CollapsibleTabsSectionIds<
		Sections extends readonly CollapsibleTabsSectionRow[],
	> = Sections[number]['id']

	export type CollapsibleTabsSectionSnippets = {
		[SectionSnippetKey in `Section${string}`]?: CollapsibleTabsSectionSnippet
	} & {
		[MarkerSnippetKey in `Marker${string}`]?: CollapsibleTabsMarkerSnippet
	}

	export type CollapsibleTabsOwnProps<
		Sections extends readonly CollapsibleTabsSectionRow[],
	> = {
		sectionIdPrefix: string
		sections: Sections
		initialSection?: CollapsibleTabsSectionIds<Sections> | string

		Summary?: Snippet<[context: {
			open?: boolean,
		}]>
		Toolbar?: Snippet<[context: {
			open?: boolean,
		}]>
		Annotation?: Snippet<[context: {
			open?: boolean,
		}]>
	} & CollapsibleTabsSectionSnippets


	export const collapsibleTabsSections = <
		const Sections extends readonly CollapsibleTabsSectionRow[],
	>(
		sections: Sections,
	) => sections


	const kebabToPascalCase = (segment: string) => (
		segment
			.split('-')
			.map((part) => (
				part.charAt(0).toUpperCase() + part.slice(1)
			))
			.join('')
	)

	export const sectionSnippetName = (
		sectionId: string,
	): `Section${string}` => (
		`Section${kebabToPascalCase(sectionId)}`
	)
</script>


<script
	lang="ts"
	generics="Sections extends readonly CollapsibleTabsSectionRow[]"
>
	// Types/constants
	import type { SvelteHTMLElements } from 'svelte/elements'


	type CollapsibleTabsForwardedProps = {
		id?: SvelteHTMLElements['details']['id']
		class?: SvelteHTMLElements['details']['class']
		'data-card'?: boolean
		open?: boolean
		ontoggle?: (e: Event) => void
		onclose?: (id?: string) => void
	}


	// State
	let {
		sectionIdPrefix,
		sections,
		initialSection,

		Summary,
		Toolbar,
		Annotation,

		id,
		class: className,
		'data-card': dataCard,
		open,
		ontoggle,
		onclose,

		...collapsibleTabsSectionSnippets
	}: CollapsibleTabsOwnProps<Sections> & CollapsibleTabsForwardedProps = $props()

	let selectedSectionId = $state<CollapsibleTabsSectionIds<Sections>>()
	let activeSectionId = $derived<CollapsibleTabsSectionIds<Sections> | string | undefined>(
		selectedSectionId ?? initialSection ?? (sections[0].ownsSection ? undefined : sections[0].id),
	)


	// Functions
	const sectionAnchorId = (
		sectionId: CollapsibleTabsSectionIds<Sections>,
	) => (
		`${sectionIdPrefix}:${sectionId}`
	)

	const sectionSnippetForSection = (
		section: Sections[number],
	): CollapsibleTabsSectionSnippet => {
		const Section = collapsibleTabsSectionSnippets[sectionSnippetName(section.id)]
		if (Section === undefined)
			throw new Error(`CollapsibleTabs section ${section.id} has no content snippet`)

		return Section
	}

	const markerSnippetForSection = (
		section: Sections[number],
	): CollapsibleTabsMarkerSnippet | undefined => (
		collapsibleTabsSectionSnippets[`Marker${sectionSnippetName(section.id).slice('Section'.length)}`]
	)


	// Components
	import CollapsibleTabs1 from '$/components/CollapsibleTabs1.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<CollapsibleTabs1
	{id}
	class={className}
	data-card={dataCard}
	{open}
	{ontoggle}
	{onclose}
	{Summary}
	{Toolbar}
	{Annotation}
>
	{#snippet Markers(_markersContext)}
		{#each sections as section (section.id)}
			{@const Marker = markerSnippetForSection(section)}
			{#snippet MarkerContent()}
			{#if section.description}
				<Tooltip contentProps={{ side: 'top' }}>
					{#snippet Content()}
						<p>{section.description}</p>
					{/snippet}

					<a
						id={`${sectionAnchorId(section.id)}:marker`}
						aria-controls={sectionAnchorId(section.id)}
						aria-current={section.id === activeSectionId ? 'location' : undefined}
						data-scroll-marker-label={section.label}
						data-active={section.id === activeSectionId}
						href={`#${sectionAnchorId(section.id)}`}
						onclick={() => {
							selectedSectionId = section.id
						}}
					>{section.label}</a>
				</Tooltip>
			{:else}
				<a
					id={`${sectionAnchorId(section.id)}:marker`}
					aria-controls={sectionAnchorId(section.id)}
					aria-current={section.id === activeSectionId ? 'location' : undefined}
					data-scroll-marker-label={section.label}
					data-active={section.id === activeSectionId}
					href={`#${sectionAnchorId(section.id)}`}
					onclick={() => {
						selectedSectionId = section.id
					}}
				>{section.label}</a>
			{/if}
			{/snippet}
			{#if Marker}
				{@render Marker(
					{
						id: sectionAnchorId(section.id),
						label: section.label,
						open: true,
						active: section.id === activeSectionId,
					},
					MarkerContent,
				)}
			{:else}
				{@render MarkerContent()}
			{/if}
		{/each}
	{/snippet}

	{#snippet body(_bodyContext)}
		{#each sections as section (section.id)}
			{@const Section = sectionSnippetForSection(section)}
			{#if section.ownsSection}
				{@render Section({
					id: sectionAnchorId(section.id),
					label: section.label,
					open: true,
					active: section.id === activeSectionId,
				})}
			{:else}
			<section
				id={sectionAnchorId(section.id)}
				aria-labelledby={`${sectionAnchorId(section.id)}:marker`}
				data-scroll-marker-label={section.label}
				data-column-item="flexible"
				data-column
				data-active={section.id === activeSectionId}
			>
				{@render Section(
					{
						id: sectionAnchorId(section.id),
						label: section.label,
						open: true,
					},
				)}
			</section>
			{/if}
		{/each}
	{/snippet}
</CollapsibleTabs1>
