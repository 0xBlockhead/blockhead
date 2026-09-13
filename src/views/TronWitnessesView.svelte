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
		id = 'TronWitnesses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TronWitness> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronWitness}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronWitness })}
		{@const tronWitnessSelector = tronWitness[EntityMetaKey.Selector]}
		{@const network = tronWitnessSelector.$network}
		<EntityView
			entityType={EntityType.TronWitness}
			entitySelector={tronWitnessSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/witness/[address=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: tronWitnessSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
