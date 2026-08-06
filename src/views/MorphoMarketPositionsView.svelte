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
	}: EntityListViewProps<EntityType.MorphoMarketPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MorphoMarketPosition}
	bind:open
	resource={
		selection({
			fields: {
				$market: true,
				supplyAssets: true,
				borrowAssets: true,
				collateral: true,
			},
		})
	}
>
	{#snippet Item({ item: morphoMarketPosition })}
		{@const morphoMarketPositionSelector = morphoMarketPosition[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MorphoMarketPosition}
			entitySelector={morphoMarketPositionSelector}
		>
			{#snippet Title()}
				{morphoMarketPositionSelector.$market.marketId || 'Morpho market'}
			{/snippet}

			{#snippet Value()}
				{[morphoMarketPosition.supplyAssets, morphoMarketPosition.borrowAssets, morphoMarketPosition.collateral].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
