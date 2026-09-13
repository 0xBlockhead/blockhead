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
		{@const network = eigenLayerStrategySelector.$network}
		<EntityView
			entityType={EntityType.EigenLayerStrategy}
			entitySelector={eigenLayerStrategySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/strategy/[strategyAddress=evmAddress]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						strategyAddress: eigenLayerStrategySelector.strategyAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerStrategySelector.strategyAddress || 'eigen layer strategy'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerStrategy.underlyingToken ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerStrategy.$network.name || (eigenLayerStrategy.$network.caip2 == null ? '' : `${eigenLayerStrategy.$network.caip2.namespace}:${eigenLayerStrategy.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
