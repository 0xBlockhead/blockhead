<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead Codex stored data',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCodexStoredDataEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadCodexStoredData>
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
	import BlockheadCodexStoredDataView from '$/views/BlockheadCodexStoredDataView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCodexStoredData}
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
				cid: true,
				$nodeState: true,
				firstSeenAt: true,
			},
		})
	}
	getResourceItems={(blockheadCodexStoredDataEntries) => [...new Map(blockheadCodexStoredDataEntries.values.map((blockheadCodexStoredData) => [blockheadCodexStoredData[EntityMetaKey.SelectorKey], blockheadCodexStoredData])).values()]}
	getKey={(blockheadCodexStoredData) => blockheadCodexStoredData[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead codex stored data entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCodexStoredData })}
		{@const blockheadCodexStoredDataFields = { ...blockheadCodexStoredData[EntityMetaKey.Selector], ...blockheadCodexStoredData }}
		{@const selection = select(EntityType.BlockheadCodexStoredData, blockheadCodexStoredData[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadCodexStoredDataView
			selection={selection}
			prefetched={blockheadCodexStoredDataFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
