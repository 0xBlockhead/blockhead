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
		{@const stellarLiquidityPoolTimestampSelector = stellarLiquidityPoolTimestamp[EntityMetaKey.Selector]}
		{@const liquidityPool = stellarLiquidityPoolTimestampSelector.$liquidityPool}
		<EntityView
			entityType={EntityType.StellarLiquidityPool_Timestamp}
			entitySelector={stellarLiquidityPoolTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/liquidity-pool/[liquidityPoolId=stringSegment]/(stellarLiquidityPool)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							liquidityPool.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(liquidityPool.$network.$network.caip2)
							:
								liquidityPool.$network.$network.slug
						),
						liquidityPoolId: liquidityPool.liquidityPoolId,
						timestampMs: String(stellarLiquidityPoolTimestampSelector.timestampMs),
						source: stellarLiquidityPoolTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
