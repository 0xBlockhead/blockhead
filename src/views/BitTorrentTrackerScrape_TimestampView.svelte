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
	}: Omit<EntitySelectionViewProps<EntityType.BitTorrentTrackerScrape_Timestamp>, 'prefetched'> = $props()

	const bitTorrentTrackerScrapeTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentTrackerView from '$/views/BitTorrentTrackerView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentTrackerScrape_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/bittorrent/tracker/[trackerUrl=stringSegment]/(bitTorrentTracker)/scrape/[infoHash=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					trackerUrl: selection.entitySelector.$tracker.trackerUrl,
					infoHash: selection.entitySelector.infoHash,
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
		<ResourceBoundary resource={bitTorrentTrackerScrapeTimestamp}>
			{#snippet children(entity)}
				{entity.status || String(selection.entitySelector.timestampMs)}
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
				<dt>tracker</dt>
				<dd>
					<BitTorrentTrackerView
						selection={select(EntityType.BitTorrentTracker, selection.entitySelector.$tracker)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>info hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.infoHash} />
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

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={bitTorrentTrackerScrapeTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							complete: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const complete = entity.complete}
					{#if complete != null}
						<div>
							<dt>complete</dt>
							<dd>
								<NumberValue
									value={complete}
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
							downloaded: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const downloaded = entity.downloaded}
					{#if downloaded != null}
						<div>
							<dt>downloaded</dt>
							<dd>
								<NumberValue
									value={downloaded}
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
							incomplete: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const incomplete = entity.incomplete}
					{#if incomplete != null}
						<div>
							<dt>incomplete</dt>
							<dd>
								<NumberValue
									value={incomplete}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
