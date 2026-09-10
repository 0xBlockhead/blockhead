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
	}: EntityListViewProps<EntityType.FilecoinMiner_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMiner_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				qualityAdjustedPower: true,
				height: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMinerTimestamp })}
		{@const filecoinMinerTimestampSelector = filecoinMinerTimestamp[EntityMetaKey.Selector]}
		{@const miner = filecoinMinerTimestampSelector.$miner}
		<EntityView
			entityType={EntityType.FilecoinMiner_Timestamp}
			entitySelector={filecoinMinerTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in miner.$network ?
								caip2StringFromValue(miner.$network.caip2)
							:
								miner.$network.slug
						),
						minerAddress: miner.minerAddress,
						height: String(filecoinMinerTimestampSelector.height),
						tipsetKey: filecoinMinerTimestampSelector.tipsetKey,
						source: filecoinMinerTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinMinerTimestamp.timestampMs}
			{/snippet}

			{#snippet Value()}
				{filecoinMinerTimestamp.qualityAdjustedPower ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMinerTimestampSelector.height}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
