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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadBitTorrentTransfer_Timestamp>
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
	import BlockheadBitTorrentTransfer_TimestampView from '$/views/BlockheadBitTorrentTransfer_TimestampView.svelte'
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
				$torrent: true,
			},
		})
	}
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
		{@const selection = select(EntityType.BlockheadBitTorrentTransfer_Timestamp, blockheadBitTorrentTransferTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadBitTorrentTransfer_TimestampView
			selection={selection}
			prefetched={blockheadBitTorrentTransferTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
