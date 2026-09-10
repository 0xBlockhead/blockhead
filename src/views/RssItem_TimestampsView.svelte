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
		>
			{#snippet Title()}
				{[(rssItemTimestamp.$item.title ?? ''), rssItemTimestampSelector.$item.itemIdentity].filter(Boolean).join(' ') || 'RSS item'}
			{/snippet}

			{#snippet Value()}
				{rssItemTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
