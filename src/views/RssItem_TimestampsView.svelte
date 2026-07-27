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
	}: EntityListViewProps<EntityType.RssItem_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssItem_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$item: {
					fields: {
						title: true,
						publishedAt: true,
					},
				},
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: rssItemTimestamp })}
		{@const rssItemTimestampSelector = rssItemTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RssItem_Timestamp}
			entitySelector={rssItemTimestampSelector}
			href={
				resolve(
					'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						feedUrl: encodeURIComponent(String(rssItemTimestampSelector.$item.$feed.feedUrl)),
						itemIdentityKind: String(rssItemTimestampSelector.$item.itemIdentityKind),
						itemIdentity: encodeURIComponent(String(rssItemTimestampSelector.$item.itemIdentity)),
						timestampMs: String(rssItemTimestampSelector.timestampMs),
						source: String(rssItemTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{[(rssItemTimestamp.$item.title ?? ''), rssItemTimestampSelector.$item.itemIdentity].filter(Boolean).join(' ') || 'RSS item'}
			{/snippet}

			{#snippet Value()}
				{String(rssItemTimestampSelector.timestampMs)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
