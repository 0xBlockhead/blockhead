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
	}: EntityListViewProps<EntityType.BeaconBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconBlock}
	bind:open
	resource={
		selection({
			...{
				fields: {
					root: true,
					version: true,
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
	{#snippet Item({ item: beaconBlock })}
		{@const beaconBlockSelector = beaconBlock[EntityMetaKey.Selector]}
		{@const network = beaconBlockSelector.$network}
		<EntityView
			entityType={EntityType.BeaconBlock}
			entitySelector={beaconBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						root: beaconBlockSelector.root,
					}
				)
			}
		>
			{#snippet Title()}
				{beaconBlockSelector.root || 'beacon block'}
			{/snippet}

			{#snippet Value()}
				{beaconBlock.version}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{`Slot #${beaconBlock.$slot.slot}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
