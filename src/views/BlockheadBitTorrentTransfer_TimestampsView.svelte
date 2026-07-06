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
		title = 'Blockhead bit torrent transfer observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBitTorrentTransfer_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadBitTorrentTransfer_Timestamp>
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
	import BlockheadBitTorrentTransfer_TimestampView from '$/views/BlockheadBitTorrentTransfer_TimestampView.svelte'
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
					status: true,
					$torrent: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadBitTorrentTransferTimestamps)}
			{@const uniqueBlockheadBitTorrentTransferTimestamps = [...new Map(blockheadBitTorrentTransferTimestamps.values.map((blockheadBitTorrentTransferTimestamp) => [blockheadBitTorrentTransferTimestamp[EntityMetaKey.SelectorKey], blockheadBitTorrentTransferTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadBitTorrentTransferTimestamps.totalCount}
				getKey={(blockheadBitTorrentTransferTimestamp) => blockheadBitTorrentTransferTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadBitTorrentTransferTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead bit torrent transfer observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadBitTorrentTransferTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadBitTorrentTransfer_Timestamp> })}
					{@const blockheadBitTorrentTransferTimestampFields = { ...blockheadBitTorrentTransferTimestamp[EntityMetaKey.Selector], ...blockheadBitTorrentTransferTimestamp }}
					<BlockheadBitTorrentTransfer_TimestampView
						selection={select(EntityType.BlockheadBitTorrentTransfer_Timestamp, blockheadBitTorrentTransferTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadBitTorrentTransferTimestampFields}
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
		entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
