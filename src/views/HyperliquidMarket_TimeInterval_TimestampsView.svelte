<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.HyperliquidMarket_TimeInterval_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidMarketTimeIntervalTimestamp })}
		<EntityView
			entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
			entitySelector={hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid market time interval timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
