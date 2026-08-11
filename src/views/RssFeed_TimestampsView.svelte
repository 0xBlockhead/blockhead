<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
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
			...{
				fields: {
					$feed: {
						fields: {
							title: true,
							lastBuildDate: true,
						},
					},
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: rssFeedTimestamp })}
		{@const rssFeedTimestampSelector = rssFeedTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RssFeed_Timestamp}
			entitySelector={rssFeedTimestampSelector}
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
