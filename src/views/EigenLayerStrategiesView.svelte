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
		id = 'EigenLayerStrategies-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EigenLayerStrategy> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerStrategy}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				strategyAddress: true,
				underlyingToken: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerStrategy })}
		{@const eigenLayerStrategySelector = eigenLayerStrategy[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EigenLayerStrategy}
			entitySelector={eigenLayerStrategySelector}
		>
			{#snippet Title()}
				{eigenLayerStrategySelector.strategyAddress || 'eigen layer strategy'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerStrategy.underlyingToken ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerStrategy.$network.name || (eigenLayerStrategySelector.$network.caip2 == null ? '' : `${eigenLayerStrategySelector.$network.caip2.namespace}:${eigenLayerStrategySelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
