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
	}: EntityListViewProps<EntityType.KaspaAddress_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAddress_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAddressTimestamp })}
		{@const kaspaAddressTimestampSelector = kaspaAddressTimestamp[EntityMetaKey.Selector]}
		{@const address = kaspaAddressTimestampSelector.$address}
		<EntityView
			entityType={EntityType.KaspaAddress_Timestamp}
			entitySelector={kaspaAddressTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							address.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(address.$network.$network.caip2)
							:
								address.$network.$network.slug
						),
						address: address.address,
						timestampMs: String(kaspaAddressTimestampSelector.timestampMs),
						source: kaspaAddressTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
