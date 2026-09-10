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
	}: EntityListViewProps<EntityType.PendlePosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PendlePosition}
	bind:open
	resource={
		selection({
			fields: {
				$market: true,
				ptBalance: true,
				ytBalance: true,
				syBalance: true,
				lpBalance: true,
			},
		})
	}
>
	{#snippet Item({ item: pendlePosition })}
		{@const pendlePositionSelector = pendlePosition[EntityMetaKey.Selector]}
		{@const market = pendlePositionSelector.$market}
		<EntityView
			entityType={EntityType.PendlePosition}
			entitySelector={pendlePositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pendle/market/[marketAddress=evmAddress]/(pendleMarket)/position/[accountAddress=evmAddress]',
					{
						network: (
							'caip2' in market.$network ?
								caip2StringFromValue(market.$network.caip2)
							:
								market.$network.slug
						),
						marketAddress: market.marketAddress,
						accountAddress: pendlePositionSelector.$account.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{pendlePosition.$market.name || 'Pendle market'}
			{/snippet}

			{#snippet Value()}
				{[(pendlePosition.ptBalance ?? ''), (pendlePosition.ytBalance ?? ''), (pendlePosition.syBalance ?? ''), (pendlePosition.lpBalance ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
