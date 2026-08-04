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
		id = 'CardanoAddresses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CardanoAddress> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoAddress}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				addressKind: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoAddress })}
		{@const cardanoAddressSelector = cardanoAddress[EntityMetaKey.Selector]}
		{@const network = cardanoAddressSelector.$network}
		<EntityView
			entityType={EntityType.CardanoAddress}
			entitySelector={cardanoAddressSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: cardanoAddressSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{cardanoAddressSelector.address || 'Cardano address'}
			{/snippet}

			{#snippet Value()}
				{cardanoAddress.addressKind ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
