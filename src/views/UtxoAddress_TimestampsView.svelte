<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.UtxoAddress_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoAddress_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				balanceSats: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: utxoAddressTimestamp })}
		{@const utxoAddressTimestampSelector = utxoAddressTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UtxoAddress_Timestamp}
			entitySelector={utxoAddressTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in utxoAddressTimestampSelector.$address.$network ?
								String(caip2StringFromValue(utxoAddressTimestampSelector.$address.$network.caip2))
							:
								String(utxoAddressTimestampSelector.$address.$network.slug)
						),
						address: String(utxoAddressTimestampSelector.$address.address),
						timestampMs: String(utxoAddressTimestampSelector.timestampMs),
						source: String(utxoAddressTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{String(utxoAddressTimestampSelector.timestampMs) || 'UTXO address timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(utxoAddressTimestamp.balanceSats ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{utxoAddressTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
