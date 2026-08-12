import { BridgeAssetOutcome } from '$/constants/Bridge.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { layerZeroEvmChainIdByEndpointId } from '$/sources/LayerZeroScan/Rest/constants.ts'
import type { LayerZeroMessage } from '$/sources/LayerZeroScan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'


const layerZeroEvmNetworkRef = (endpointId: number) => {
	const chainId = layerZeroEvmChainIdByEndpointId[endpointId]
	if (chainId == null)
		throw new Error(`LayerZeroScan_Rest: unmapped endpoint id ${endpointId}`)

	return {
		[EntityMetaKey.Selector]: {
			caip2: {
				namespace: 'eip155' as const,
				reference: String(chainId),
			},
		},
	}
}

const layerZeroEvmAddressRef = (
	address: string,
	role: string
) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error(`LayerZeroScan_Rest: invalid ${role} address`)

	return {
		[EntityMetaKey.Selector]: {
			address: normalized,
		},
	}
}

const layerZeroMessageObservationMs = (updated: string) => {
	const timestampMs = Date.parse(updated)
	if (!Number.isFinite(timestampMs))
		throw new Error('LayerZeroScan_Rest: invalid message updated timestamp')

	return timestampMs
}

const layerZeroExecutorRelayer = (
	message: LayerZeroMessage
) => {
	const candidates: string[] = []
	for (const row of [
		message.config?.inboundConfig,
		message.config?.outboundConfig,
	]) {
		if (row == null)
			continue
		if ('executor' in row && row.executor != null && row.executor !== '')
			candidates.push(row.executor)
		if ('relayerAddress' in row && row.relayerAddress != null && row.relayerAddress !== '')
			candidates.push(row.relayerAddress)
	}
	for (const candidate of candidates) {
		const normalized = hexLowerOfByteSize(candidate, 20)
		if (normalized != null)
			return normalized
	}
}

const layerZeroBridgeTransferSnapshot = (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>,
	message: LayerZeroMessage
) => {
	const fromNetwork = layerZeroEvmNetworkRef(message.pathway.srcEid)
	const toNetwork = layerZeroEvmNetworkRef(message.pathway.dstEid)
	const sourceTxHash = hexLowerOfByteSize(message.source.tx.txHash, 32)
	if (sourceTxHash == null)
		throw new Error('LayerZeroScan_Rest: invalid source transaction hash')

	const destinationTxHash = (
		message.destination?.tx?.txHash == null ?
			undefined
		:
			hexLowerOfByteSize(message.destination.tx.txHash, 32)
	)
	if (message.destination?.tx?.txHash != null && destinationTxHash == null)
		throw new Error('LayerZeroScan_Rest: invalid destination transaction hash')

	const timestampMs = layerZeroMessageObservationMs(message.updated)
	const sourceTransactionAtMs = message.source.tx.blockTimestamp * 1_000
	const destinationTransactionAtMs = message.destination?.tx?.blockTimestamp == null ?
		undefined
	:
		message.destination.tx.blockTimestamp * 1_000
	if (
		destinationTransactionAtMs != null
		&& destinationTransactionAtMs < sourceTransactionAtMs
	)
		throw new Error('LayerZeroScan_Rest: destination transaction precedes source transaction')

	return {
		source: Source.LayerZeroScan_Rest,
		transferId: message.guid.toLowerCase(),
		$sourceTx: {
			[EntityMetaKey.Selector]: {
				$network: fromNetwork[EntityMetaKey.Selector],
				txHash: sourceTxHash,
			},
		},
		...(destinationTxHash != null && {
			$destinationTx: {
				[EntityMetaKey.Selector]: {
					$network: toNetwork[EntityMetaKey.Selector],
					txHash: destinationTxHash,
				},
			},
		}),
		$sender: layerZeroEvmAddressRef(message.pathway.sender.address, 'sender'),
		$recipient: layerZeroEvmAddressRef(message.pathway.receiver.address, 'recipient'),
		$fromNetwork: fromNetwork,
		$toNetwork: toNetwork,
		// Scan message rows are pathway packets; OFT amounts are not a Scan wire field.
		assetOutcome: BridgeAssetOutcome.MessageOnly,
		sourceTransactionAtMs,
		...(destinationTransactionAtMs != null && {
			destinationTransactionAtMs,
			transactionLatencyMs: destinationTransactionAtMs - sourceTransactionAtMs,
		}),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs,
				source: Source.LayerZeroScan_Rest,
			},
		}],
	}
}

