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
		title = 'dYdX chain subaccount observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainSubaccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainSubaccount_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					$subaccount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: dydxChainSubaccountTimestamp })}
		{@const dydxChainSubaccountTimestampSelector = dydxChainSubaccountTimestamp[EntityMetaKey.Selector]}
		{@const subaccount = dydxChainSubaccountTimestampSelector.$subaccount}
		<EntityView
			entityType={EntityType.DydxChainSubaccount_Timestamp}
			entitySelector={dydxChainSubaccountTimestampSelector}
			href={
				'caip2' in subaccount.$account.$network ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: String(subaccount.$account.$network.caip2),
							accountAddress: subaccount.$account.address,
							subaccountNumber: String(subaccount.subaccountNumber),
							timestampMs: String(dydxChainSubaccountTimestampSelector.timestampMs),
							source: dydxChainSubaccountTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{dydxChainSubaccountTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainSubaccountTimestampSelector.$subaccount.$account.address || 'Cosmos account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
