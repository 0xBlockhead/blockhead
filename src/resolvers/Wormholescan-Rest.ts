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
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { wormholeEvmChainByWormholeChainId } from '$/sources/Wormholescan/Rest/constants.ts'
import type {
	WormholescanOperation,
	WormholescanVaa,
	WormholescanWormholeChainId,
} from '$/sources/Wormholescan/Rest/types.ts'
import { wormholescanNonNegativeDecimalString } from '$/sources/Wormholescan/Rest/types.ts'

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
		|| !Number.isSafeInteger(Number(chainIdText))
	)
		throw new Error(`Wormholescan_Rest: invalid operation transfer id ${transferId}`)

	return {
		chainId: Number(chainIdText),
		emitter,
		sequence,
	}
}

const presentWormholeChainId = (
	wormholeChainId: WormholescanWormholeChainId | undefined
) => (
	wormholeChainId == null || wormholeChainId === 0 ?
		undefined
	:
		wormholeChainId
)

const eip155NetworkRef = (
	wormholeChainId: WormholescanWormholeChainId | undefined
) => {
	const chainId = presentWormholeChainId(wormholeChainId)
	if (chainId == null)
		return undefined

	const row = wormholeEvmChainByWormholeChainId[chainId]
	if (row == null)
		return undefined

	return {
		[EntityMetaKey.Selector]: {
			caip2: {
				namespace: 'eip155' as const,
				reference: row.eip155Reference,
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
		throw new Error(`Wormholescan_Rest: invalid operation timestamp ${value}`)

	return timestampMs
}

const bigintAmountFromWire = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined

	if (!/^(0|[1-9]\d*)$/.test(value))
		throw new Error(`Wormholescan_Rest: invalid operation amount ${value}`)

	return BigInt(value)
}

const nonNegativeUsdFee = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined
	try {
		return wormholescanNonNegativeDecimalString.assert(value)
	} catch {
		throw new Error(`Wormholescan_Rest: invalid USD fee ${value}`)
	}
}

const wormholeCoinInstanceRef = (
	wormholeChainId: WormholescanWormholeChainId | undefined,
	tokenAddress: string | undefined
) => {
	const network = eip155NetworkRef(wormholeChainId)
	const address = evmAddressFromWormholeWire(tokenAddress)
	if (network == null || address == null)
		return undefined

	return {
		[EntityMetaKey.Selector]: {
			$network: network[EntityMetaKey.Selector],
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: network[EntityMetaKey.Selector],
				address,
			},
		},
	}
}

const bridgeTransferSnapshotFromOperation = (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>,
	operation: WormholescanOperation
) => {
	const transferId = operation.id
	const properties = operation.content?.standarizedProperties
	const fromWormholeChainId = (
		presentWormholeChainId(properties?.fromChain)
		?? presentWormholeChainId(operation.sourceChain?.chainId)
		?? presentWormholeChainId(operation.emitterChain)
	)
	const toWormholeChainId = (
		presentWormholeChainId(properties?.toChain)
		?? presentWormholeChainId(operation.targetChain?.chainId)
	)
	const fromNetwork = eip155NetworkRef(fromWormholeChainId)
	const toNetwork = eip155NetworkRef(toWormholeChainId)
	const sourceTxHash = evmTxHashFromWormholeWire(operation.sourceChain?.transaction?.txHash)
	const destinationTxHash = evmTxHashFromWormholeWire(operation.targetChain?.transaction?.txHash)
	const sender = (
		evmAddressFromWormholeWire(properties?.fromAddress)
		?? evmAddressFromWormholeWire(operation.sourceChain?.from)
	)
	const recipient = (
		evmAddressFromWormholeWire(properties?.toAddress)
		?? evmAddressFromWormholeWire(operation.targetChain?.to)
	)
	const amountIn = bigintAmountFromWire(properties?.amount)
	const fromToken = wormholeCoinInstanceRef(
		properties?.tokenChain ?? fromWormholeChainId,
		properties?.tokenAddress
	)
	const bridgeFeeUsd = nonNegativeUsdFee(operation.sourceChain?.feeUSD)
	const observedAtMs = (
		timestampMsFromIso(operation.targetChain?.timestamp)
		?? timestampMsFromIso(operation.sourceChain?.timestamp)
	)
	if (observedAtMs == null)
		throw new Error('Wormholescan_Rest: operation missing timestamp')

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
		...(fromToken != null && {
			$fromToken: fromToken,
		}),
		...(amountIn != null && {
			amountIn,
		}),
		railId: BridgeRailId.Wormhole,
		settlementModel: BridgeSettlementModel.LockMint,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: (
			amountIn != null ?
				BridgeAssetOutcome.WrappedMint
			:
				BridgeAssetOutcome.MessageOnly
		),
		...(bridgeFeeUsd != null && {
			bridgeFeeUsd,
		}),
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
		throw new Error(`Wormholescan_Rest: unsupported bridge transfer source ${transfer.source}`)

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
		throw new Error(`Wormholescan_Rest: no operation for source tx ${txHash}`)

	return operation
}

