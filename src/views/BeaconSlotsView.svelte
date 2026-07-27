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
		title = 'Slots',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconSlot> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconSlot}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				$epoch: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconSlot })}
		{@const beaconSlotSelector = beaconSlot[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconSlot}
			entitySelector={beaconSlotSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]',
					{
						network: (
							'caip2' in beaconSlotSelector.$network ?
								String(caip2StringFromValue(beaconSlotSelector.$network.caip2))
							:
								String(beaconSlotSelector.$network.slug)
						),
						slot: String(beaconSlotSelector.slot),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(beaconSlotSelector.slot ?? '') ? 'Slot #' + String(beaconSlotSelector.slot ?? '') : '') || 'beacon slot'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(String(beaconSlot.$epoch.epoch ?? '') ? 'Epoch #' + String(beaconSlot.$epoch.epoch ?? '') : '') || 'beacon epoch'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
