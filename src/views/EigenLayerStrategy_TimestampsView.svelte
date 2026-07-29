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
			fields: {
				$strategy: true,
				timestampMs: true,
				totalShares: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerStrategyTimestamp })}
		{@const eigenLayerStrategyTimestampSelector = eigenLayerStrategyTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EigenLayerStrategy_Timestamp}
			entitySelector={eigenLayerStrategyTimestampSelector}
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
