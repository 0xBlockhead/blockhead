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
		{@const network = beaconSlotSelector.$network}
		<EntityView
			entityType={EntityType.BeaconSlot}
			entitySelector={beaconSlotSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						slot: String(beaconSlotSelector.slot),
					}
				)
			}
		>
			{#snippet Title()}
				{`Slot #${beaconSlotSelector.slot}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{`Epoch #${beaconSlot.$epoch.epoch}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
