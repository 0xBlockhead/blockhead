<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBitTorrentTransfer_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadBitTorrentTransfer_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadBitTorrentTransferTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead bit torrent transfer timestamp')
	const viewDomId = $derived('blockhead-bit-torrent-transfer-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadBitTorrentClientStateView from '$/views/BlockheadBitTorrentClientStateView.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadBitTorrentTransferTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadBitTorrentTransferTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead bit torrent transfer timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadBitTorrentTransferTimestamp}>
			{#snippet Pending()}
				<span data-text="muted">
					<BitTorrentMetainfoView
						selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<BitTorrentMetainfoView
						selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client</dt>
				<dd>
					<BlockheadBitTorrentClientStateView
						selection={select(EntityType.BlockheadBitTorrentClientState, selection.entitySelector.$client, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>torrent</dt>
				<dd>
					<BitTorrentMetainfoView
						selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = pendingEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
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
				{#snippet Pending()}
					{@const error = pendingEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
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
				{#snippet Pending()}
					{@const savePath = pendingEntity.savePath}
					{#if savePath !== undefined && savePath !== null}
						<div>
							<dt>save path</dt>
							<dd>
								{String((savePath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const savePath = resolvedEntity.savePath}
					{#if savePath !== undefined && savePath !== null}
						<div>
							<dt>save path</dt>
							<dd>
								{String((savePath) ?? '')}
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
						{#snippet Pending()}
							{@const selectedFileIndexes = pendingEntity.selectedFileIndexes}
							{#if selectedFileIndexes !== undefined && selectedFileIndexes !== null}
								{selectedFileIndexes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const selectedFileIndexes = resolvedEntity.selectedFileIndexes}
							{#if selectedFileIndexes !== undefined && selectedFileIndexes !== null}
								{selectedFileIndexes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
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
				{#snippet Pending()}
					{@const connectedPeerCount = pendingEntity.connectedPeerCount}
					{#if connectedPeerCount !== undefined && connectedPeerCount !== null}
						<div>
							<dt>connected peer count</dt>
							<dd>
								<NumberValue value={Number(connectedPeerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const connectedPeerCount = resolvedEntity.connectedPeerCount}
					{#if connectedPeerCount !== undefined && connectedPeerCount !== null}
						<div>
							<dt>connected peer count</dt>
							<dd>
								<NumberValue value={Number(connectedPeerCount)} />
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
				{#snippet Pending()}
					{@const downloadedBytes = pendingEntity.downloadedBytes}
					{#if downloadedBytes !== undefined && downloadedBytes !== null}
						<div>
							<dt>downloaded bytes</dt>
							<dd>
								<NumberValue value={Number(downloadedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const downloadedBytes = resolvedEntity.downloadedBytes}
					{#if downloadedBytes !== undefined && downloadedBytes !== null}
						<div>
							<dt>downloaded bytes</dt>
							<dd>
								<NumberValue value={Number(downloadedBytes)} />
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
				{#snippet Pending()}
					{@const uploadedBytes = pendingEntity.uploadedBytes}
					{#if uploadedBytes !== undefined && uploadedBytes !== null}
						<div>
							<dt>uploaded bytes</dt>
							<dd>
								<NumberValue value={Number(uploadedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uploadedBytes = resolvedEntity.uploadedBytes}
					{#if uploadedBytes !== undefined && uploadedBytes !== null}
						<div>
							<dt>uploaded bytes</dt>
							<dd>
								<NumberValue value={Number(uploadedBytes)} />
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
				{#snippet Pending()}
					{@const downloadRate = pendingEntity.downloadRate}
					{#if downloadRate !== undefined && downloadRate !== null}
						<div>
							<dt>download rate</dt>
							<dd>
								<NumberValue value={Number(downloadRate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const downloadRate = resolvedEntity.downloadRate}
					{#if downloadRate !== undefined && downloadRate !== null}
						<div>
							<dt>download rate</dt>
							<dd>
								<NumberValue value={Number(downloadRate)} />
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
				{#snippet Pending()}
					{@const uploadRate = pendingEntity.uploadRate}
					{#if uploadRate !== undefined && uploadRate !== null}
						<div>
							<dt>upload rate</dt>
							<dd>
								<NumberValue value={Number(uploadRate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uploadRate = resolvedEntity.uploadRate}
					{#if uploadRate !== undefined && uploadRate !== null}
						<div>
							<dt>upload rate</dt>
							<dd>
								<NumberValue value={Number(uploadRate)} />
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
				{#snippet Pending()}
					{@const verifiedPieces = pendingEntity.verifiedPieces}
					{#if verifiedPieces !== undefined && verifiedPieces !== null}
						<div>
							<dt>verified pieces</dt>
							<dd>
								<NumberValue value={Number(verifiedPieces)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedPieces = resolvedEntity.verifiedPieces}
					{#if verifiedPieces !== undefined && verifiedPieces !== null}
						<div>
							<dt>verified pieces</dt>
							<dd>
								<NumberValue value={Number(verifiedPieces)} />
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
				{#snippet Pending()}
					{@const failedPieces = pendingEntity.failedPieces}
					{#if failedPieces !== undefined && failedPieces !== null}
						<div>
							<dt>failed pieces</dt>
							<dd>
								<NumberValue value={Number(failedPieces)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const failedPieces = resolvedEntity.failedPieces}
					{#if failedPieces !== undefined && failedPieces !== null}
						<div>
							<dt>failed pieces</dt>
							<dd>
								<NumberValue value={Number(failedPieces)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
