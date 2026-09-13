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
	}: EntityListViewProps<EntityType.HederaNetworkExchangeRate_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNetworkExchangeRateTimestamp })}
		{@const hederaNetworkExchangeRateTimestampSelector = hederaNetworkExchangeRateTimestamp[EntityMetaKey.Selector]}
		{@const network = hederaNetworkExchangeRateTimestampSelector.$network}
		<EntityView
			entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
			entitySelector={hederaNetworkExchangeRateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/exchange-rate/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(hederaNetworkExchangeRateTimestampSelector.timestampMs),
						source: hederaNetworkExchangeRateTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
