<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FilecoinSector> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinSector}
	bind:open
	resource={
		selection({
			fields: {
				sectorNumber: true,
				$miner: true,
				sealedCid: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinSector })}
		{@const filecoinSectorSelector = filecoinSector[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinSector}
			entitySelector={filecoinSectorSelector}
		>
			{#snippet Title()}
				{String(filecoinSectorSelector.sectorNumber) || 'filecoin sector'}
			{/snippet}

			{#snippet Value()}
				{filecoinSectorSelector.$miner.minerAddress || 'filecoin miner'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(filecoinSector.sealedCid ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
