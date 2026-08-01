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
	}: EntityListViewProps<EntityType.EvmNetworkAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkAccount}
	bind:open
	resource={
		selection({
			fields: {
				$actor: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkAccount })}
		{@const evmNetworkAccountSelector = evmNetworkAccount[EntityMetaKey.Selector]}
		{@const network = evmNetworkAccountSelector.$network}
		<EntityView
			entityType={EntityType.EvmNetworkAccount}
			entitySelector={evmNetworkAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: evmNetworkAccountSelector.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{evmNetworkAccountSelector.$actor.address || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{evmNetworkAccount.$network.name || (evmNetworkAccountSelector.$network.caip2 == null ? '' : `${evmNetworkAccountSelector.$network.caip2.namespace}:${evmNetworkAccountSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
