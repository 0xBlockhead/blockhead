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
	}: EntityListViewProps<EntityType.TonContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonContractTimestamp })}
		{@const tonContractTimestampSelector = tonContractTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TonContract_Timestamp}
			entitySelector={tonContractTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract/(tonContract)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							tonContractTimestampSelector.$contract.$account.$network.caip2 !== undefined ?
								caip2StringFromValue(tonContractTimestampSelector.$contract.$account.$network.caip2)
							:
								tonContractTimestampSelector.$contract.$account.$network.slug
						),
						accountId: tonContractTimestampSelector.$contract.$account.address,
						timestampMs: String(tonContractTimestampSelector.timestampMs),
						source: tonContractTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON contract timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
