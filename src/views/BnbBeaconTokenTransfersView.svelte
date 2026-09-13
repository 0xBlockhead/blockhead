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
	}: EntityListViewProps<EntityType.BnbBeaconTokenTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconTokenTransfer}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				amount: true,
				$transaction: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconTokenTransfer })}
		{@const bnbBeaconTokenTransferSelector = bnbBeaconTokenTransfer[EntityMetaKey.Selector]}
		{@const transaction = bnbBeaconTokenTransferSelector.$transaction}
		<EntityView
			entityType={EntityType.BnbBeaconTokenTransfer}
			entitySelector={bnbBeaconTokenTransferSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/transaction/[txHash=stringSegment]/(bnbBeaconTransaction)/transfer/[transferIndex=nonNegativeInteger]',
					{
						network: (
							transaction.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						txHash: transaction.txHash,
						transferIndex: String(bnbBeaconTokenTransferSelector.transferIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{bnbBeaconTokenTransfer.symbol || 'bnb beacon token transfer'}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconTokenTransfer.amount}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconTokenTransferSelector.$transaction.txHash || 'bnb beacon transaction'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
