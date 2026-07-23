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
		title = 'Blockhead bit torrent transfer observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBitTorrentTransfer_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadBitTorrentTransfer_Timestamp>
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
	entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
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
				status: true,
				$torrent: {
					fields: {
						name: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadBitTorrentTransferTimestamps) => [...new Map(blockheadBitTorrentTransferTimestamps.values.map((blockheadBitTorrentTransferTimestamp) => [blockheadBitTorrentTransferTimestamp[EntityMetaKey.SelectorKey], blockheadBitTorrentTransferTimestamp])).values()]}
	getKey={(blockheadBitTorrentTransferTimestamp) => blockheadBitTorrentTransferTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead bit torrent transfer observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadBitTorrentTransferTimestamp })}
		{@const blockheadBitTorrentTransferTimestampFields = { ...blockheadBitTorrentTransferTimestamp[EntityMetaKey.Selector], ...blockheadBitTorrentTransferTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
			entitySelector={blockheadBitTorrentTransferTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadBitTorrentTransferTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead bit torrent transfer timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadBitTorrentTransferTimestampFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadBitTorrentTransferTimestampFields.$torrent.name) ?? '')].filter(Boolean).join(' ') || [String((blockheadBitTorrentTransferTimestampFields.$torrent.infoHash) ?? '')].filter(Boolean).join(' ') || 'bit torrent metainfo'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
