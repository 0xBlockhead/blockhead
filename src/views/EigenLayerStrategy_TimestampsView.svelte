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
	}: EntityListViewProps<EntityType.EigenLayerStrategy_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerStrategy_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$strategy: true,
					timestampMs: true,
					totalShares: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerStrategyTimestamp })}
		{@const eigenLayerStrategyTimestampSelector = eigenLayerStrategyTimestamp[EntityMetaKey.Selector]}
		{@const strategy = eigenLayerStrategyTimestampSelector.$strategy}
		<EntityView
			entityType={EntityType.EigenLayerStrategy_Timestamp}
			entitySelector={eigenLayerStrategyTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/strategy/[strategyAddress=evmAddress]/(eigenLayerStrategy)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in strategy.$network ?
								caip2StringFromValue(strategy.$network.caip2)
							:
								strategy.$network.slug
						),
						strategyAddress: strategy.strategyAddress,
						timestampMs: String(eigenLayerStrategyTimestampSelector.timestampMs),
						source: eigenLayerStrategyTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerStrategyTimestampSelector.$strategy.strategyAddress || 'eigen layer strategy'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerStrategyTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerStrategyTimestamp.totalShares ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
