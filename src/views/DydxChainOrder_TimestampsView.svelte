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
		title = 'dYdX chain order observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainOrder_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainOrder_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: dydxChainOrderTimestamp })}
		{@const dydxChainOrderTimestampSelector = dydxChainOrderTimestamp[EntityMetaKey.Selector]}
		{@const order = dydxChainOrderTimestampSelector.$order}
		<EntityView
			entityType={EntityType.DydxChainOrder_Timestamp}
			entitySelector={dydxChainOrderTimestampSelector}
			href={
				'caip2' in order.$subaccount.$account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/order/[orderId=stringSegment]/(dydxChainOrder)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: String(order.$subaccount.$account.$network.caip2),
							accountAddress: order.$subaccount.$account.address,
							subaccountNumber: String(order.$subaccount.subaccountNumber),
							orderId: order.orderId,
							timestampMs: String(dydxChainOrderTimestampSelector.timestampMs),
							source: dydxChainOrderTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{dydxChainOrderTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainOrderTimestamp.status ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
