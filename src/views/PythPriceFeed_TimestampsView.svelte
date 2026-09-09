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
	}: EntityListViewProps<EntityType.PythPriceFeed_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PythPriceFeed_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				publishTimeMs: true,
				price: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: pythPriceFeedTimestamp })}
		{@const pythPriceFeedTimestampSelector = pythPriceFeedTimestamp[EntityMetaKey.Selector]}
		{@const feed = pythPriceFeedTimestampSelector.$feed}
		<EntityView
			entityType={EntityType.PythPriceFeed_Timestamp}
			entitySelector={pythPriceFeedTimestampSelector}
			href={
				resolve(
					'/~/pyth/feed/[priceFeedId=zeroExHex]/[channel=stringSegment]/(pythPriceFeed)/observations/[publishTimeMs=nonNegativeInteger]/[source=stringSegment]',
					{
						priceFeedId: feed.priceFeedId,
						channel: feed.channel,
						publishTimeMs: String(pythPriceFeedTimestampSelector.publishTimeMs),
						source: pythPriceFeedTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{pythPriceFeedTimestampSelector.publishTimeMs}
			{/snippet}

			{#snippet Value()}
				{pythPriceFeedTimestamp.price ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{pythPriceFeedTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
