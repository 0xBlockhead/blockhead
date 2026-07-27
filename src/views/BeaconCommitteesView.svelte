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
		title = 'Committees',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconCommittee> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconCommittee}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInSlot: true,
				slot: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconCommittee })}
		{@const beaconCommitteeSelector = beaconCommittee[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconCommittee}
			entitySelector={beaconCommitteeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]',
					{
						network: (
							'caip2' in beaconCommitteeSelector.$network ?
								String(caip2StringFromValue(beaconCommitteeSelector.$network.caip2))
							:
								String(beaconCommitteeSelector.$network.slug)
						),
						slot: String(beaconCommitteeSelector.slot),
						index: String(beaconCommitteeSelector.indexInSlot),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(beaconCommitteeSelector.indexInSlot ?? '') ? 'Committee #' + String(beaconCommitteeSelector.indexInSlot ?? '') : '') || 'beacon committee'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(String(beaconCommitteeSelector.slot) ? 'Slot ' + String(beaconCommitteeSelector.slot) : '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
