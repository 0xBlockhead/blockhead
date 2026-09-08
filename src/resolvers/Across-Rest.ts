import {
	BridgeAssetOutcome,
	BridgeRailId,
	BridgeSettlementModel,
	BridgeVerificationModel,
} from '$/constants/Bridge.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import {
	acrossChainByChainId,
} from '$/sources/Across/Rest/constants.ts'
import type { AcrossDeposit } from '$/sources/Across/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const acrossTransferIdParts = (
	transferId: string
) => {
	const [
		originChainIdText,
		depositId,
		...rest
	] = transferId.split('/')
	if (
		rest.length > 0
		|| originChainIdText === ''
		|| depositId === ''
		|| !/^(?:0|[1-9]\d*)$/.test(originChainIdText)
		|| !/^(?:0|[1-9]\d*)$/.test(depositId)
	)
		throw new Error(`Across_Rest: invalid deposit transfer id ${transferId}`)

	const originChainId = Number(originChainIdText)
	if (!Number.isSafeInteger(originChainId) || acrossChainByChainId[originChainId] == null)
		throw new Error(`Across_Rest: unsupported origin chain id ${originChainIdText}`)

	return {
		originChainId,
		depositId,
	}
}

const acrossEvmNetworkRef = (
	chainId: number
) => {
	const chain = acrossChainByChainId[chainId]
	if (chain == null)
		throw new Error(`Across_Rest: unsupported chain id ${chainId}`)
	if (!chain.isEvm)
		return undefined

	return {
		[EntityMetaKey.Selector]: {
			caip2: {
				namespace: 'eip155' as const,
				reference: String(chainId),
			},
		},
	}
}

const acrossEvmAddressRef = (
	address: string
) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		return undefined

	return {
		[EntityMetaKey.Selector]: {
			address: normalized,
		},
	}
}

const acrossEvmTxHash = (
	value: string
) => {
	const normalized = hexLowerOfByteSize(value, 32)
	if (normalized == null)
		return undefined

	return normalized
}

const acrossFillObservationMs = (
	deposit: AcrossDeposit
) => {
	if (deposit.status !== 'filled' || deposit.fillBlockTimestamp == null)
		return undefined

	const timestampMs = Date.parse(deposit.fillBlockTimestamp)
	if (!Number.isFinite(timestampMs))
		throw new Error('Across_Rest: invalid fill observation timestamp')

	return timestampMs
}

const acrossTransactionTimestampMs = (
	timestamp: string,
	role: string
) => {
	const timestampMs = Date.parse(timestamp)
	if (!Number.isFinite(timestampMs))
		throw new Error(`Across_Rest: invalid ${role} timestamp`)

	return timestampMs
}

