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
			...{
				fields: {
					transferId: true,
					source: true,
					railId: true,
				},
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
				'source' in bridgeTransferSelector
				&& 'logIndex' in bridgeTransferSelector
				&& '$sourceTx' in bridgeTransferSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/bridge-transfer/[source=stringSegment]/[logIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in sourceTx.$network ?
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
					'originChainId' in bridgeTransferSelector
					&& 'depositId' in bridgeTransferSelector ?
						resolve(
							'/~/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]',
							{
								originChainId: String(bridgeTransferSelector.originChainId),
								depositId: String(bridgeTransferSelector.depositId),
							}
						)
					:
						'source' in bridgeTransferSelector
						&& 'transferId' in bridgeTransferSelector ?
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
