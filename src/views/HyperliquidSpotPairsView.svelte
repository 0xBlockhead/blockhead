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
	}: EntityListViewProps<EntityType.HyperliquidSpotPair> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidSpotPair}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidSpotPair })}
		{@const hyperliquidSpotPairSelector = hyperliquidSpotPair[EntityMetaKey.Selector]}
		{@const network = hyperliquidSpotPairSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidSpotPair}
			entitySelector={hyperliquidSpotPairSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/spot-pair/[pairIndex=nonNegativeInteger]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						pairIndex: String(hyperliquidSpotPairSelector.pairIndex),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
