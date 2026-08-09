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
	}: EntityListViewProps<EntityType.HyperliquidOrder_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidOrder_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidOrderTimestamp })}
		{@const hyperliquidOrderTimestampSelector = hyperliquidOrderTimestamp[EntityMetaKey.Selector]}
		{@const order = hyperliquidOrderTimestampSelector.$order}
		<EntityView
			entityType={EntityType.HyperliquidOrder_Timestamp}
			entitySelector={hyperliquidOrderTimestampSelector}
			href={
				'cloid' in order ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/order/client/[cloid=stringSegment]/(hyperliquidOrder)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: (
								'caip2' in order.$account.$network ?
									caip2StringFromValue(order.$account.$network.caip2)
								:
									order.$account.$network.slug
							),
							accountId: order.$account.address,
							cloid: order.cloid,
							timestampMs: String(hyperliquidOrderTimestampSelector.timestampMs),
							source: hyperliquidOrderTimestampSelector.source,
						}
					)
				:
					undefined
			}
		/>
	{/snippet}
</EntitiesList>
