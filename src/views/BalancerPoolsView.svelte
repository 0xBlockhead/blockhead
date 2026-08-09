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
			...{
				fields: {
					name: true,
					poolType: true,
					totalLiquidity: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: balancerPool })}
		{@const balancerPoolSelector = balancerPool[EntityMetaKey.Selector]}
		{@const network = balancerPoolSelector.$network}
		<EntityView
			entityType={EntityType.BalancerPool}
			entitySelector={balancerPoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						poolId: balancerPoolSelector.poolId,
					}
				)
			}
		>
			{#snippet Title()}
				{balancerPool.name || 'Balancer pool'}
			{/snippet}

			{#snippet Value()}
				{[balancerPool.poolType, (balancerPool.totalLiquidity ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerPool.$network.name || `${balancerPool.$network.caip2.namespace}:${balancerPool.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
