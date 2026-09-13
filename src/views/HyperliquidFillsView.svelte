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
	}: EntityListViewProps<EntityType.HyperliquidFill> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidFill}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidFill })}
		{@const hyperliquidFillSelector = hyperliquidFill[EntityMetaKey.Selector]}
		{@const account = hyperliquidFillSelector.$account}
		<EntityView
			entityType={EntityType.HyperliquidFill}
			entitySelector={hyperliquidFillSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/fill/[tid=nonNegativeBigInt]',
					{
						network: (
							account.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.address,
						tid: String(hyperliquidFillSelector.tid),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
