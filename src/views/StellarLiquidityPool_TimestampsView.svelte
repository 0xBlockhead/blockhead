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
	}: EntityListViewProps<EntityType.StellarLiquidityPool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarLiquidityPool_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarLiquidityPoolTimestamp })}
		<EntityView
			entityType={EntityType.StellarLiquidityPool_Timestamp}
			entitySelector={stellarLiquidityPoolTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar liquidity pool timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
