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
	}: EntityListViewProps<EntityType.HyperliquidBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidBalance}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidBalance })}
		{@const hyperliquidBalanceSelector = hyperliquidBalance[EntityMetaKey.Selector]}
		{@const account = hyperliquidBalanceSelector.$account}
		<EntityView
			entityType={EntityType.HyperliquidBalance}
			entitySelector={hyperliquidBalanceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/balance/[tokenIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.address,
						tokenIndex: String(hyperliquidBalanceSelector.tokenIndex),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
