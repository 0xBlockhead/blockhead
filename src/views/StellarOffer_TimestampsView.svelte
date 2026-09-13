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
	}: EntityListViewProps<EntityType.StellarOffer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarOffer_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarOfferTimestamp })}
		{@const stellarOfferTimestampSelector = stellarOfferTimestamp[EntityMetaKey.Selector]}
		{@const offer = stellarOfferTimestampSelector.$offer}
		<EntityView
			entityType={EntityType.StellarOffer_Timestamp}
			entitySelector={stellarOfferTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/offer/[offerId=stringSegment]/(stellarOffer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							offer.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(offer.$network.$network.caip2)
							:
								offer.$network.$network.slug
						),
						offerId: offer.offerId,
						timestampMs: String(stellarOfferTimestampSelector.timestampMs),
						source: stellarOfferTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
