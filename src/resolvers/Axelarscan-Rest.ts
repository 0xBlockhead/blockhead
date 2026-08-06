import { BridgeAssetOutcome } from '$/constants/Bridge.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { axelarscanEvmChainIdByChainKey } from '$/sources/Axelarscan/Rest/constants.ts'
import type { AxelarscanGmpMessage } from '$/sources/Axelarscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'


const axelarscanEvmNetworkRef = (chainKey: string) => {
	const chainId = axelarscanEvmChainIdByChainKey[chainKey.toLowerCase()]
	if (chainId == null)
		throw new Error(`Axelarscan_Rest: unmapped EVM chain key ${chainKey}`)

	return {
		[EntityMetaKey.Selector]: {
			caip2: {
				namespace: 'eip155' as const,
				reference: String(chainId),
			},
		},
	}
}

const axelarscanEvmAddressRef = (
	address: string,
	role: string
) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error(`Axelarscan_Rest: invalid ${role} address`)

	return {
		[EntityMetaKey.Selector]: {
			address: normalized,
		},
	}
}

const axelarscanEvmTxHash = (
	value: string,
	role: string
) => {
	const normalized = hexLowerOfByteSize(value, 32)
	if (normalized == null)
		throw new Error(`Axelarscan_Rest: invalid ${role}`)

	return normalized
}

const axelarscanObservationMs = (message: AxelarscanGmpMessage) => (
	(
		message.executed?.block_timestamp
		?? message.approved?.block_timestamp
		?? message.call.block_timestamp
	) * 1_000
)

const axelarscanBridgeTransferSnapshot = (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>,
	message: AxelarscanGmpMessage
) => {
	const fromNetwork = axelarscanEvmNetworkRef(message.call.chain)
	const toNetwork = axelarscanEvmNetworkRef(message.call.returnValues.destinationChain)
	const sourceTxHash = axelarscanEvmTxHash(message.call.transactionHash, 'source transaction hash')
	const destinationTxHash = (
		message.executed == null ?
			undefined
		:
			axelarscanEvmTxHash(message.executed.transactionHash, 'destination transaction hash')
	)
	const timestampMs = axelarscanObservationMs(message)

	return {
		source: Source.Axelarscan_Rest,
		transferId: message.message_id,
		$sourceTx: {
			[EntityMetaKey.Selector]: {
				$network: fromNetwork[EntityMetaKey.Selector],
				txHash: sourceTxHash,
			},
		},
		logIndex: message.call.logIndex,
		...(destinationTxHash != null && {
			$destinationTx: {
				[EntityMetaKey.Selector]: {
					$network: toNetwork[EntityMetaKey.Selector],
					txHash: destinationTxHash,
				},
			},
		}),
		$sender: axelarscanEvmAddressRef(message.call.returnValues.sender, 'sender'),
		$recipient: axelarscanEvmAddressRef(
			message.call.returnValues.destinationContractAddress,
			'recipient'
		),
		$fromNetwork: fromNetwork,
		$toNetwork: toNetwork,
		// GMP search rows are cross-chain messages; token amounts are not a searchGMP wire field.
		assetOutcome: BridgeAssetOutcome.MessageOnly,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs,
				source: Source.Axelarscan_Rest,
			},
		}],
	}
}

const loadAxelarscanMessage = async (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
) => {
	if (transfer.source !== Source.Axelarscan_Rest)
		throw new Error(`Axelarscan_Rest: unsupported bridge transfer source ${transfer.source}`)

	const dashIndex = transfer.transferId.lastIndexOf('-')
	if (dashIndex < 1)
		throw new Error(`Axelarscan_Rest: invalid GMP message id ${transfer.transferId}`)

	const transactionHash = transfer.transferId.slice(0, dashIndex)
	const logIndexText = transfer.transferId.slice(dashIndex + 1)
	if (!/^(?:0|[1-9]\d*)$/.test(logIndexText))
		throw new Error(`Axelarscan_Rest: invalid GMP message id ${transfer.transferId}`)

	const logIndex = Number(logIndexText)
	const { getGmpMessages } = await import('$/sources/Axelarscan/Rest/queries.ts')
	const page = await getGmpMessages({
		transactionHash,
	})
	const message = page.data.find((candidate) => (
		candidate.message_id === transfer.transferId
		|| (
			candidate.call.transactionHash.toLowerCase() === transactionHash.toLowerCase()
			&& candidate.call.logIndex === logIndex
		)
	))
	if (message == null)
		throw new Error(`Axelarscan_Rest: GMP message not found for ${transfer.transferId}`)

	return message
}


