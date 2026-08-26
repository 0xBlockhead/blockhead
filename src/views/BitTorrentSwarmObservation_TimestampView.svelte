<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BitTorrentSwarmObservation_Timestamp>, 'prefetched'> = $props()

	const torrent = $derived(selection.entitySelector.$torrent)
	const bitTorrentSwarmObservationTimestamp = $derived(selection({
		fields: {
			peerCount: true,
			seedCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentSwarmObservationTimestamp}>
			{#snippet children(entity)}
				{[String(entity.peerCount ?? ''), String(entity.seedCount ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
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
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={bitTorrentSwarmObservationTimestamp}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue
									value={peerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bitTorrentSwarmObservationTimestamp}
			>
				{#snippet children(entity)}
					{@const seedCount = entity.seedCount}
					{#if seedCount != null}
						<div>
							<dt>seed count</dt>
							<dd>
								<NumberValue
									value={seedCount}
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
							completedCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedCount = entity.completedCount}
					{#if completedCount != null}
						<div>
							<dt>completed count</dt>
							<dd>
								<NumberValue
									value={completedCount}
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
							availability: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const availability = entity.availability}
					{#if availability != null}
						<div>
							<dt>availability</dt>
							<dd>
								<NumberValue
									value={availability}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
