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
		{@const network = beaconEpochSelector.$network}
		<EntityView
			entityType={EntityType.BeaconEpoch}
			entitySelector={beaconEpochSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						epoch: String(beaconEpochSelector.epoch),
					}
				)
			}
		>
			{#snippet Title()}
				{`Epoch #${beaconEpochSelector.epoch}`}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
