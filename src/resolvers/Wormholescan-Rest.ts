import {
	BridgeAssetOutcome,
	BridgeRailId,
	BridgeSettlementModel,
	BridgeVerificationModel,
} from '$/constants/Bridge.ts'
import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
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
import { Source } from '$/sources/Source.ts'
import {
	eip155ReferenceByWormholeChainId,
	type WormholescanOperation,
	type WormholescanWormholeChainId,
} from '$/sources/Wormholescan/Rest/types.ts'

const wormholescanTransferIdParts = (
	transferId: string
) => {
	const [
		chainIdText,
		emitter,
		sequence,
		...rest
	] = transferId.split('/')
	if (
		chainIdText == null
		|| emitter == null
		|| sequence == null
		|| rest.length > 0
		|| chainIdText === ''
		|| emitter === ''
		|| sequence === ''
		|| !/^(0|[1-9]\d*)$/.test(chainIdText)
		|| !/^(0|[1-9]\d*)$/.test(sequence)
	)
		throw new Error(`Wormholescan: invalid operation transfer id ${transferId}`)

	return {
		chainId: Number(chainIdText),
		emitter,
		sequence,
	}
}

const eip155NetworkRef = (
	wormholeChainId: WormholescanWormholeChainId | undefined
) => {
	if (wormholeChainId == null)
		return undefined

	const reference = eip155ReferenceByWormholeChainId[wormholeChainId]
	if (reference == null)
		return undefined

	return {
		[EntityMetaKey.Selector]: {
			caip2: {
				namespace: 'eip155' as const,
				reference,
			},
		},
	}
}

const evmAddressFromWormholeWire = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined

	const digits = value.replace(/^0x/i, '').toLowerCase()
	if (!/^[0-9a-f]+$/.test(digits))
		return undefined

	return (
		digits.length === 64 ?
			hexLowerOfByteSize(`0x${digits.slice(-40)}`, 20)
		: digits.length === 40 ?
			hexLowerOfByteSize(`0x${digits}`, 20)
		:
			undefined
	)
}

const evmTxHashFromWormholeWire = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined

	return hexLowerOfByteSize(with0xHex(value), 32)
}

const timestampMsFromIso = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined

	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error(`Wormholescan: invalid operation timestamp ${value}`)

	return timestampMs
}

const bigintAmountFromWire = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined

	if (!/^(0|[1-9]\d*)$/.test(value))
		throw new Error(`Wormholescan: invalid operation amount ${value}`)

	return BigInt(value)
}

const bridgeTransferSnapshotFromOperation = (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>,
	operation: WormholescanOperation
) => {
	const transferId = operation.id
	if (transferId == null || transferId === '')
		throw new Error('Wormholescan: operation missing id')

	const properties = operation.content?.standarizedProperties
	const fromWormholeChainId = (
		properties?.fromChain
		?? operation.sourceChain?.chainId
		?? operation.emitterChain
	)
	const toWormholeChainId = (
		properties?.toChain
		?? operation.targetChain?.chainId
	)
	const fromNetwork = eip155NetworkRef(fromWormholeChainId)
	const toNetwork = eip155NetworkRef(toWormholeChainId)
	const sourceTxHash = evmTxHashFromWormholeWire(operation.sourceChain?.transaction?.txHash)
	const destinationTxHash = evmTxHashFromWormholeWire(operation.targetChain?.transaction?.txHash)
	const sender = evmAddressFromWormholeWire(
		properties?.fromAddress
		?? operation.sourceChain?.from
	)
	const recipient = evmAddressFromWormholeWire(
		properties?.toAddress
		?? operation.targetChain?.to
	)
	const amountIn = bigintAmountFromWire(properties?.amount)
	const observedAtMs = (
		timestampMsFromIso(operation.targetChain?.timestamp)
		?? timestampMsFromIso(operation.sourceChain?.timestamp)
		?? Date.now()
	)
	const hasTokenTransferAmount = amountIn != null

	return {
		source: Source.Wormholescan,
		transferId,
		...(sourceTxHash != null && fromNetwork != null && {
			$sourceTx: {
				[EntityMetaKey.Selector]: {
					$network: fromNetwork[EntityMetaKey.Selector],
					txHash: sourceTxHash,
				},
			},
		}),
		...(destinationTxHash != null && toNetwork != null && {
			$destinationTx: {
				[EntityMetaKey.Selector]: {
					$network: toNetwork[EntityMetaKey.Selector],
					txHash: destinationTxHash,
				},
			},
		}),
		...(sender != null && {
			$sender: {
				[EntityMetaKey.Selector]: { address: sender },
			},
		}),
		...(recipient != null && {
			$recipient: {
				[EntityMetaKey.Selector]: { address: recipient },
			},
		}),
		...(fromNetwork != null && {
			$fromNetwork: fromNetwork,
		}),
		...(toNetwork != null && {
			$toNetwork: toNetwork,
		}),
		...(amountIn != null && {
			amountIn,
		}),
		railId: BridgeRailId.Wormhole,
		settlementModel: BridgeSettlementModel.LockMint,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: (
			hasTokenTransferAmount ?
				BridgeAssetOutcome.WrappedMint
			:
				BridgeAssetOutcome.MessageOnly
		),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: observedAtMs,
				source: Source.Wormholescan,
			},
		}],
	}
}