export default {
	source: Source.Axelarscan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BridgeTransfer,
			resolve: {
				SourceTransferId: {
					resolve: async (transfer) => (
						axelarscanBridgeTransferSnapshot(
							transfer,
							await loadAxelarscanMessage(transfer)
						)
					),
				},
				SourceTxSourceLogIndex: {
					resolve: async ({
						$sourceTx,
						source,
						logIndex,
					}) => {
						if (source !== Source.Axelarscan_Rest)
							throw new Error(`Axelarscan_Rest: unsupported bridge transfer source ${source}`)
						if (!('txHash' in $sourceTx))
							throw new Error('Axelarscan_Rest: source transaction requires NetworkTxHash')

						const transferId = `${$sourceTx.txHash}-${logIndex}`
						return axelarscanBridgeTransferSnapshot(
							{
								source: Source.Axelarscan_Rest,
								transferId,
							},
							await loadAxelarscanMessage({
								source: Source.Axelarscan_Rest,
								transferId,
							})
						)
					},
				},
			},
		})({
			source: (transfer) => transfer.source,
			transferId: (transfer) => transfer.transferId,
			$sourceTx: (transfer) => transfer.$sourceTx,
			logIndex: (transfer) => transfer.logIndex,
			$destinationTx: (transfer) => transfer.$destinationTx,
			$sender: (transfer) => transfer.$sender,
			$recipient: (transfer) => transfer.$recipient,
			$fromNetwork: (transfer) => transfer.$fromNetwork,
			$toNetwork: (transfer) => transfer.$toNetwork,
			assetOutcome: (transfer) => transfer.assetOutcome,
			$$timestamps: (transfer) => transfer.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BridgeTransfer_Timestamp,
			resolve: {
				TransferTimestampMsSource: {
					resolve: async ({
						$transfer,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Axelarscan_Rest)
							throw new Error(`Axelarscan_Rest: unsupported bridge transfer timestamp source ${source}`)
						if (
							!('source' in $transfer)
							|| !('transferId' in $transfer)
						)
							throw new Error('Axelarscan_Rest: bridge transfer timestamp requires SourceTransferId')

						const message = await loadAxelarscanMessage($transfer)
						const observedAtMs = axelarscanObservationMs(message)
						if (observedAtMs !== timestampMs)
							throw new Error('Axelarscan_Rest: observation clock mismatch')

						const destinationTxHash = (
							message.executed == null ?
								undefined
							:
								axelarscanEvmTxHash(message.executed.transactionHash, 'destination transaction hash')
						)
						const relayer = (
							message.executed?.relayerAddress == null ?
								undefined
							:
								hexLowerOfByteSize(message.executed.relayerAddress, 20)
						)
						if (message.executed?.relayerAddress != null && relayer == null)
							throw new Error('Axelarscan_Rest: invalid relayer address')

						return {
							$transfer: {
								[EntityMetaKey.Selector]: $transfer,
							},
							timestampMs,
							source,
							status: message.status,
							substatus: message.simplified_status,
							...(destinationTxHash != null && {
								destinationTxHash,
							}),
							...(relayer != null && {
								relayer,
							}),
							...(
								message.executed != null
								&& {
									completedAt: message.executed.block_timestamp * 1_000,
								}
							),
							...(message.simplified_status === 'failed' && {
								error: message.status,
							}),
						}
					},
				},
			},
		})({
			$transfer: (observation) => observation.$transfer,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			status: (observation) => observation.status,
			substatus: (observation) => observation.substatus,
			destinationTxHash: (observation) => observation.destinationTxHash,
			relayer: (observation) => observation.relayer,
			completedAt: (observation) => observation.completedAt,
			error: (observation) => observation.error,
		}),
	],
} satisfies RegisteredSourceResolverModule
