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
	}: EntityListViewProps<EntityType.StellarOffer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarOffer}
	bind:open
	resource={
		selection({
			...{
				fields: {
					offerId: true,
					$seller: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: stellarOffer })}
		{@const stellarOfferSelector = stellarOffer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarOffer}
			entitySelector={stellarOfferSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/offer/[offerId=stringSegment]',
					{
						network: (
							'caip2' in stellarOfferSelector.$network.$network ?
								caip2StringFromValue(stellarOfferSelector.$network.$network.caip2)
							:
								stellarOfferSelector.$network.$network.slug
						),
						offerId: stellarOfferSelector.offerId,
					}
				)
			}
		>
			{#snippet Title()}
				{stellarOfferSelector.offerId || 'stellar offer'}
			{/snippet}

			{#snippet Value()}
				{stellarOffer.$seller == null ? '' : 'stellar account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
