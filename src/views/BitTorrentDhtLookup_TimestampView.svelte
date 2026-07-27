<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BitTorrentDhtLookup_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const bitTorrentDhtLookupTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.infoHash ?? '') || 'bit torrent DHT lookup timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentDhtLookup_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.infoHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentDhtLookupTimestamp}>
			{#snippet children(entity)}
				{entity.status || pendingEntity.infoHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>info hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.infoHash} />
				</dd>
			</div>

			<div>
				<dt>observer key</dt>
				<dd>
					{pendingEntity.observerKey}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={bitTorrentDhtLookupTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

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
							<dt>queried node count</dt>
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
							<dt>responsive node count</dt>
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
				resource={
					selection({
						fields: {
							peerCount: true,
						},
					})
				}
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
		</dl>
	{/snippet}
</EntityView>
