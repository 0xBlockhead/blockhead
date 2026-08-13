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
		title = 'Data columns',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconDataColumn> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconDataColumn}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					columnIndex: true,
					forkVersion: true,
					columnCount: true,
					$slot: {
						fields: {
							$epoch: true,
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconDataColumn })}
		{@const beaconDataColumnSelector = beaconDataColumn[EntityMetaKey.Selector]}
		{@const slot = beaconDataColumnSelector.$slot}
		<EntityView
			entityType={EntityType.BeaconDataColumn}
			entitySelector={beaconDataColumnSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/data-column/[columnIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in slot.$network ?
								caip2StringFromValue(slot.$network.caip2)
							:
								slot.$network.slug
						),
						slot: String(slot.slot),
						columnIndex: String(beaconDataColumnSelector.columnIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{`Data column #${beaconDataColumnSelector.columnIndex}`}
			{/snippet}

			{#snippet Value()}
				{[beaconDataColumn.forkVersion, String(beaconDataColumn.columnCount)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{`Slot #${beaconDataColumnSelector.$slot.slot}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
