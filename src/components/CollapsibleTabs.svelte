<script module lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	export type CollapsibleTabsSectionContentProps = {
		id: string
		label: string
		open?: boolean
	}

	export type CollapsibleTabsSectionSnippet = Snippet<[
		CollapsibleTabsSectionContentProps,
	]>


	export type CollapsibleTabsSectionRow<SectionId extends string = string> = {
		id: SectionId
		label: string
		description?: string
	}


	export type CollapsibleTabsSectionIds<
		Sections extends readonly CollapsibleTabsSectionRow[],
	> = Sections[number]['id']

	export type CollapsibleTabsSectionSnippets = {
		[SectionSnippetKey in `Section${string}`]?: CollapsibleTabsSectionSnippet
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
		scrollContainerProps?: SvelteHTMLElements['div']
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
		scrollContainerProps,

		...collapsibleTabsSectionSnippets
	}: CollapsibleTabsOwnProps<Sections> & CollapsibleTabsForwardedProps = $props()

	let selectedSectionId = $state<CollapsibleTabsSectionIds<Sections>>()
	let activeSectionId = $derived<CollapsibleTabsSectionIds<Sections> | string>(
		selectedSectionId ?? initialSection ?? sections[0].id,
	)


	// Functions
	const sectionAnchorId = (
		sectionId: CollapsibleTabsSectionIds<Sections>,
	) => (
		`${sectionIdPrefix}:${sectionId}`
	)

	const sectionSnippetForSection = (
		section: Sections[number],
	): CollapsibleTabsSectionSnippet | undefined => (
		collapsibleTabsSectionSnippets[sectionSnippetName(section.id)]
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
	{scrollContainerProps}
	{Summary}
	{Toolbar}
	{Annotation}
>
	{#snippet Markers(_markersContext)}
		{#each sections as section (section.id)}
			{#if section.description}
				<Tooltip contentProps={{ side: 'top' }}>
					{#snippet Content()}
						<p>{section.description}</p>
					{/snippet}

					<a
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
					data-scroll-marker-label={section.label}
					data-active={section.id === activeSectionId}
					href={`#${sectionAnchorId(section.id)}`}
					onclick={() => {
						selectedSectionId = section.id
					}}
				>{section.label}</a>
			{/if}
		{/each}
	{/snippet}

	{#snippet body(_bodyContext)}
		{#each sections as section (section.id)}
			{@const Section = sectionSnippetForSection(section)}
			<section
				id={sectionAnchorId(section.id)}
				data-active={section.id === activeSectionId}
			>
				{#if Section}
					{@render Section(
						{
							id: sectionAnchorId(section.id),
							label: section.label,
							open: section.id === activeSectionId,
						},
					)}
				{/if}
			</section>
		{/each}
	{/snippet}
</CollapsibleTabs1>
