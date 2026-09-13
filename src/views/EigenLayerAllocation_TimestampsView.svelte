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
	}: EntityListViewProps<EntityType.EigenLayerAllocation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerAllocation_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$operator: true,
				$avs: true,
				$strategy: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerAllocationTimestamp })}
		{@const eigenLayerAllocationTimestampSelector = eigenLayerAllocationTimestamp[EntityMetaKey.Selector]}
		{@const operator = eigenLayerAllocationTimestampSelector.$operator}
		<EntityView
			entityType={EntityType.EigenLayerAllocation_Timestamp}
			entitySelector={eigenLayerAllocationTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/avs/[avsAddress=evmAddress]/strategy/[strategyAddress=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							operator.$network.caip2 !== undefined ?
								caip2StringFromValue(operator.$network.caip2)
							:
								operator.$network.slug
						),
						operatorAddress: operator.operatorAddress,
						avsAddress: eigenLayerAllocationTimestampSelector.$avs.avsAddress,
						strategyAddress: eigenLayerAllocationTimestampSelector.$strategy.strategyAddress,
						timestampMs: String(eigenLayerAllocationTimestampSelector.timestampMs),
						source: eigenLayerAllocationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerAllocationTimestampSelector.$operator.operatorAddress || 'eigen layer operator'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerAllocationTimestampSelector.$avs.avsAddress || 'eigen layer avs'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerAllocationTimestampSelector.$strategy.strategyAddress || 'eigen layer strategy'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
