<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BitTorrentMetainfo> = $props()

	const bitTorrentMetainfo = $derived(selection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.infoHash || 'bit torrent metainfo')
	const viewDomId = $derived('bit-torrent-metainfo-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitTorrentMetainfo}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.hashVersion || (prefetched.name ?? '') || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={bitTorrentMetainfo}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>info hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.infoHash} />
				</dd>
			</div>

			<div>
				<dt>hash version</dt>
				<dd>
					{selection.entitySelector.hashVersion}
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
				{#snippet children(entity)}
					{@const totalLength = entity.totalLength}
					{#if totalLength != null}
						<div>
							<dt>total length</dt>
							<dd>
								<NumberValue
									value={totalLength}
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
							infoHashV1: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const infoHashV1 = entity.infoHashV1}
					{#if infoHashV1 != null}
						<div>
							<dt>info hash v1</dt>
							<dd>
								{infoHashV1}
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
				{#snippet children(entity)}
					{@const infoHashV2 = entity.infoHashV2}
					{#if infoHashV2 != null}
						<div>
							<dt>info hash v2</dt>
							<dd>
								{infoHashV2}
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
				{#snippet children(entity)}
					{@const metainfoHash = entity.metainfoHash}
					{#if metainfoHash != null}
						<div>
							<dt>metainfo hash</dt>
							<dd>
								<TruncatedValue value={metainfoHash} />
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
				{#snippet children(entity)}
					{@const bencodedInfoHash = entity.bencodedInfoHash}
					{#if bencodedInfoHash != null}
						<div>
							<dt>bencoded info hash</dt>
							<dd>
								<TruncatedValue value={bencodedInfoHash} />
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
				{#snippet children(entity)}
					{@const pieceLength = entity.pieceLength}
					{#if pieceLength != null}
						<div>
							<dt>piece length</dt>
							<dd>
								<NumberValue
									value={pieceLength}
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
							private: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const privateValue = entity.private}
					{#if privateValue != null}
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

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Content</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittorrentFiles({ id, label })}
				<BitTorrentFilesView
					selection={selection.$$files}
					collapsible={false}
					title={label}
					emptyText='No files found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBittorrentFileTree({ id, label })}
				<BitTorrentFileTreeEntriesView
					selection={selection.$$fileTreeEntries}
					collapsible={false}
					title={label}
					emptyText='No file tree entries found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBittorrentPieces({ id, label })}
				<BitTorrentPiecesView
					selection={selection.$$pieces}
					collapsible={false}
					title={label}
					emptyText='No pieces found.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Discovery</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittorrentTrackers({ id, label })}
				<BitTorrentTrackersView
					selection={selection.$$trackers}
					collapsible={false}
					title={label}
					emptyText='No trackers found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBittorrentMagnets({ id, label })}
				<MagnetLinksView
					selection={selection.$$magnets}
					collapsible={false}
					title={label}
					emptyText='No magnets found.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Swarm and transfers</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBittorrentSwarmObservations({ id, label })}
				<BitTorrentSwarmObservation_TimestampsView
					selection={selection.$$swarmTimestamps}
					collapsible={false}
					title={label}
					emptyText='No swarm observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionBittorrentClientTransfers({ id, label })}
				<BlockheadBitTorrentTransfer_TimestampsView
					selection={selection.$$clientTransfers}
					collapsible={false}
					title={label}
					emptyText='No client transfers yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
