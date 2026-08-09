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
	}: EntityListViewProps<EntityType.StellarTrade> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarTrade}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarTrade })}
		{@const stellarTradeSelector = stellarTrade[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarTrade}
			entitySelector={stellarTradeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/trade/[tradeId=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in stellarTradeSelector.$network.$network ?
								caip2StringFromValue(stellarTradeSelector.$network.$network.caip2)
							:
								stellarTradeSelector.$network.$network.slug
						),
						tradeId: stellarTradeSelector.tradeId,
						source: stellarTradeSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
