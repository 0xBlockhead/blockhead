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
		title = 'Epochs',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconEpoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconEpoch}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				epoch: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconEpoch })}
		{@const beaconEpochSelector = beaconEpoch[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconEpoch}
			entitySelector={beaconEpochSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]',
					{
						network: (
							'caip2' in beaconEpochSelector.$network ?
								String(caip2StringFromValue(beaconEpochSelector.$network.caip2))
							:
								String(beaconEpochSelector.$network.slug)
						),
						epoch: String(beaconEpochSelector.epoch),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(beaconEpochSelector.epoch ?? '') ? 'Epoch #' + String(beaconEpochSelector.epoch ?? '') : '') || 'beacon epoch'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
