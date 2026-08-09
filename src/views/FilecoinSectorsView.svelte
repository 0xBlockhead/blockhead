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
			...{
				fields: {
					sectorNumber: true,
					$miner: true,
					sealedCid: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: filecoinSector })}
		{@const filecoinSectorSelector = filecoinSector[EntityMetaKey.Selector]}
		{@const miner = filecoinSectorSelector.$miner}
		<EntityView
			entityType={EntityType.FilecoinSector}
			entitySelector={filecoinSectorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/sector/[sectorNumber=nonNegativeBigInt]',
					{
						network: (
							'caip2' in miner.$network ?
								caip2StringFromValue(miner.$network.caip2)
							:
								miner.$network.slug
						),
						minerAddress: miner.minerAddress,
						sectorNumber: String(filecoinSectorSelector.sectorNumber),
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinSectorSelector.sectorNumber}
			{/snippet}

			{#snippet Value()}
				{filecoinSectorSelector.$miner.minerAddress || 'filecoin miner'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinSector.sealedCid ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
