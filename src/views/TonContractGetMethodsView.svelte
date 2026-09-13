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
	}: EntityListViewProps<EntityType.TonContractGetMethod> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonContractGetMethod}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonContractGetMethod })}
		{@const tonContractGetMethodSelector = tonContractGetMethod[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TonContractGetMethod}
			entitySelector={tonContractGetMethodSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract/(tonContract)/method/[methodName=stringSegment]',
					{
						network: (
							tonContractGetMethodSelector.$contract.$account.$network.caip2 !== undefined ?
								caip2StringFromValue(tonContractGetMethodSelector.$contract.$account.$network.caip2)
							:
								tonContractGetMethodSelector.$contract.$account.$network.slug
						),
						accountId: tonContractGetMethodSelector.$contract.$account.address,
						methodName: tonContractGetMethodSelector.methodName,
					}
				)
			}
		>
			{#snippet Title()}
				TON contract get method
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
