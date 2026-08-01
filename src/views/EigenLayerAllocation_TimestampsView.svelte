<!-- Generated from APP.ts. -->

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
		<EntityView
			entityType={EntityType.EigenLayerAllocation_Timestamp}
			entitySelector={eigenLayerAllocationTimestampSelector}
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
