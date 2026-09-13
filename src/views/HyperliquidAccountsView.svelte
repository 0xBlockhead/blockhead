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
	}: EntityListViewProps<EntityType.HyperliquidAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidAccount })}
		{@const hyperliquidAccountSelector = hyperliquidAccount[EntityMetaKey.Selector]}
		{@const network = hyperliquidAccountSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidAccount}
			entitySelector={hyperliquidAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: hyperliquidAccountSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