const loadLayerZeroMessageByGuid = async (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
) => {
	if (transfer.source !== Source.LayerZeroScan_Rest)
		throw new Error(`LayerZeroScan_Rest: unsupported bridge transfer source ${transfer.source}`)
	if (!('transferId' in transfer))
		throw new Error('LayerZeroScan_Rest: bridge transfer requires SourceTransferId')

	const { getMessageByGuid } = await import('$/sources/LayerZeroScan/Rest/queries.ts')
	const { data } = await getMessageByGuid({
		guid: transfer.transferId,
	})
	if (data.length !== 1)
		throw new Error(`LayerZeroScan_Rest: expected one message for GUID ${transfer.transferId}`)

	return data[0]
}

const layerZeroBridgeTransferObservation = async ({
	$transfer,
	timestampMs,
	source,
}: EntitySelector<typeof schema, EntityType.BridgeTransfer_Timestamp>) => {
	if (source !== Source.LayerZeroScan_Rest)
		throw new Error(`LayerZeroScan_Rest: unsupported bridge transfer timestamp source ${source}`)
	if ($transfer.source !== Source.LayerZeroScan_Rest)
		throw new Error(`LayerZeroScan_Rest: unsupported bridge transfer source ${$transfer.source}`)

	const message = await loadLayerZeroMessageByGuid($transfer)
	const observedAtMs = layerZeroMessageObservationMs(message.updated)
	if (observedAtMs !== timestampMs)
		throw new Error('LayerZeroScan_Rest: observation clock mismatch')

	const destinationTxHash = (
		message.destination?.tx?.txHash == null ?
			undefined
		:
			hexLowerOfByteSize(message.destination.tx.txHash, 32)
	)
	if (message.destination?.tx?.txHash != null && destinationTxHash == null)
		throw new Error('LayerZeroScan_Rest: invalid destination transaction hash')

	const outboundConfig = message.config?.outboundConfig
	const requiredConfirmations = (
		outboundConfig == null ?
			undefined
		: 'confirmations' in outboundConfig ?
			outboundConfig.confirmations
		: 'blockConfirmation' in outboundConfig ?
			outboundConfig.blockConfirmation
		:
			undefined
	)
	const relayer = layerZeroExecutorRelayer(message)

	return {
		$transfer: {
			[EntityMetaKey.Selector]: $transfer,
		},
		timestampMs,
		source,
		status: message.status.name,
		...(message.status.message != null && {
			substatus: message.status.message,
		}),
		...(message.source.tx.blockConfirmations != null && {
			sourceConfirmations: message.source.tx.blockConfirmations,
		}),
		...(requiredConfirmations != null && {
			requiredConfirmations,
		}),
		...(destinationTxHash != null && {
			destinationTxHash,
		}),
		...(relayer != null && {
			relayer,
		}),
		...(message.config?.error && {
			error: message.config.errorMessage ?? message.status.message ?? message.status.name,
		}),
	}
}


export default {
	source: Source.LayerZeroScan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BridgeTransfer,
			resolve: {
				SourceTransferId: {
					resolve: async (transfer) => (
						layerZeroBridgeTransferSnapshot(
							transfer,
							await loadLayerZeroMessageByGuid(transfer)
						)
					),
				},
			},
		})({
			source: (transfer) => transfer.source,
			transferId: (transfer) => transfer.transferId,
			$sourceTx: (transfer) => transfer.$sourceTx,
			$destinationTx: (transfer) => transfer.$destinationTx,
			$sender: (transfer) => transfer.$sender,
			$recipient: (transfer) => transfer.$recipient,
			$fromNetwork: (transfer) => transfer.$fromNetwork,
			$toNetwork: (transfer) => transfer.$toNetwork,
			assetOutcome: (transfer) => transfer.assetOutcome,
			sourceTransactionAtMs: (transfer) => transfer.sourceTransactionAtMs,
			destinationTransactionAtMs: (transfer) => transfer.destinationTransactionAtMs,
			transactionLatencyMs: (transfer) => transfer.transactionLatencyMs,
			$$timestamps: {
				select: (transfer) => transfer.$$timestamps,
				resolveCount: (transfer) => transfer.$$timestamps.length,
			},
		}),

		defineResolver({
			entityType: EntityType.BridgeTransfer_Timestamp,
			resolve: {
				TransferTimestampMsSource: {
					resolve: layerZeroBridgeTransferObservation,
				},
			},
		})({
			$transfer: (observation) => observation.$transfer,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			status: (observation) => observation.status,
			substatus: (observation) => observation.substatus,
			sourceConfirmations: (observation) => observation.sourceConfirmations,
			requiredConfirmations: (observation) => observation.requiredConfirmations,
			destinationTxHash: (observation) => observation.destinationTxHash,
			relayer: (observation) => observation.relayer,
			error: (observation) => observation.error,
		}),
	],
} satisfies RegisteredSourceResolverModule
