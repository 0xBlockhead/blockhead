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
	}: EntitySelectionViewProps<EntityType.BitTorrentTracker> = $props()

	const bitTorrentTracker = $derived(selection({
		fields: {
			trackerKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.trackerUrl || 'bit torrent tracker')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentAnnounce_TimestampsView from '$/views/BitTorrentAnnounce_TimestampsView.svelte'
	import BitTorrentTrackerScrape_TimestampsView from '$/views/BitTorrentTrackerScrape_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentTracker}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.trackerUrl || 'bit torrent tracker'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentTracker}>
			{#snippet children(entity)}
				{entity.trackerKind || selection.entitySelector.trackerUrl || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>tracker URL</dt>
				<dd>
					<a
						href={selection.entitySelector.trackerUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.trackerUrl} />
					</a>
				</dd>
			</div>

			<div>
				<dt>tracker kind</dt>
				<dd>
					<ResourceBoundary
						resource={bitTorrentTracker}
					>
						{#snippet children(entity)}
							{entity.trackerKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const announcesResource = selection.$$announces}
		<ResourceBoundary
			resource={announcesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BitTorrentAnnounce_TimestampsView
						selection={announcesResource}
						countResource={announcesResource.count}
						title='announces'
						id='announces'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const scrapesResource = selection.$$scrapes}
		<ResourceBoundary
			resource={scrapesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BitTorrentTrackerScrape_TimestampsView
						selection={scrapesResource}
						countResource={scrapesResource.count}
						title='scrapes'
						id='scrapes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
