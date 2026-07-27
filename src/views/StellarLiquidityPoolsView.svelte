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
	}: EntityListViewProps<EntityType.StellarLiquidityPool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarLiquidityPool}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarLiquidityPool })}
		<EntityView
			entityType={EntityType.StellarLiquidityPool}
			entitySelector={stellarLiquidityPool[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar liquidity pool
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
