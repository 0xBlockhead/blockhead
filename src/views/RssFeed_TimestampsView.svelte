<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.RssFeed_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssFeed_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$feed: {
					fields: {
						title: true,
						lastBuildDate: true,
					},
				},
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: rssFeedTimestamp })}
		{@const rssFeedTimestampSelector = rssFeedTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RssFeed_Timestamp}
			entitySelector={rssFeedTimestampSelector}
			href={
				resolve(
					'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						feedUrl: encodeURIComponent(rssFeedTimestampSelector.$feed.feedUrl),
						timestampMs: String(rssFeedTimestampSelector.timestampMs),
						source: rssFeedTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(rssFeedTimestamp.$feed.title ?? ''), rssFeedTimestampSelector.$feed.feedUrl].filter(Boolean).join(' ') || 'RSS feed'}
			{/snippet}

			{#snippet Value()}
				{rssFeedTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
