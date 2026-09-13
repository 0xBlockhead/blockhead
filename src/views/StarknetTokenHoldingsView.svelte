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
	}: EntityListViewProps<EntityType.StarknetTokenHolding> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetTokenHolding}
	bind:open
	resource={
		selection({
			fields: {
				$tokenContract: true,
				$owner: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetTokenHolding })}
		{@const starknetTokenHoldingSelector = starknetTokenHolding[EntityMetaKey.Selector]}
		{@const owner = starknetTokenHoldingSelector.$owner}
		<EntityView
			entityType={EntityType.StarknetTokenHolding}
			entitySelector={starknetTokenHoldingSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/starknet-token/[tokenAddress=stringSegment]',
					{
						network: (
							owner.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(owner.$network.$network.caip2)
							:
								owner.$network.$network.slug
						),
						accountId: owner.address,
						tokenAddress: starknetTokenHoldingSelector.$tokenContract.address,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetTokenHoldingSelector.$tokenContract.address || 'starknet contract'}
			{/snippet}

			{#snippet Value()}
				{starknetTokenHoldingSelector.$owner.address || 'starknet contract'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
