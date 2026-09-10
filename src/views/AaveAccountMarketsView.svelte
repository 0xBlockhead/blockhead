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
	}: EntityListViewProps<EntityType.AaveAccountMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AaveAccountMarket}
	bind:open
	resource={
		selection({
			fields: {
				$market: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: aaveAccountMarket })}
		{@const aaveAccountMarketSelector = aaveAccountMarket[EntityMetaKey.Selector]}
		{@const account = aaveAccountMarketSelector.$account}
		<EntityView
			entityType={EntityType.AaveAccountMarket}
			entitySelector={aaveAccountMarketSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.$actor.address,
						poolAddress: aaveAccountMarketSelector.$market.poolAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{aaveAccountMarket.$market.name || 'Aave market'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aaveAccountMarketSelector.$account.$actor.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