const acrossCoinInstanceRef = (
	chainId: number,
	tokenAddress: string
) => {
	const network = acrossEvmNetworkRef(chainId)
	const address = hexLowerOfByteSize(tokenAddress, 20)
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

const acrossBridgeTransferSnapshot = (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>,
	deposit: AcrossDeposit
) => {
	if (deposit.depositId == null)
		throw new Error('Across_Rest: deposit missing deposit id')

	const transferId = `${deposit.originChainId}/${deposit.depositId}`
	const fromNetwork = acrossEvmNetworkRef(deposit.originChainId)
	const toNetwork = acrossEvmNetworkRef(deposit.destinationChainId)
	const sourceTxHash = acrossEvmTxHash(deposit.depositTxnRef)
	if (fromNetwork != null && sourceTxHash == null)
		throw new Error('Across_Rest: invalid deposit transaction hash')
	const destinationTxHash = (
		deposit.fillTxnRef == null ?
			undefined
		:
			acrossEvmTxHash(deposit.fillTxnRef)
	)
	if (deposit.fillTxnRef != null && toNetwork != null && destinationTxHash == null)
		throw new Error('Across_Rest: invalid fill transaction hash')
	const sender = acrossEvmAddressRef(deposit.depositor)
	if (fromNetwork != null && sender == null)
		throw new Error('Across_Rest: invalid depositor address')
	const recipient = acrossEvmAddressRef(deposit.recipient)
	if (toNetwork != null && recipient == null)
		throw new Error('Across_Rest: invalid recipient address')
	const fromToken = acrossCoinInstanceRef(deposit.originChainId, deposit.inputToken)
	if (fromNetwork != null && fromToken == null)
		throw new Error('Across_Rest: invalid input token address')
	const toToken = acrossCoinInstanceRef(deposit.destinationChainId, deposit.outputToken)
	if (toNetwork != null && toToken == null)
		throw new Error('Across_Rest: invalid output token address')
	const fillObservationMs = acrossFillObservationMs(deposit)
	const sourceTransactionAtMs = acrossTransactionTimestampMs(
		deposit.depositBlockTimestamp,
		'deposit transaction'
	)
	const destinationTransactionAtMs = (
		deposit.fillBlockTimestamp == null ?
			undefined
		:
			acrossTransactionTimestampMs(
				deposit.fillBlockTimestamp,
				'fill transaction'
			)
	)
	if (
		destinationTransactionAtMs != null
		&& destinationTransactionAtMs < sourceTransactionAtMs
	)
		throw new Error('Across_Rest: fill transaction precedes deposit transaction')
	const exclusiveRelayer = (
		deposit.exclusiveRelayer == null ?
			undefined
		:
			hexLowerOfByteSize(deposit.exclusiveRelayer, 20)
	)
	if (deposit.exclusiveRelayer != null && toNetwork != null && exclusiveRelayer == null)
		throw new Error('Across_Rest: invalid exclusive relayer address')

	return {
		source: Source.Across_Rest,
		transferId,
		originChainId: deposit.originChainId,
		depositId: Number(deposit.depositId),
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
			$sender: sender,
		}),
		...(recipient != null && {
			$recipient: recipient,
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
		...(toToken != null && {
			$toToken: toToken,
		}),
		amountIn: BigInt(deposit.inputAmount),
		amountOut: BigInt(deposit.outputAmount),
		sourceTransactionAtMs,
		...(destinationTransactionAtMs != null && {
			destinationTransactionAtMs,
			transactionLatencyMs: destinationTransactionAtMs - sourceTransactionAtMs,
		}),
		railId: BridgeRailId.Across,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.Optimistic,
		assetOutcome: BridgeAssetOutcome.SameNative,
		...(deposit.bridgeFeeUsd != null && {
			bridgeFeeUsd: deposit.bridgeFeeUsd,
		}),
		...(exclusiveRelayer != null && {
			exclusiveRelayer,
		}),
		$$timestamps: (
			fillObservationMs == null ?
				[]
			:
				[{
					[EntityMetaKey.Selector]: {
						$transfer: transfer,
						timestampMs: fillObservationMs,
						source: Source.Across_Rest,
					},
				}]
		),
	}
}

const loadAcrossDeposit = async (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
) => {
	let originChainId: number
	let depositId: string
	if ('transferId' in transfer) {
		if (transfer.source !== Source.Across_Rest)
			throw new Error(`Across_Rest: unsupported bridge transfer source ${transfer.source}`)

		;({
			originChainId,
			depositId,
		} = acrossTransferIdParts(transfer.transferId))
	} else if ('originChainId' in transfer) {
		if (
			!Number.isSafeInteger(transfer.originChainId)
			|| !Number.isSafeInteger(transfer.depositId)
		)
			throw new Error('Across_Rest: exact deposit selector requires safe integer coordinates')

		originChainId = transfer.originChainId
		depositId = String(transfer.depositId)
	} else
		throw new Error('Across_Rest: unsupported bridge transfer selector')

	const { getDeposit } = await import('$/sources/Across/Rest/queries.ts')
	const { deposit } = await getDeposit({
		originChainId,
		depositId,
	})
	if (
		deposit.originChainId !== originChainId
		|| deposit.depositId !== depositId
	)
		throw new Error('Across_Rest: mismatched deposit identity')

	return deposit
}

const acrossPaginationSkip = (
	context: ResolverContext
) => {
	if (
		context.providerContinuationToken != null
		&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
	)
		throw new Error('Across_Rest: invalid pagination offset')

	const skip = context.providerContinuationToken == null ?
		context.pagination.offset ?? 0
	:
		Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('Across_Rest: invalid pagination offset')

	return skip
}

const acrossAccountBridgeTransfers = async (
	address: string,
	context: ResolverContext
) => {
	const skip = acrossPaginationSkip(context)
	const limit = Math.min(resolverContextRowLimit(context), 100)
	const { getDeposits } = await import('$/sources/Across/Rest/queries.ts')
	const deposits = await getDeposits({
		depositor: address,
		limit,
		skip,
	})

	return {
		skip,
		limit,
		rows: deposits.map((deposit) => {
			if (deposit.depositId == null)
				throw new Error('Across_Rest: deposit missing deposit id')

			const transfer = {
				source: Source.Across_Rest,
				transferId: `${deposit.originChainId}/${deposit.depositId}`,
			}
			const fields = acrossBridgeTransferSnapshot(transfer, deposit)
			return {
				[EntityMetaKey.Selector]: transfer,
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'originChainId')]: fields.originChainId,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'depositId')]: fields.depositId,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], '$sourceTx')]: fields.$sourceTx,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], '$sender')]: fields.$sender,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], '$recipient')]: fields.$recipient,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], '$fromNetwork')]: fields.$fromNetwork,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], '$toNetwork')]: fields.$toNetwork,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], '$fromToken')]: fields.$fromToken,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], '$toToken')]: fields.$toToken,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'amountIn')]: fields.amountIn,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'amountOut')]: fields.amountOut,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'sourceTransactionAtMs')]: fields.sourceTransactionAtMs,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'railId')]: fields.railId,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'settlementModel')]: fields.settlementModel,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'verificationModel')]: fields.verificationModel,
					[entityFieldAddressKey(EntityType.BridgeTransfer, [], 'assetOutcome')]: fields.assetOutcome,
				},
			}
		}),
	}
}


