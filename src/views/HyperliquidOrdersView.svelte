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
	}: EntityListViewProps<EntityType.HyperliquidOrder> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidOrder}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidOrder })}
		{@const hyperliquidOrderSelector = hyperliquidOrder[EntityMetaKey.Selector]}
		{@const account = hyperliquidOrderSelector.$account}
		<EntityView
			entityType={EntityType.HyperliquidOrder}
			entitySelector={hyperliquidOrderSelector}
			href={
				'cloid' in hyperliquidOrderSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/order/client/[cloid=stringSegment]',
						{
							network: (
								'caip2' in account.$network ?
									caip2StringFromValue(account.$network.caip2)
								:
									account.$network.slug
							),
							accountId: account.address,
							cloid: hyperliquidOrderSelector.cloid,
						}
					)
				:
					'oid' in hyperliquidOrderSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/order/id/[oid=nonNegativeBigInt]',
							{
								network: (
									'caip2' in account.$network ?
										caip2StringFromValue(account.$network.caip2)
									:
										account.$network.slug
								),
								accountId: account.address,
								oid: String(hyperliquidOrderSelector.oid),
							}
						)
					:
						undefined
			}
		/>
	{/snippet}
</EntitiesList>
