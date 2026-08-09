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
	}: EntityListViewProps<EntityType.CardanoProtocolParameters_Epoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoProtocolParameters_Epoch}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoProtocolParametersEpoch })}
		{@const cardanoProtocolParametersEpochSelector = cardanoProtocolParametersEpoch[EntityMetaKey.Selector]}
		{@const network = cardanoProtocolParametersEpochSelector.$network}
		<EntityView
			entityType={EntityType.CardanoProtocolParameters_Epoch}
			entitySelector={cardanoProtocolParametersEpochSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/protocol-parameters/[epoch=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						epoch: String(cardanoProtocolParametersEpochSelector.epoch),
						source: cardanoProtocolParametersEpochSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Cardano protocol parameters epoch
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