export default {
	source: Source.Across_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BridgeTransfer,
			resolve: {
				SourceTransferId: {
					resolve: async (transfer) => (
						acrossBridgeTransferSnapshot(
							transfer,
							await loadAcrossDeposit(transfer)
						)
					),
				},
				OriginChainIdDepositId: {
					resolve: async ({ originChainId, depositId }) => {
						const { getDeposit } = await import('$/sources/Across/Rest/queries.ts')
						const { deposit } = await getDeposit({
							originChainId,
							depositId: String(depositId),
						})
						if (
							deposit.originChainId !== originChainId
							|| deposit.depositId !== String(depositId)
						)
							throw new Error('Across_Rest: mismatched deposit identity')

						return acrossBridgeTransferSnapshot(
							{
								source: Source.Across_Rest,
								transferId: `${originChainId}/${depositId}`,
							},
							deposit
						)
					},
				},
			},
		})({
			source: (transfer) => transfer.source,
			transferId: (transfer) => transfer.transferId,
			originChainId: (transfer) => transfer.originChainId,
			depositId: (transfer) => transfer.depositId,
			$sourceTx: (transfer) => transfer.$sourceTx,
			$destinationTx: (transfer) => transfer.$destinationTx,
			$sender: (transfer) => transfer.$sender,
			$recipient: (transfer) => transfer.$recipient,
			$fromNetwork: (transfer) => transfer.$fromNetwork,
			$toNetwork: (transfer) => transfer.$toNetwork,
			$fromToken: (transfer) => transfer.$fromToken,
			$toToken: (transfer) => transfer.$toToken,
			amountIn: (transfer) => transfer.amountIn,
			amountOut: (transfer) => transfer.amountOut,
			sourceTransactionAtMs: (transfer) => transfer.sourceTransactionAtMs,
			destinationTransactionAtMs: (transfer) => transfer.destinationTransactionAtMs,
			transactionLatencyMs: (transfer) => transfer.transactionLatencyMs,
			railId: (transfer) => transfer.railId,
			settlementModel: (transfer) => transfer.settlementModel,
			verificationModel: (transfer) => transfer.verificationModel,
			assetOutcome: (transfer) => transfer.assetOutcome,
			bridgeFeeUsd: (transfer) => transfer.bridgeFeeUsd,
			exclusiveRelayer: (transfer) => transfer.exclusiveRelayer,
			$$timestamps: {
				select: (transfer) => transfer.$$timestamps,
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
						if (source !== Source.Across_Rest)
							throw new Error(`Across_Rest: unsupported bridge transfer timestamp source ${source}`)

						const deposit = await loadAcrossDeposit($transfer)
						const observedAtMs = acrossFillObservationMs(deposit)
						if (observedAtMs == null)
							throw new Error(`Across_Rest: ${deposit.status} status has no authoritative observation clock`)
						if (observedAtMs !== timestampMs)
							throw new Error('Across_Rest: observation clock mismatch')
						const toNetwork = acrossEvmNetworkRef(deposit.destinationChainId)

						const destinationTxHash = (
							deposit.fillTxnRef == null ?
								undefined
							:
								acrossEvmTxHash(deposit.fillTxnRef)
						)
						const relayer = (
							deposit.relayer == null ?
								undefined
							:
								hexLowerOfByteSize(deposit.relayer, 20)
						)
						if (deposit.fillTxnRef != null && toNetwork != null && destinationTxHash == null)
							throw new Error('Across_Rest: invalid fill transaction hash')
						if (deposit.relayer != null && toNetwork != null && relayer == null)
							throw new Error('Across_Rest: invalid relayer address')

						return {
							$transfer: {
								[EntityMetaKey.Selector]: $transfer,
							},
							timestampMs,
							source,
							status: deposit.status,
							...(destinationTxHash != null && toNetwork != null && {
								destinationTxHash,
							}),
							...(relayer != null && toNetwork != null && {
								relayer,
							}),
							...(deposit.fillGasFee != null && {
								fillGasFee: BigInt(deposit.fillGasFee),
							}),
							...(deposit.fillGasFeeUsd != null && {
								fillGasFeeUsd: deposit.fillGasFeeUsd,
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
			destinationTxHash: (observation) => observation.destinationTxHash,
			relayer: (observation) => observation.relayer,
			refundTxHash: (observation) => observation.refundTxHash,
			estimatedCompletionMs: (observation) => observation.estimatedCompletionMs,
			fillGasFee: (observation) => observation.fillGasFee,
			fillGasFeeUsd: (observation) => observation.fillGasFeeUsd,
			error: (observation) => observation.error,
		}),

		defineResolver({
			entityType: EntityType.EvmAccount,
			resolve: {
				Address: {
					resolve: async ({ address }, context) => (
						acrossAccountBridgeTransfers(address, context)
					),
				},
				AddressInteropAddress: {
					resolve: async ({ address }, context) => (
						acrossAccountBridgeTransfers(address, context)
					),
				},
			},
		})({
			$$bridgeTransfers: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length
					const terminal = snapshot.rows.length < snapshot.limit

					return {
						operation: 'account-bridge-transfers',
						target: 'across',
						terminal,
						...(!terminal && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),
	],
}
