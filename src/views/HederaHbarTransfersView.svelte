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
	}: EntityListViewProps<EntityType.HederaHbarTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaHbarTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaHbarTransfer })}
		{@const hederaHbarTransferSelector = hederaHbarTransfer[EntityMetaKey.Selector]}
		{@const transaction = hederaHbarTransferSelector.$transaction}
		<EntityView
			entityType={EntityType.HederaHbarTransfer}
			entitySelector={hederaHbarTransferSelector}
			href={
				'consensusTimestamp' in transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/hbar-transfer/[accountId=stringSegment]/[transferIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in transaction.$network ?
									caip2StringFromValue(transaction.$network.caip2)
								:
									transaction.$network.slug
							),
							consensusTimestamp: transaction.consensusTimestamp,
							accountId: hederaHbarTransferSelector.accountId,
							transferIndex: String(hederaHbarTransferSelector.transferIndex),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				hedera HBAR transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
