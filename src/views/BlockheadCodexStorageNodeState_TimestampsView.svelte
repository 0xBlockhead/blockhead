<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead Codex storage node state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCodexStorageNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadCodexStorageNodeState_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadCodexStorageNodeState_TimestampView from '$/views/BlockheadCodexStorageNodeState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					timestampMs: true,
					version: true,
					peerCount: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadCodexStorageNodeStateTimestamps)}
			{@const uniqueBlockheadCodexStorageNodeStateTimestamps = [...new Map(blockheadCodexStorageNodeStateTimestamps.values.map((blockheadCodexStorageNodeStateTimestamp) => [blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadCodexStorageNodeStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadCodexStorageNodeStateTimestamps.totalCount}
				getKey={(blockheadCodexStorageNodeStateTimestamp) => blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadCodexStorageNodeStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead codex storage node state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadCodexStorageNodeStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadCodexStorageNodeState_Timestamp> })}
					{@const blockheadCodexStorageNodeStateTimestampFields = { ...blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadCodexStorageNodeStateTimestamp }}
					<BlockheadCodexStorageNodeState_TimestampView
						selection={select(EntityType.BlockheadCodexStorageNodeState_Timestamp, blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadCodexStorageNodeStateTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
