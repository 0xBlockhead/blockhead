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
	}: EntityListViewProps<EntityType.TronWitness_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronWitness_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronWitnessTimestamp })}
		{@const tronWitnessTimestampSelector = tronWitnessTimestamp[EntityMetaKey.Selector]}
		{@const witness = tronWitnessTimestampSelector.$witness}
		<EntityView
			entityType={EntityType.TronWitness_Timestamp}
			entitySelector={tronWitnessTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/witness/[address=stringSegment]/(tronWitness)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in witness.$network ?
								caip2StringFromValue(witness.$network.caip2)
							:
								witness.$network.slug
						),
						address: witness.address,
						timestampMs: String(tronWitnessTimestampSelector.timestampMs),
						source: tronWitnessTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
