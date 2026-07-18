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
		title = 'Blockhead Codex storage node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCodexStorageNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadCodexStorageNodeState_Timestamp>
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
	import BlockheadCodexStorageNodeState_TimestampView from '$/views/BlockheadCodexStorageNodeState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
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
				timestampMs: true,
				version: true,
				peerCount: true,
			},
		})
	}
	getResourceItems={(blockheadCodexStorageNodeStateTimestamps) => [...new Map(blockheadCodexStorageNodeStateTimestamps.values.map((blockheadCodexStorageNodeStateTimestamp) => [blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadCodexStorageNodeStateTimestamp])).values()]}
	getKey={(blockheadCodexStorageNodeStateTimestamp) => blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead codex storage node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCodexStorageNodeStateTimestamp })}
		{@const blockheadCodexStorageNodeStateTimestampFields = { ...blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadCodexStorageNodeStateTimestamp }}
		{@const selection = select(EntityType.BlockheadCodexStorageNodeState_Timestamp, blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadCodexStorageNodeState_TimestampView
			selection={selection}
			prefetched={blockheadCodexStorageNodeStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
