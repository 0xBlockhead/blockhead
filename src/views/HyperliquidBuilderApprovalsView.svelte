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
	}: EntityListViewProps<EntityType.HyperliquidBuilderApproval> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidBuilderApproval}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidBuilderApproval })}
		{@const hyperliquidBuilderApprovalSelector = hyperliquidBuilderApproval[EntityMetaKey.Selector]}
		{@const account = hyperliquidBuilderApprovalSelector.$account}
		<EntityView
			entityType={EntityType.HyperliquidBuilderApproval}
			entitySelector={hyperliquidBuilderApprovalSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/builder/[builder=evmAddress]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.address,
						builder: hyperliquidBuilderApprovalSelector.builder,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
