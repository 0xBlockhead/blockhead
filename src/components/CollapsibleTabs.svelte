<script lang="ts" module>
	// Types/constants
	import type { Snippet } from 'svelte'


	export type CollapsibleTabsSectionContentProps = {
		id: string
		label: string
	}

	export type CollapsibleTabsSectionSnippet = Snippet<[
		CollapsibleTabsSectionContentProps,
	]>


	export type CollapsibleTabsSectionRow<SectionId extends string = string> = {
		id: SectionId
		label: string
	}


	export type CollapsibleTabsSectionIds<
		Sections extends readonly CollapsibleTabsSectionRow[],
	> = Sections[number]['id']

	export type CollapsibleTabsLiteralSections<
		Sections extends readonly CollapsibleTabsSectionRow[],
	> = (
		string extends CollapsibleTabsSectionIds<Sections> ?
			never
		:
			Sections
	)


	type KebabToPascalCase<Segment extends string> = (
		Segment extends `${infer Head}-${infer Tail}` ?
			`${Capitalize<Head>}${KebabToPascalCase<Tail>}`
		:
			Capitalize<Segment>
	)

	export type SectionSnippetName<SectionId extends string> = (
		`Section${KebabToPascalCase<SectionId>}`
	)

		export type CollapsibleTabsSectionSnippets = {
			[SectionSnippetKey in `Section${string}`]?: CollapsibleTabsSectionSnippet
		}

	export type CollapsibleTabsOwnProps<
		Sections extends readonly CollapsibleTabsSectionRow[],
	> = {
		sectionIdPrefix: string
		sections: CollapsibleTabsLiteralSections<Sections>

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
	generics="const Sections extends readonly CollapsibleTabsSectionRow[]"
>
	// Types/constants
		import type { WithRest } from '$/typescript/WithRest.ts'
		import type { SvelteHTMLElements } from 'svelte/elements'


	type CollapsibleTabsForwardedProps = WithRest<
		{
			open?: boolean
			ontoggle?: (e: Event) => void
			onclose?: (id?: string) => void
			scrollContainerProps?: SvelteHTMLElements['div']
		},
		SvelteHTMLElements['details']
	>


	// State
	let {
		sectionIdPrefix,
		sections,

		Summary,
		Toolbar,
		Annotation,

		...collapsibleTabsAndSectionSnippets
	}: WithRest<
		CollapsibleTabsOwnProps<Sections>,
		CollapsibleTabsForwardedProps
	> = $props()


	// Functions
	const sectionSnippetPropPrefix = 'Section'

	const isSectionSnippetProp = (
		propKey: string,
	) => (
		propKey.startsWith(sectionSnippetPropPrefix)
	)

		const collapsibleTabsProps = (
			Object.fromEntries(
				Object
					.entries(collapsibleTabsAndSectionSnippets)
					.filter((entry) => (
						!isSectionSnippetProp(String(entry[0]))
					)),
			)
		)


	const sectionAnchorId = (
		sectionId: CollapsibleTabsSectionIds<Sections>,
	) => (
		`${sectionIdPrefix}:${sectionId}`
	)

		const sectionSnippetForSection = (
			section: Sections[number],
		): CollapsibleTabsSectionSnippet | undefined => (
			collapsibleTabsAndSectionSnippets[sectionSnippetName(section.id)]
		)


	// Components
	import CollapsibleTabs1 from '$/components/CollapsibleTabs1.svelte'
</script>


<CollapsibleTabs1
	{...collapsibleTabsProps}
	{Summary}
	{Toolbar}
	{Annotation}
>
	{#snippet Markers(_markersContext)}
		{#each sections as section (section.id)}
			<a
				data-scroll-marker-label={section.label}
				href={`#${sectionAnchorId(section.id)}`}
			>{section.label}</a>
		{/each}
	{/snippet}

	{#snippet body(_bodyContext)}
		{#each sections as section (section.id)}
			{@const Section = sectionSnippetForSection(section)}
			<section id={sectionAnchorId(section.id)}>
				{#if Section}
					{@render Section(
						{
							id: sectionAnchorId(section.id),
							label: section.label,
						},
					)}
				{/if}
			</section>
		{/each}
	{/snippet}
</CollapsibleTabs1>
