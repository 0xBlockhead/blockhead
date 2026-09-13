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
	}: EntityListViewProps<EntityType.BalancerPoolAprItem> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerPoolAprItem}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				apr: true,
				aprType: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerPoolAprItem })}
		{@const balancerPoolAprItemSelector = balancerPoolAprItem[EntityMetaKey.Selector]}
		{@const pool = balancerPoolAprItemSelector.$pool}
		<EntityView
			entityType={EntityType.BalancerPoolAprItem}
			entitySelector={balancerPoolAprItemSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/apr/[title=stringSegment]/[aprType=stringSegment]',
					{
						network: (
							pool.$network.caip2 !== undefined ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolId: pool.poolId,
						title: balancerPoolAprItemSelector.title,
						aprType: balancerPoolAprItemSelector.aprType,
					}
				)
			}
		>
			{#snippet Title()}
				{balancerPoolAprItemSelector.title || 'Balancer pool APR item'}
			{/snippet}

			{#snippet Value()}
				{balancerPoolAprItem.apr}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerPoolAprItemSelector.aprType}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
