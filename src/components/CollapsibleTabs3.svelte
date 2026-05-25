<script lang="ts" module>
	// Types/constants
	import type { Snippet } from 'svelte'


	export type CollapsibleTabs3SectionContentProps = {
		id: string
		label: string
	}

	export type CollapsibleTabs3SectionSnippet = Snippet<[
		CollapsibleTabs3SectionContentProps,
	]>


	export type CollapsibleTabs3SectionRow<SectionId extends string = string> = {
		id: SectionId
		label: string
	}


	export type CollapsibleTabs3SectionIds<
		Sections extends readonly CollapsibleTabs3SectionRow[],
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

	export type CollapsibleTabs3SectionSnippets<
		SectionId extends string,
	> = {
		[SectionKey in SectionId as SectionSnippetName<SectionKey>]: Snippet<[
			CollapsibleTabs3SectionContentProps,
		]>
	}

	export type CollapsibleTabs3OwnProps<
		Sections extends readonly CollapsibleTabs3SectionRow[],
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
	} & CollapsibleTabs3SectionSnippets<CollapsibleTabs3SectionIds<Sections>>


	export const collapsibleTabs3Sections = <
		const Sections extends readonly CollapsibleTabs3SectionRow[],
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
	generics="const Sections extends readonly CollapsibleTabs3SectionRow[]"
>
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { ComponentProps } from 'svelte'


	// Props
	let {
		sectionIdPrefix,
		sections,

		Summary,
		Toolbar,
		Annotation,

		...collapsibleTabsAndSectionSnippets
	}: WithRest<
		CollapsibleTabs3OwnProps<Sections>,
		Omit<
			ComponentProps<typeof CollapsibleTabs>,
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
				{} as CollapsibleTabs3SectionSnippets<
					CollapsibleTabs3SectionIds<Sections>
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
		sectionId: CollapsibleTabs3SectionIds<Sections>,
	) => (
		`${sectionIdPrefix}:${sectionId}`
	)

	const sectionSnippetForSection = (
		section: Sections[number],
	): CollapsibleTabs3SectionSnippet => (
		sectionSnippets[
			sectionSnippetName(
				section.id as CollapsibleTabs3SectionIds<Sections>,
			) as keyof CollapsibleTabs3SectionSnippets<
				CollapsibleTabs3SectionIds<Sections>
			>
		] as CollapsibleTabs3SectionSnippet
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
</script>


<CollapsibleTabs
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
</CollapsibleTabs>
