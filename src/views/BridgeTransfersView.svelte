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
	}: EntityListViewProps<EntityType.BridgeTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeTransfer}
	bind:open
	resource={
		selection({
			fields: {
				transferId: true,
				source: true,
				railId: true,
			},
		})
	}
>
	{#snippet Item({ item: bridgeTransfer })}
		{@const bridgeTransferSelector = bridgeTransfer[EntityMetaKey.Selector]}
		{@const sourceTx = bridgeTransferSelector.$sourceTx}
		<EntityView
			entityType={EntityType.BridgeTransfer}
			entitySelector={bridgeTransferSelector}
			href={
				bridgeTransferSelector.source !== undefined
				&& bridgeTransferSelector.logIndex !== undefined
				&& sourceTx !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/bridge-transfer/[source=stringSegment]/[logIndex=nonNegativeInteger]',
						{
							network: (
								sourceTx.$network.caip2 !== undefined ?
									caip2StringFromValue(sourceTx.$network.caip2)
								:
									sourceTx.$network.slug
							),
							transactionId: sourceTx.txHash,
							source: bridgeTransferSelector.source,
							logIndex: String(bridgeTransferSelector.logIndex),
						}
					)
				:
					bridgeTransferSelector.originChainId !== undefined
					&& bridgeTransferSelector.depositId !== undefined ?
						resolve(
							'/~/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]',
							{
								originChainId: String(bridgeTransferSelector.originChainId),
								depositId: String(bridgeTransferSelector.depositId),
							}
						)
					:
						bridgeTransferSelector.source !== undefined
						&& bridgeTransferSelector.transferId !== undefined ?
							resolve(
								'/~/bridge/transfer/[source=stringSegment]/[transferId=stringSegment]',
								{
									source: bridgeTransferSelector.source,
									transferId: bridgeTransferSelector.transferId,
								}
							)
						:
							undefined
			}
		>
			{#snippet Title()}
				{bridgeTransfer.transferId || 'bridge transfer'}
			{/snippet}

			{#snippet Value()}
				{[bridgeTransfer.source, (bridgeTransfer.railId ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