const loadOperationForTransfer = async (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
) => {
	if (transfer.source !== Source.Wormholescan)
		throw new Error(`Wormholescan: unsupported bridge transfer source ${transfer.source}`)

	const { getOperationById, getOperations } = await import(
		'$/sources/Wormholescan/Rest/queries.ts'
	)

	if ('transferId' in transfer) {
		const parts = wormholescanTransferIdParts(transfer.transferId)
		return getOperationById(parts)
	}

	const txHash = transfer.$sourceTx.txHash
	const operations = await getOperations({ txHash })
	const operation = operations.find((candidate) => (
		candidate.sourceChain?.transaction?.txHash?.toLowerCase() === txHash.toLowerCase()
		|| candidate.sourceChain?.transaction?.txHash?.toLowerCase() === txHash.slice(2).toLowerCase()
	))
	if (operation == null)
		throw new Error(`Wormholescan: no operation for source tx ${txHash}`)

	return operation
}

export default {
	source: Source.Wormholescan,

	resolvers: [
		defineResolver({
			entityType: EntityType.BridgeTransfer,
			resolve: {
				SourceTransferId: {
					resolve: async (transfer) => (
						bridgeTransferSnapshotFromOperation(
							transfer,
							await loadOperationForTransfer(transfer)
						)
					),
				},
				SourceTxSourceLogIndex: {
					resolve: async (transfer) => (
						bridgeTransferSnapshotFromOperation(
							transfer,
							await loadOperationForTransfer(transfer)
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
			amountIn: (transfer) => transfer.amountIn,
			railId: (transfer) => transfer.railId,
			settlementModel: (transfer) => transfer.settlementModel,
			verificationModel: (transfer) => transfer.verificationModel,
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
						if (source !== Source.Wormholescan)
							throw new Error(`Wormholescan: unsupported bridge transfer timestamp source ${source}`)

						const operation = await loadOperationForTransfer($transfer)
						const destinationTxHash = evmTxHashFromWormholeWire(
							operation.targetChain?.transaction?.txHash
						)
						const completedAt = timestampMsFromIso(operation.targetChain?.timestamp)
						const status = (
							operation.targetChain?.status
							?? operation.sourceChain?.status
						)

						return {
							$transfer: {
								[EntityMetaKey.Selector]: $transfer,
							},
							timestampMs,
							source,
							...(status != null && { status }),
							...(destinationTxHash != null && { destinationTxHash }),
							...(completedAt != null && { completedAt }),
						}
					},
				},
			},
		})({
			$transfer: (observation) => observation.$transfer,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			status: (observation) => observation.status,
			destinationTxHash: (observation) => observation.destinationTxHash,
			completedAt: (observation) => observation.completedAt,
		}),
	],
} satisfies RegisteredSourceResolverModule
