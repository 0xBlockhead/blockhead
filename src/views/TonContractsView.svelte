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
	}: EntityListViewProps<EntityType.TonContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonContract}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonContract })}
		{@const tonContractSelector = tonContract[EntityMetaKey.Selector]}
		{@const account = tonContractSelector.$account}
		<EntityView
			entityType={EntityType.TonContract}
			entitySelector={tonContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.address,
					}
				)
			}
		>
			{#snippet Title()}
				TON contract
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
