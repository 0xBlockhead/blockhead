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
	}: EntityListViewProps<EntityType.AaveMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AaveMarket}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$icon: true,
					name: true,
					totalMarketSize: true,
					totalAvailableLiquidity: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aaveMarket })}
		{@const aaveMarketSelector = aaveMarket[EntityMetaKey.Selector]}
		{@const network = aaveMarketSelector.$network}
		<EntityView
			entityType={EntityType.AaveMarket}
			entitySelector={aaveMarketSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/aave-market/[poolAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						poolAddress: aaveMarketSelector.poolAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{aaveMarket.name || 'Aave market'}
			{/snippet}

			{#snippet Value()}
				{[(aaveMarket.totalMarketSize ?? ''), (aaveMarket.totalAvailableLiquidity ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aaveMarket.$network.name || (aaveMarket.$network.caip2 == null ? '' : `${aaveMarket.$network.caip2.namespace}:${aaveMarket.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
