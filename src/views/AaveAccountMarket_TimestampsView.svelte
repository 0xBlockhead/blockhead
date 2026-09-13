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
	}: EntityListViewProps<EntityType.AaveAccountMarket_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AaveAccountMarket_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				healthFactor: true,
				ltv: true,
				totalCollateralBase: true,
				totalDebtBase: true,
			},
		})
	}
>
	{#snippet Item({ item: aaveAccountMarketTimestamp })}
		{@const aaveAccountMarketTimestampSelector = aaveAccountMarketTimestamp[EntityMetaKey.Selector]}
		{@const accountMarket = aaveAccountMarketTimestampSelector.$accountMarket}
		<EntityView
			entityType={EntityType.AaveAccountMarket_Timestamp}
			entitySelector={aaveAccountMarketTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]/(aaveAccountMarket)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							accountMarket.$account.$network.caip2 !== undefined ?
								caip2StringFromValue(accountMarket.$account.$network.caip2)
							:
								accountMarket.$account.$network.slug
						),
						accountId: accountMarket.$account.$actor.address,
						poolAddress: accountMarket.$market.poolAddress,
						timestampMs: String(aaveAccountMarketTimestampSelector.timestampMs),
						source: aaveAccountMarketTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{aaveAccountMarketTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(aaveAccountMarketTimestamp.healthFactor ?? ''), aaveAccountMarketTimestamp.ltv, aaveAccountMarketTimestamp.totalCollateralBase, aaveAccountMarketTimestamp.totalDebtBase].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
