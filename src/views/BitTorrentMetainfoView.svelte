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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentMetainfo>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BitTorrentMetainfo>>
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
	const bitTorrentMetainfo = $derived(selection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.infoHash) ?? '')].filter(Boolean).join(' ') || 'bit torrent metainfo')
	const viewDomId = $derived('bit-torrent-metainfo-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentFilesView from '$/views/BitTorrentFilesView.svelte'
	import BitTorrentFileTreeEntriesView from '$/views/BitTorrentFileTreeEntriesView.svelte'
	import BitTorrentPiecesView from '$/views/BitTorrentPiecesView.svelte'
	import BitTorrentTrackersView from '$/views/BitTorrentTrackersView.svelte'
	import MagnetLinksView from '$/views/MagnetLinksView.svelte'
	import BitTorrentSwarmObservation_TimestampsView from '$/views/BitTorrentSwarmObservation_TimestampsView.svelte'
	import BlockheadBitTorrentTransfer_TimestampsView from '$/views/BlockheadBitTorrentTransfer_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentMetainfo}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitTorrentMetainfo}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.infoHash) ?? '')].filter(Boolean).join(' ') || 'bit torrent metainfo'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentMetainfo}>
			{#snippet Pending()}
				{[String((pendingEntity.hashVersion) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.infoHash) ?? '')].filter(Boolean).join(' ') || 'bit torrent metainfo'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.hashVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>info hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									infoHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const infoHash = pendingEntity.infoHash}
							{#if infoHash !== undefined && infoHash !== null}
								<TruncatedValue value={String((infoHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const infoHash = resolvedEntity.infoHash}
							{#if infoHash !== undefined && infoHash !== null}
								<TruncatedValue value={String((infoHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>hash version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hashVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hashVersion = pendingEntity.hashVersion}
							{#if hashVersion !== undefined && hashVersion !== null}
								<TruncatedValue value={String((hashVersion) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hashVersion = resolvedEntity.hashVersion}
							{#if hashVersion !== undefined && hashVersion !== null}
								<TruncatedValue value={String((hashVersion) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalLength = pendingEntity.totalLength}
					{#if totalLength !== undefined && totalLength !== null}
						<div>
							<dt>total length</dt>
							<dd>
								<NumberValue value={Number(totalLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalLength = resolvedEntity.totalLength}
					{#if totalLength !== undefined && totalLength !== null}
						<div>
							<dt>total length</dt>
							<dd>
								<NumberValue value={Number(totalLength)} />
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
							infoHashV1: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const infoHashV1 = pendingEntity.infoHashV1}
					{#if infoHashV1 !== undefined && infoHashV1 !== null}
						<div>
							<dt>info hash v1</dt>
							<dd>
								<TruncatedValue value={String((infoHashV1) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const infoHashV1 = resolvedEntity.infoHashV1}
					{#if infoHashV1 !== undefined && infoHashV1 !== null}
						<div>
							<dt>info hash v1</dt>
							<dd>
								<TruncatedValue value={String((infoHashV1) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							infoHashV2: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const infoHashV2 = pendingEntity.infoHashV2}
					{#if infoHashV2 !== undefined && infoHashV2 !== null}
						<div>
							<dt>info hash v2</dt>
							<dd>
								<TruncatedValue value={String((infoHashV2) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const infoHashV2 = resolvedEntity.infoHashV2}
					{#if infoHashV2 !== undefined && infoHashV2 !== null}
						<div>
							<dt>info hash v2</dt>
							<dd>
								<TruncatedValue value={String((infoHashV2) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metainfoHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metainfoHash = pendingEntity.metainfoHash}
					{#if metainfoHash !== undefined && metainfoHash !== null}
						<div>
							<dt>metainfo hash</dt>
							<dd>
								<TruncatedValue value={String((metainfoHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metainfoHash = resolvedEntity.metainfoHash}
					{#if metainfoHash !== undefined && metainfoHash !== null}
						<div>
							<dt>metainfo hash</dt>
							<dd>
								<TruncatedValue value={String((metainfoHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bencodedInfoHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bencodedInfoHash = pendingEntity.bencodedInfoHash}
					{#if bencodedInfoHash !== undefined && bencodedInfoHash !== null}
						<div>
							<dt>bencoded info hash</dt>
							<dd>
								<TruncatedValue value={String((bencodedInfoHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bencodedInfoHash = resolvedEntity.bencodedInfoHash}
					{#if bencodedInfoHash !== undefined && bencodedInfoHash !== null}
						<div>
							<dt>bencoded info hash</dt>
							<dd>
								<TruncatedValue value={String((bencodedInfoHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pieceLength = pendingEntity.pieceLength}
					{#if pieceLength !== undefined && pieceLength !== null}
						<div>
							<dt>piece length</dt>
							<dd>
								<NumberValue value={Number(pieceLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceLength = resolvedEntity.pieceLength}
					{#if pieceLength !== undefined && pieceLength !== null}
						<div>
							<dt>piece length</dt>
							<dd>
								<NumberValue value={Number(pieceLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							private: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const privateValue = pendingEntity.private}
					{#if privateValue !== undefined && privateValue !== null}
						<div>
							<dt>private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const privateValue = resolvedEntity.private}
					{#if privateValue !== undefined && privateValue !== null}
						<div>
							<dt>private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-bittorrent-content'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bittorrent-files',
							label: 'Files',
						},
						{
							id: 'bittorrent-file-tree',
							label: 'File tree',
						},
						{
							id: 'bittorrent-pieces',
							label: 'Pieces',
						},
					]
				}
				data-card
				class='network-view-collapsible-content'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Content</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBittorrentFiles({ id, label, open })}
					<BitTorrentFilesView
						selection={selection.$$files}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No files found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBittorrentFileTree({ id, label, open })}
					<BitTorrentFileTreeEntriesView
						selection={selection.$$fileTreeEntries}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No file tree entries found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBittorrentPieces({ id, label, open })}
					<BitTorrentPiecesView
						selection={selection.$$pieces}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No pieces found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-bittorrent-discovery'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bittorrent-trackers',
							label: 'Trackers',
						},
						{
							id: 'bittorrent-magnets',
							label: 'Magnets',
						},
					]
				}
				data-card
				class='network-view-collapsible-discovery'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Discovery</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBittorrentTrackers({ id, label, open })}
					<BitTorrentTrackersView
						selection={selection.$$trackers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No trackers found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBittorrentMagnets({ id, label, open })}
					<MagnetLinksView
						selection={selection.$$magnets}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No magnets found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-bittorrent-swarm'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bittorrent-swarm-observations',
							label: 'Swarm observations',
						},
						{
							id: 'bittorrent-client-transfers',
							label: 'Client transfers',
						},
					]
				}
				data-card
				class='network-view-collapsible-swarm'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Swarm and transfers</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBittorrentSwarmObservations({ id, label, open })}
					<BitTorrentSwarmObservation_TimestampsView
						selection={selection.$$swarmTimestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No swarm observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBittorrentClientTransfers({ id, label, open })}
					<BlockheadBitTorrentTransfer_TimestampsView
						selection={selection.$$clientTransfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No client transfers yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
