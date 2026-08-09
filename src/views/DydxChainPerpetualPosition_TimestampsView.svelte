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
		title = 'dYdX chain perpetual position observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainPerpetualPosition_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					side: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: dydxChainPerpetualPositionTimestamp })}
		{@const dydxChainPerpetualPositionTimestampSelector = dydxChainPerpetualPositionTimestamp[EntityMetaKey.Selector]}
		{@const subaccount = dydxChainPerpetualPositionTimestampSelector.$subaccount}
		<EntityView
			entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
			entitySelector={dydxChainPerpetualPositionTimestampSelector}
			href={
				'caip2' in subaccount.$account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/market/[ticker=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: String(subaccount.$account.$network.caip2),
							accountAddress: subaccount.$account.address,
							subaccountNumber: String(subaccount.subaccountNumber),
							ticker: dydxChainPerpetualPositionTimestampSelector.$market.ticker,
							timestampMs: String(dydxChainPerpetualPositionTimestampSelector.timestampMs),
							source: dydxChainPerpetualPositionTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{dydxChainPerpetualPositionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainPerpetualPositionTimestamp.side ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
