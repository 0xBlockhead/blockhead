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
		<EntityView
			entityType={EntityType.PythPriceFeed_Timestamp}
			entitySelector={pythPriceFeedTimestampSelector}
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
