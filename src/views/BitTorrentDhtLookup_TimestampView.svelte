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
	}: Omit<EntitySelectionViewProps<EntityType.BitTorrentDhtLookup_Timestamp>, 'prefetched'> = $props()

	const torrent = $derived(selection.entitySelector.$torrent)
	const bitTorrentDhtLookupTimestamp = $derived(selection({
		fields: {
			peerCount: true,
			status: true,
		},
	}))
	const titleFallback = 'mainline DHT lookup'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BitTorrentDhtNode_TimestampsView from '$/views/BitTorrentDhtNode_TimestampsView.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentDhtLookup_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/dht-lookup/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					infoHash: torrent.infoHash,
					hashVersion: torrent.hashVersion,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<BitTorrentMetainfoView
			selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentDhtLookupTimestamp}>
			{#snippet children(entity)}
				{[String(entity.peerCount ?? ''), (entity.status ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							queriedNodeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const queriedNodeCount = entity.queriedNodeCount}
					{#if queriedNodeCount != null}
						<div>
							<dt>Queried nodes</dt>
							<dd>
								<NumberValue
									value={queriedNodeCount}
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
							responsiveNodeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responsiveNodeCount = entity.responsiveNodeCount}
					{#if responsiveNodeCount != null}
						<div>
							<dt>Responsive nodes</dt>
							<dd>
								<NumberValue
									value={responsiveNodeCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bitTorrentDhtLookupTimestamp}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>Peers</dt>
							<dd>
								<NumberValue
									value={peerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={bitTorrentDhtLookupTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const closestNodesResource = selection.$$closestNodes}
		<ResourceBoundary
			resource={closestNodesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BitTorrentDhtNode_TimestampsView
						selection={closestNodesResource}
						countResource={closestNodesResource.count}
						title='Closest DHT nodes'
						id='closest-nodes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
