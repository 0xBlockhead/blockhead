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
	}: EntityListViewProps<EntityType.HyperliquidPerpMarket_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidPerpMarket_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$perpMarket: true,
					maxLeverage: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidPerpMarketTimestamp })}
		{@const hyperliquidPerpMarketTimestampSelector = hyperliquidPerpMarketTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HyperliquidPerpMarket_Timestamp}
			entitySelector={hyperliquidPerpMarketTimestampSelector}
		>
			{#snippet Title()}
				{hyperliquidPerpMarketTimestampSelector.$perpMarket.coin || 'hyperliquid perp market'}
			{/snippet}

			{#snippet Value()}
				{hyperliquidPerpMarketTimestamp.maxLeverage ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
