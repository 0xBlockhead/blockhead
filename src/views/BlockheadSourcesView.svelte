<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Sources',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSources-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadSource>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSource}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				label: true,
				source: true,
				id: true,
			},
		})
	}
	getResourceItems={(blockheadSources) => [...new Map(blockheadSources.values.map((blockheadSource) => [blockheadSource[EntityMetaKey.SelectorKey], blockheadSource])).values()]}
	getKey={(blockheadSource) => blockheadSource[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Sources yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadSource })}
		{@const blockheadSourceFields = { ...blockheadSource[EntityMetaKey.Selector], ...blockheadSource }}
		{@const selection = select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const blockheadSourceHrefFields = { ...blockheadSource, ...blockheadSource[EntityMetaKey.Selector] }}
		<BlockheadSourceView
			selection={selection}
			prefetched={blockheadSourceFields}
			href={
				(blockheadSourceHrefFields.id !== undefined ? resolve('/~/manage/source/[sourceId=stringSegment]', {
					sourceId: String(blockheadSourceHrefFields.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
