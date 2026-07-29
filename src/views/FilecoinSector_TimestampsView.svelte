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
	}: EntityListViewProps<EntityType.FilecoinSector_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinSector_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				$sector: {
					fields: {
						$miner: true,
						sealedCid: true,
					},
				},
				height: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinSectorTimestamp })}
		{@const filecoinSectorTimestampSelector = filecoinSectorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinSector_Timestamp}
			entitySelector={filecoinSectorTimestampSelector}
		>
			{#snippet Title()}
				{filecoinSectorTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{String(filecoinSectorTimestampSelector.$sector.sectorNumber) || 'filecoin sector'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinSectorTimestamp.height ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
