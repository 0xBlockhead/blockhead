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
	}: EntityListViewProps<EntityType.BalancerPoolToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerPoolToken}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				balance: true,
				weight: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerPoolToken })}
		{@const balancerPoolTokenSelector = balancerPoolToken[EntityMetaKey.Selector]}
		{@const pool = balancerPoolTokenSelector.$pool}
		<EntityView
			entityType={EntityType.BalancerPoolToken}
			entitySelector={balancerPoolTokenSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/token/[index=nonNegativeInteger]',
					{
						network: (
							pool.$network.caip2 !== undefined ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolId: pool.poolId,
						index: String(balancerPoolTokenSelector.tokenIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{balancerPoolToken.symbol || 'Balancer pool reserve token'}
			{/snippet}

			{#snippet Value()}
				{[balancerPoolToken.balance, (balancerPoolToken.weight ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerPoolToken.$pool.name || 'Balancer pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
