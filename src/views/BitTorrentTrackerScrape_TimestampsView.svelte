<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BitTorrentTrackerScrape_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentTrackerScrape_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentTrackerScrapeTimestamp })}
		{@const bitTorrentTrackerScrapeTimestampSelector = bitTorrentTrackerScrapeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitTorrentTrackerScrape_Timestamp}
			entitySelector={bitTorrentTrackerScrapeTimestampSelector}
			href={
				resolve(
					'/bittorrent/tracker/[trackerUrl=stringSegment]/(bitTorrentTracker)/scrape/[infoHash=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						trackerUrl: bitTorrentTrackerScrapeTimestampSelector.$tracker.trackerUrl,
						infoHash: bitTorrentTrackerScrapeTimestampSelector.infoHash,
						timestampMs: String(bitTorrentTrackerScrapeTimestampSelector.timestampMs),
						source: bitTorrentTrackerScrapeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bitTorrentTrackerScrapeTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bitTorrentTrackerScrapeTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitTorrentTrackerScrapeTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
