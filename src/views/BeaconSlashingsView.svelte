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
		title = 'Slashings',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconSlashing> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconSlashing}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInSlot: true,
				kind: true,
				slot: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconSlashing })}
		{@const beaconSlashingSelector = beaconSlashing[EntityMetaKey.Selector]}
		{@const network = beaconSlashingSelector.$network}
		<EntityView
			entityType={EntityType.BeaconSlashing}
			entitySelector={beaconSlashingSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						slot: String(beaconSlashingSelector.slot),
						kind: beaconSlashingSelector.kind,
						index: String(beaconSlashingSelector.indexInSlot),
					}
				)
			}
		>
			{#snippet Title()}
				{`Slashing #${beaconSlashingSelector.indexInSlot}`}
			{/snippet}

			{#snippet Value()}
				{beaconSlashingSelector.kind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{'Slot ' + beaconSlashingSelector.slot}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
