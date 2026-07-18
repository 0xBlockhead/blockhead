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
		title = 'Blockhead 0G storage node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZeroGStorageNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadZeroGStorageNodeState_Timestamp>
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
	import BlockheadZeroGStorageNodeState_TimestampView from '$/views/BlockheadZeroGStorageNodeState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStorageNodeState_Timestamp}
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
				$nodeState: true,
				localChunkCount: true,
			},
		})
	}
	getResourceItems={(blockheadZeroGStorageNodeStateTimestamps) => [...new Map(blockheadZeroGStorageNodeStateTimestamps.values.map((blockheadZeroGStorageNodeStateTimestamp) => [blockheadZeroGStorageNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadZeroGStorageNodeStateTimestamp])).values()]}
	getKey={(blockheadZeroGStorageNodeStateTimestamp) => blockheadZeroGStorageNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zero g storage node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZeroGStorageNodeStateTimestamp })}
		{@const blockheadZeroGStorageNodeStateTimestampFields = { ...blockheadZeroGStorageNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadZeroGStorageNodeStateTimestamp }}
		{@const selection = select(EntityType.BlockheadZeroGStorageNodeState_Timestamp, blockheadZeroGStorageNodeStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadZeroGStorageNodeState_TimestampView
			selection={selection}
			prefetched={blockheadZeroGStorageNodeStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
