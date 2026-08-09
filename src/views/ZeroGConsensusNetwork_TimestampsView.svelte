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
	}: EntityListViewProps<EntityType.ZeroGConsensusNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$consensusNetwork: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGConsensusNetworkTimestamp })}
		{@const zeroGConsensusNetworkTimestampSelector = zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector]}
		{@const consensusNetwork = zeroGConsensusNetworkTimestampSelector.$consensusNetwork}
		<EntityView
			entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
			entitySelector={zeroGConsensusNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/consensus-network/[consensusNetworkId=stringSegment]/(zeroGConsensusNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in consensusNetwork.$network ?
								caip2StringFromValue(consensusNetwork.$network.caip2)
							:
								consensusNetwork.$network.slug
						),
						consensusNetworkId: consensusNetwork.consensusNetworkId,
						timestampMs: String(zeroGConsensusNetworkTimestampSelector.timestampMs),
						source: zeroGConsensusNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGConsensusNetworkTimestampSelector.$consensusNetwork.consensusNetworkId || 'zero g consensus network'}
			{/snippet}

			{#snippet Value()}
				{zeroGConsensusNetworkTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
