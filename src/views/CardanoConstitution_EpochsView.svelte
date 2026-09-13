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
	}: EntityListViewProps<EntityType.CardanoConstitution_Epoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoConstitution_Epoch}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoConstitutionEpoch })}
		{@const cardanoConstitutionEpochSelector = cardanoConstitutionEpoch[EntityMetaKey.Selector]}
		{@const network = cardanoConstitutionEpochSelector.$network}
		<EntityView
			entityType={EntityType.CardanoConstitution_Epoch}
			entitySelector={cardanoConstitutionEpochSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/constitution/[epoch=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						epoch: String(cardanoConstitutionEpochSelector.epoch),
						source: cardanoConstitutionEpochSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Cardano constitution epoch
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
