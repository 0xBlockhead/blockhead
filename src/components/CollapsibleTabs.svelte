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


	type KebabToPascalCase<Segment extends string> = (
		Segment extends `${infer Head}-${infer Tail}` ?
			`${Capitalize<Head>}${KebabToPascalCase<Tail>}`
		:
			Capitalize<Segment>
	)

	export type SectionSnippetName<SectionId extends string> = (
		`Section${KebabToPascalCase<SectionId>}`
	)

	export type CollapsibleTabsSectionSnippets<
		SectionId extends string,
	> = {
		[SectionKey in SectionId as SectionSnippetName<SectionKey>]: Snippet<[
			CollapsibleTabsSectionContentProps,
		]>
	}

	export type CollapsibleTabsOwnProps<
		Sections extends readonly CollapsibleTabsSectionRow[],
	> = {
		sectionIdPrefix: string
		sections: Sections

		Summary?: Snippet<[context?: {
			open?: boolean,
		}]>
		Toolbar?: Snippet<[context?: {
			open?: boolean,
		}]>
		Annotation?: Snippet<[context?: {
			open?: boolean,
		}]>
	} & CollapsibleTabsSectionSnippets<CollapsibleTabsSectionIds<Sections>>


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

	export const sectionSnippetName = <SectionId extends string>(
		sectionId: SectionId,
	): SectionSnippetName<SectionId> => (
		`Section${kebabToPascalCase(sectionId)}` as SectionSnippetName<SectionId>
	)


</script>


<script
	lang="ts"
	generics="const Sections extends readonly CollapsibleTabsSectionRow[]"
>
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { ComponentProps } from 'svelte'


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
		Omit<
			ComponentProps<typeof CollapsibleTabs1>,
			'Markers' | 'body' | 'Summary' | 'Toolbar' | 'Annotation'
		>
	> = $props()


	// Functions
	const sectionSnippetPropPrefix = 'Section'

	const isSectionSnippetProp = (
		propKey: string,
	) => (
		propKey.startsWith(sectionSnippetPropPrefix)
	)

	const sectionSnippets = (
		Object
			.entries(collapsibleTabsAndSectionSnippets)
			.reduce(
				(accumulator, [propKey, snippet]) => (
					isSectionSnippetProp(propKey) ?
						{
							...accumulator,
							[propKey]: snippet,
						}
					:
						accumulator
				),
			{} as CollapsibleTabsSectionSnippets<
				CollapsibleTabsSectionIds<Sections>
			>,
			)
	)

	const collapsibleTabsProps = (
		Object.fromEntries(
			Object
				.entries(collapsibleTabsAndSectionSnippets)
				.filter(([propKey]) => (
					!isSectionSnippetProp(propKey)
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
	): CollapsibleTabsSectionSnippet => (
		sectionSnippets[
			sectionSnippetName(
				section.id as CollapsibleTabsSectionIds<Sections>,
			) as keyof CollapsibleTabsSectionSnippets<
				CollapsibleTabsSectionIds<Sections>
			>
		] as CollapsibleTabsSectionSnippet
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
			{@const sectionContentProps = {
				id: sectionAnchorId(section.id),
				label: section.label,
			}}
			<section id={sectionContentProps.id}>
				{@render sectionSnippetForSection(section)(
					sectionContentProps,
				)}
			</section>
		{/each}
	{/snippet}
</CollapsibleTabs1>
