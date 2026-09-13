<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
		{@const stellarLiquidityPoolSelector = stellarLiquidityPool[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarLiquidityPool}
			entitySelector={stellarLiquidityPoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/liquidity-pool/[liquidityPoolId=stringSegment]',
					{
						network: (
							stellarLiquidityPoolSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(stellarLiquidityPoolSelector.$network.$network.caip2)
							:
								stellarLiquidityPoolSelector.$network.$network.slug
						),
						liquidityPoolId: stellarLiquidityPoolSelector.liquidityPoolId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
