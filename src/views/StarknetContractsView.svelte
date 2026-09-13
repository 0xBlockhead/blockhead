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
	}: EntityListViewProps<EntityType.StarknetContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetContract}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetContract })}
		{@const starknetContractSelector = starknetContract[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetContract}
			entitySelector={starknetContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							starknetContractSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(starknetContractSelector.$network.$network.caip2)
							:
								starknetContractSelector.$network.$network.slug
						),
						accountId: starknetContractSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetContractSelector.address || 'starknet contract'}
			{/snippet}

			{#snippet Value()}
				{starknetContract.$network.$network.name || (starknetContract.$network.$network.caip2 == null ? '' : `${starknetContract.$network.$network.caip2.namespace}:${starknetContract.$network.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
