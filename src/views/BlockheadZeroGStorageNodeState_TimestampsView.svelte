<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadZeroGStorageNodeState_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				$nodeState: {
					fields: {
						$network: {
							fields: {
								name: true,
								environment: true,
							},
						},
					},
				},
				localChunkCount: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadZeroGStorageNodeState_Timestamp}
			entitySelector={blockheadZeroGStorageNodeStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadZeroGStorageNodeStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g storage node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadZeroGStorageNodeStateTimestampFields.$nodeState.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g storage node state'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadZeroGStorageNodeStateTimestampFields.localChunkCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
