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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadBitTorrentTransfer_Timestamp>, 'prefetched'> = $props()

	const torrent = $derived(selection.entitySelector.$torrent)
	const blockheadBitTorrentTransferTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadBitTorrentClientStateView from '$/views/BlockheadBitTorrentClientStateView.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/bittorrent/client-state/[clientId=stringSegment]/(blockheadBitTorrentClientState)/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/observations/[timestampMs=nonNegativeInteger]',
				{
					clientId: selection.entitySelector.$client.clientId,
					infoHash: torrent.infoHash,
					hashVersion: torrent.hashVersion,
					timestampMs: String(selection.entitySelector.timestampMs),
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadBitTorrentTransferTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BitTorrentMetainfoView
				selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>client</dt>
				<dd>
					<BlockheadBitTorrentClientStateView
						selection={select(EntityType.BlockheadBitTorrentClientState, selection.entitySelector.$client)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadBitTorrentTransferTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							savePath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const savePath = entity.savePath}
					{#if savePath != null}
						<div>
							<dt>save path</dt>
							<dd>
								{savePath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>selected file indexes</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									selectedFileIndexes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.selectedFileIndexes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							connectedPeerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const connectedPeerCount = entity.connectedPeerCount}
					{#if connectedPeerCount != null}
						<div>
							<dt>connected peer count</dt>
							<dd>
								<NumberValue
									value={connectedPeerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							downloadedBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const downloadedBytes = entity.downloadedBytes}
					{#if downloadedBytes != null}
						<div>
							<dt>downloaded bytes</dt>
							<dd>
								<NumberValue
									value={downloadedBytes}
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
							uploadedBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uploadedBytes = entity.uploadedBytes}
					{#if uploadedBytes != null}
						<div>
							<dt>uploaded bytes</dt>
							<dd>
								<NumberValue
									value={uploadedBytes}
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
							downloadRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const downloadRate = entity.downloadRate}
					{#if downloadRate != null}
						<div>
							<dt>download rate</dt>
							<dd>
								<NumberValue
									value={downloadRate}
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
							uploadRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uploadRate = entity.uploadRate}
					{#if uploadRate != null}
						<div>
							<dt>upload rate</dt>
							<dd>
								<NumberValue
									value={uploadRate}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedPieces: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedPieces = entity.verifiedPieces}
					{#if verifiedPieces != null}
						<div>
							<dt>verified pieces</dt>
							<dd>
								<NumberValue
									value={verifiedPieces}
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
							failedPieces: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const failedPieces = entity.failedPieces}
					{#if failedPieces != null}
						<div>
							<dt>failed pieces</dt>
							<dd>
								<NumberValue
									value={failedPieces}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
