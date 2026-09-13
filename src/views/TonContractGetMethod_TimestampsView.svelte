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
	}: EntityListViewProps<EntityType.TonContractGetMethod_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonContractGetMethod_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonContractGetMethodTimestamp })}
		{@const tonContractGetMethodTimestampSelector = tonContractGetMethodTimestamp[EntityMetaKey.Selector]}
		{@const method = tonContractGetMethodTimestampSelector.$method}
		<EntityView
			entityType={EntityType.TonContractGetMethod_Timestamp}
			entitySelector={tonContractGetMethodTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract/(tonContract)/method/[methodName=stringSegment]/(tonContractGetMethod)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							method.$contract.$account.$network.caip2 !== undefined ?
								caip2StringFromValue(method.$contract.$account.$network.caip2)
							:
								method.$contract.$account.$network.slug
						),
						accountId: method.$contract.$account.address,
						methodName: method.methodName,
						timestampMs: String(tonContractGetMethodTimestampSelector.timestampMs),
						source: tonContractGetMethodTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON contract get method timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
