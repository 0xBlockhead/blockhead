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
		title = 'dYdX chain orders',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainOrder> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainOrder}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				orderId: true,
				side: true,
				orderType: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainOrder })}
		{@const dydxChainOrderSelector = dydxChainOrder[EntityMetaKey.Selector]}
		{@const subaccount = dydxChainOrderSelector.$subaccount}
		<EntityView
			entityType={EntityType.DydxChainOrder}
			entitySelector={dydxChainOrderSelector}
			href={
				'caip2' in subaccount.$account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/order/[orderId=stringSegment]',
						{
							network: String(subaccount.$account.$network.caip2),
							accountAddress: subaccount.$account.address,
							subaccountNumber: String(subaccount.subaccountNumber),
							orderId: dydxChainOrderSelector.orderId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{dydxChainOrderSelector.orderId || 'dydx chain order'}
			{/snippet}

			{#snippet Value()}
				{dydxChainOrder.side ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{dydxChainOrder.orderType ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
