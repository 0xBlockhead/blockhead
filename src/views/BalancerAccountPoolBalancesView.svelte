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
	}: EntityListViewProps<EntityType.BalancerAccountPoolBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerAccountPoolBalance}
	bind:open
	resource={
		selection({
			fields: {
				$pool: true,
				totalBalance: true,
				totalBalanceUsd: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerAccountPoolBalance })}
		{@const balancerAccountPoolBalanceSelector = balancerAccountPoolBalance[EntityMetaKey.Selector]}
		{@const pool = balancerAccountPoolBalanceSelector.$pool}
		<EntityView
			entityType={EntityType.BalancerAccountPoolBalance}
			entitySelector={balancerAccountPoolBalanceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/balance/[accountAddress=evmAddress]',
					{
						network: (
							pool.$network.caip2 !== undefined ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolId: pool.poolId,
						accountAddress: balancerAccountPoolBalanceSelector.$account.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{balancerAccountPoolBalance.$pool.name || 'Balancer pool'}
			{/snippet}

			{#snippet Value()}
				{[balancerAccountPoolBalance.totalBalance, String(balancerAccountPoolBalance.totalBalanceUsd)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerAccountPoolBalanceSelector.$account.$actor.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
