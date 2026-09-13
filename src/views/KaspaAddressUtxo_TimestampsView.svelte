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
	}: EntityListViewProps<EntityType.KaspaAddressUtxo_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAddressUtxo_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAddressUtxoTimestamp })}
		{@const kaspaAddressUtxoTimestampSelector = kaspaAddressUtxoTimestamp[EntityMetaKey.Selector]}
		{@const address = kaspaAddressUtxoTimestampSelector.$address}
		<EntityView
			entityType={EntityType.KaspaAddressUtxo_Timestamp}
			entitySelector={kaspaAddressUtxoTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/utxo/[outpointTransactionId=stringSegment]/[outpointIndex=nonNegativeInteger]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							address.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(address.$network.$network.caip2)
							:
								address.$network.$network.slug
						),
						address: address.address,
						outpointTransactionId: kaspaAddressUtxoTimestampSelector.outpointTransactionId,
						outpointIndex: String(kaspaAddressUtxoTimestampSelector.outpointIndex),
						timestampMs: String(kaspaAddressUtxoTimestampSelector.timestampMs),
						source: kaspaAddressUtxoTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
