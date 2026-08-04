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
	}: EntityListViewProps<EntityType.BalancerPool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerPool}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				poolType: true,
				totalLiquidity: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerPool })}
		<EntityView
			entityType={EntityType.BalancerPool}
			entitySelector={balancerPool[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{balancerPool.name || 'Balancer pool'}
			{/snippet}

			{#snippet Value()}
				{[balancerPool.poolType, (balancerPool.totalLiquidity ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerPool.$network.name || (balancerPool.$network.caip2 == null ? '' : `${balancerPool.$network.caip2.namespace}:${balancerPool.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
