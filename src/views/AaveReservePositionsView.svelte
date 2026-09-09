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
	}: EntityListViewProps<EntityType.AaveReservePosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AaveReservePosition}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				suppliedBalance: true,
				borrowedBalance: true,
			},
		})
	}
>
	{#snippet Item({ item: aaveReservePosition })}
		{@const aaveReservePositionSelector = aaveReservePosition[EntityMetaKey.Selector]}
		{@const account = aaveReservePositionSelector.$account}
		<EntityView
			entityType={EntityType.AaveReservePosition}
			entitySelector={aaveReservePositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]/(aaveAccountMarket)/reserve/[underlyingTokenAddress=evmAddress]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.$actor.address,
						poolAddress: aaveReservePositionSelector.poolAddress,
						underlyingTokenAddress: aaveReservePositionSelector.underlyingTokenAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{aaveReservePosition.symbol || 'Aave reserve position'}
			{/snippet}

			{#snippet Value()}
				{[(aaveReservePosition.suppliedBalance ?? ''), (aaveReservePosition.borrowedBalance ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