const wormholeVaaSnapshotFromWire = (
	vaa: WormholescanVaa,
	{
		emitterChain,
		emitter,
		sequence,
	}: EntitySelector<typeof schema, EntityType.WormholeVaa>
) => {
	if (vaa.digest == null || vaa.digest === '')
		throw new Error('Wormholescan_Rest: VAA missing digest')
	if (vaa.guardianSetIndex == null || !Number.isSafeInteger(vaa.guardianSetIndex))
		throw new Error('Wormholescan_Rest: VAA missing guardian set index')
	if (
		vaa.emitterChain !== emitterChain
		|| vaa.emitterAddr.toLowerCase() !== emitter.toLowerCase()
		|| String(vaa.sequence) !== sequence
		|| vaa.id !== `${emitterChain}/${vaa.emitterAddr}/${vaa.sequence}`
	)
		throw new Error('Wormholescan_Rest: mismatched VAA identity')

	const txHash = evmTxHashFromWormholeWire(vaa.txHash)

	return {
		emitterChain,
		emitter,
		sequence,
		digest: vaa.digest,
		guardianSetIndex: vaa.guardianSetIndex,
		timestamp: vaa.timestamp,
		...(vaa.emitterNativeAddr != null
			&& vaa.emitterNativeAddr !== ''
			&& {
				emitterNativeAddr: vaa.emitterNativeAddr,
			}),
		...(txHash != null && { txHash }),
	}
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
			$fromToken: (transfer) => transfer.$fromToken,
			amountIn: (transfer) => transfer.amountIn,
			railId: (transfer) => transfer.railId,
			settlementModel: (transfer) => transfer.settlementModel,
			verificationModel: (transfer) => transfer.verificationModel,
			assetOutcome: (transfer) => transfer.assetOutcome,
			bridgeFeeUsd: (transfer) => transfer.bridgeFeeUsd,
			$$timestamps: {
				select: (transfer) => transfer.$$timestamps,
				resolveCount: (transfer) => transfer.$$timestamps.length,
			},
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
							throw new Error(`Wormholescan_Rest: unsupported bridge transfer timestamp source ${source}`)

						const operation = await loadOperationForTransfer($transfer)
						const observedAtMs = (
							timestampMsFromIso(operation.targetChain?.timestamp)
							?? timestampMsFromIso(operation.sourceChain?.timestamp)
						)
						if (observedAtMs == null)
							throw new Error('Wormholescan_Rest: operation missing timestamp')
						if (observedAtMs !== timestampMs)
							throw new Error('Wormholescan_Rest: observation clock mismatch')

						const destinationTxHash = evmTxHashFromWormholeWire(
							operation.targetChain?.transaction?.txHash
						)
						const completedAt = timestampMsFromIso(operation.targetChain?.timestamp)
						const status = (
							operation.targetChain?.status
							?? operation.sourceChain?.status
						)
						const fillGasFee = bigintAmountFromWire(operation.targetChain?.fee)
						const fillGasFeeUsd = nonNegativeUsdFee(operation.targetChain?.feeUSD)

						return {
							$transfer: {
								[EntityMetaKey.Selector]: $transfer,
							},
							timestampMs,
							source,
							...(status != null && { status }),
							...(destinationTxHash != null && { destinationTxHash }),
							...(completedAt != null && { completedAt }),
							...(fillGasFee != null && { fillGasFee }),
							...(fillGasFeeUsd != null && { fillGasFeeUsd }),
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
			fillGasFee: (observation) => observation.fillGasFee,
			fillGasFeeUsd: (observation) => observation.fillGasFeeUsd,
		}),

		defineResolver({
			entityType: EntityType.WormholeVaa,
			resolve: {
				EmitterChainEmitterSequence: {
					resolve: async ({
						emitterChain,
						emitter,
						sequence,
					}) => {
						const { getVaaById } = await import(
							'$/sources/Wormholescan/Rest/queries.ts'
						)
						return wormholeVaaSnapshotFromWire(
							await getVaaById({
								chainId: emitterChain,
								emitter,
								sequence,
							}),
							{
								emitterChain,
								emitter,
								sequence,
							}
						)
					},
				},
			},
		})({
			emitterChain: (vaa) => vaa.emitterChain,
			emitter: (vaa) => vaa.emitter,
			sequence: (vaa) => vaa.sequence,
			digest: (vaa) => vaa.digest,
			guardianSetIndex: (vaa) => vaa.guardianSetIndex,
			emitterNativeAddr: (vaa) => vaa.emitterNativeAddr,
			timestamp: (vaa) => vaa.timestamp,
			txHash: (vaa) => vaa.txHash,
		}),
	],
} satisfies RegisteredSourceResolverModule
