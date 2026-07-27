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
	}: EntityListViewProps<EntityType.HyperliquidPerpMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidPerpMarket}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidPerpMarket })}
		<EntityView
			entityType={EntityType.HyperliquidPerpMarket}
			entitySelector={hyperliquidPerpMarket[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid perp market
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
