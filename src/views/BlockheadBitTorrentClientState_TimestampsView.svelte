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
		title = 'Blockhead bit torrent client state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBitTorrentClientState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadBitTorrentClientState_Timestamp>
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
	import BlockheadBitTorrentClientState_TimestampView from '$/views/BlockheadBitTorrentClientState_TimestampView.svelte'
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
					clientVersion: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBitTorrentClientState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadBitTorrentClientStateTimestamps)}
			{@const uniqueBlockheadBitTorrentClientStateTimestamps = [...new Map(blockheadBitTorrentClientStateTimestamps.values.map((blockheadBitTorrentClientStateTimestamp) => [blockheadBitTorrentClientStateTimestamp[EntityMetaKey.SelectorKey], blockheadBitTorrentClientStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBitTorrentClientState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadBitTorrentClientStateTimestamps.totalCount}
				getKey={(blockheadBitTorrentClientStateTimestamp) => blockheadBitTorrentClientStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadBitTorrentClientStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead bit torrent client state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadBitTorrentClientStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadBitTorrentClientState_Timestamp> })}
					{@const blockheadBitTorrentClientStateTimestampFields = { ...blockheadBitTorrentClientStateTimestamp[EntityMetaKey.Selector], ...blockheadBitTorrentClientStateTimestamp }}
					<BlockheadBitTorrentClientState_TimestampView
						selection={select(EntityType.BlockheadBitTorrentClientState_Timestamp, blockheadBitTorrentClientStateTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadBitTorrentClientStateTimestampFields}
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
		entityType={EntityType.BlockheadBitTorrentClientState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
