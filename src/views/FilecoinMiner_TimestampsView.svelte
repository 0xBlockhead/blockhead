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
		<EntityView
			entityType={EntityType.FilecoinMiner_Timestamp}
			entitySelector={filecoinMinerTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in filecoinMinerTimestampSelector.$miner.$network ?
								String(caip2StringFromValue(filecoinMinerTimestampSelector.$miner.$network.caip2))
							:
								String(filecoinMinerTimestampSelector.$miner.$network.slug)
						),
						minerAddress: String(filecoinMinerTimestampSelector.$miner.minerAddress),
						height: String(filecoinMinerTimestampSelector.height),
						tipsetKey: String(filecoinMinerTimestampSelector.tipsetKey),
						source: String(filecoinMinerTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{String(filecoinMinerTimestamp.timestampMs) || 'filecoin miner timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(filecoinMinerTimestamp.qualityAdjustedPower ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(filecoinMinerTimestampSelector.height)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
