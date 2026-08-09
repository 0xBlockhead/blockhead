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
			...{
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
			},
		})
	}
>
	{#snippet Item({ item: filecoinSectorTimestamp })}
		{@const filecoinSectorTimestampSelector = filecoinSectorTimestamp[EntityMetaKey.Selector]}
		{@const sector = filecoinSectorTimestampSelector.$sector}
		<EntityView
			entityType={EntityType.FilecoinSector_Timestamp}
			entitySelector={filecoinSectorTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/sector/[sectorNumber=nonNegativeBigInt]/(filecoinSector)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in sector.$miner.$network ?
								caip2StringFromValue(sector.$miner.$network.caip2)
							:
								sector.$miner.$network.slug
						),
						minerAddress: sector.$miner.minerAddress,
						sectorNumber: String(sector.sectorNumber),
						timestampMs: String(filecoinSectorTimestampSelector.timestampMs),
						source: filecoinSectorTimestampSelector.source,
					}
				)
			}
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
