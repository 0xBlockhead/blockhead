<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain open perpetual positions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainPerpetualPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainPerpetualPosition}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$market: true,
				$subaccount: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainPerpetualPosition })}
		{@const dydxChainPerpetualPositionSelector = dydxChainPerpetualPosition[EntityMetaKey.Selector]}
		{@const subaccount = dydxChainPerpetualPositionSelector.$subaccount}
		<EntityView
			entityType={EntityType.DydxChainPerpetualPosition}
			entitySelector={dydxChainPerpetualPositionSelector}
			href={
				'caip2' in subaccount.$account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/market/[ticker=stringSegment]',
						{
							network: String(subaccount.$account.$network.caip2),
							accountAddress: subaccount.$account.address,
							subaccountNumber: String(subaccount.subaccountNumber),
							ticker: dydxChainPerpetualPositionSelector.$market.ticker,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{dydxChainPerpetualPositionSelector.$market.ticker || 'dydx chain market'}
			{/snippet}

			{#snippet Value()}
				{dydxChainPerpetualPositionSelector.$subaccount.$account.address || 'Cosmos account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
