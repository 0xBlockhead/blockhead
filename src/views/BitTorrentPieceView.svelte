<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BitTorrentPiece>, 'prefetched'> = $props()

	const torrent = $derived(selection.entitySelector.$torrent)
	const bitTorrentPiece = $derived(selection({
		fields: {
			length: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentPiece}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.pieceIndex)}
	href={
		href === undefined ?
			resolve(
				'/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/piece/[pieceIndex=nonNegativeInteger]',
				{
					infoHash: torrent.infoHash,
					hashVersion: torrent.hashVersion,
					pieceIndex: String(selection.entitySelector.pieceIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.pieceIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentPiece}>
			{#snippet children(entity)}
				{@const length = entity.length}
				{#if length != null}
					<NumberValue
						value={length}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>torrent</dt>
				<dd>
					<BitTorrentMetainfoView
						selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>piece index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.pieceIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceHashV1: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceHashV1 = entity.pieceHashV1}
					{#if pieceHashV1 != null}
						<div>
							<dt>piece hash v1</dt>
							<dd>
								{pieceHashV1}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceRootV2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceRootV2 = entity.pieceRootV2}
					{#if pieceRootV2 != null}
						<div>
							<dt>piece root v2</dt>
							<dd>
								{pieceRootV2}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceLayerHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceLayerHash = entity.pieceLayerHash}
					{#if pieceLayerHash != null}
						<div>
							<dt>piece layer hash</dt>
							<dd>
								<TruncatedValue value={pieceLayerHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={bitTorrentPiece}
			>
				{#snippet children(entity)}
					{@const length = entity.length}
					{#if length != null}
						<div>
							<dt>length</dt>
							<dd>
								<NumberValue
									value={length}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							offset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const offset = entity.offset}
					{#if offset != null}
						<div>
							<dt>offset</dt>
							<dd>
								<NumberValue
									value={offset}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
