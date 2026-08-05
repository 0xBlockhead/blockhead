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
	}: EntityListViewProps<EntityType.AaveReserve> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AaveReserve}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				name: true,
			},
		})
	}
>
	{#snippet Item({ item: aaveReserve })}
		{@const aaveReserveSelector = aaveReserve[EntityMetaKey.Selector]}
		{@const network = aaveReserveSelector.$market.$network}
		<EntityView
			entityType={EntityType.AaveReserve}
			entitySelector={aaveReserveSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/aave-market/[poolAddress=evmAddress]/(aaveMarket)/reserve/[underlyingTokenAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						poolAddress: aaveReserveSelector.$market.poolAddress,
						underlyingTokenAddress: aaveReserveSelector.underlyingTokenAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{aaveReserve.symbol || 'Aave reserve'}
			{/snippet}

			{#snippet Value()}
				{aaveReserve.name}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
