import { BridgeAssetOutcome } from '$/constants/Bridge.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
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


const axelarscanMessageLogIndex = (
	event: {
		_logIndex?: number
		logIndex?: number
	}
) => (
	event._logIndex ?? event.logIndex
)


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

const axelarscanFillGasFee = (message: AxelarscanGmpMessage) => {
	const gasUsed = message.executed?.receipt?.gasUsed
	const effectiveGasPrice = message.executed?.receipt?.effectiveGasPrice
	if (gasUsed == null || effectiveGasPrice == null)
		return undefined
	if (!/^(?:0|[1-9]\d*)$/.test(gasUsed) || !/^(?:0|[1-9]\d*)$/.test(effectiveGasPrice))
		throw new Error('Axelarscan_Rest: invalid fill gas fee units')
	return BigInt(gasUsed) * BigInt(effectiveGasPrice)
}

const axelarscanFillGasFeeUsd = (message: AxelarscanGmpMessage) => {
	const fillGasFee = axelarscanFillGasFee(message)
	const destinationNativeToken = message.fees?.destination_native_token
	const decimals = destinationNativeToken?.decimals
	const usd = destinationNativeToken?.token_price?.usd
	if (fillGasFee == null || decimals == null || usd == null)
		return undefined
	if (!Number.isSafeInteger(decimals) || decimals > 36)
		throw new Error('Axelarscan_Rest: invalid destination native token decimals')
	if (!Number.isFinite(usd) || usd < 0)
		throw new Error('Axelarscan_Rest: invalid destination native token price')

	const scale = 10n ** BigInt(decimals)
	const whole = fillGasFee / scale
	const fraction = fillGasFee % scale
	if (whole > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Axelarscan_Rest: fill gas fee exceeds safe decimal projection')

	const nativeAmount = Number(whole) + Number(fraction) / Number(scale)
	const fillGasFeeUsd = nativeAmount * usd
	if (!Number.isFinite(fillGasFeeUsd) || fillGasFeeUsd < 0)
		throw new Error('Axelarscan_Rest: invalid fill gas fee usd')
	return String(fillGasFeeUsd)
}

const axelarscanBridgeFeeUsd = (message: AxelarscanGmpMessage) => {
	const feeUsd = message.fees?.base_fee_usd ?? message.fees?.source_base_fee_usd
	if (feeUsd == null)
		return undefined
	if (!Number.isFinite(feeUsd) || feeUsd < 0)
		throw new Error('Axelarscan_Rest: invalid bridge fee usd')
	return String(feeUsd)
}

const axelarscanSourceConfirmations = (message: AxelarscanGmpMessage) => (
	message.call.receipt?.confirmations
)

const axelarscanObservationError = (message: AxelarscanGmpMessage) => {
	const detail = message.error?.error.message ?? message.error?.error.reason
	if (detail != null && detail.length > 0)
		return detail
	if (message.simplified_status === 'failed')
		return message.status
}

const axelarscanRelayer = (message: AxelarscanGmpMessage) => {
	for (const candidate of [
		message.executed?.relayerAddress,
		message.executed?.from,
		message.executed?.receipt?.from,
	]) {
		if (candidate == null)
			continue
		const normalized = hexLowerOfByteSize(candidate, 20)
		if (normalized != null)
			return normalized
	}
}

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
	const messageLogIndex = axelarscanMessageLogIndex(message.call)
	if (messageLogIndex == null)
		throw new Error('Axelarscan_Rest: call missing message log index')
	const bridgeFeeUsd = axelarscanBridgeFeeUsd(message)

	return {
		source: Source.Axelarscan_Rest,
		transferId: message.message_id,
		$sourceTx: {
			[EntityMetaKey.Selector]: {
				$network: fromNetwork[EntityMetaKey.Selector],
				txHash: sourceTxHash,
			},
		},
		logIndex: messageLogIndex,
		...(destinationTxHash != null && {
			$destinationTx: {
				[EntityMetaKey.Selector]: {
					$network: toNetwork[EntityMetaKey.Selector],
					txHash: destinationTxHash,
				},
			},
		}),
		$sender: axelarscanEvmAddressRef(message.call.returnValues.sender, 'sender'),
		...(
			hexLowerOfByteSize(message.call.returnValues.destinationContractAddress, 20) != null
			&& {
				$recipient: axelarscanEvmAddressRef(
					message.call.returnValues.destinationContractAddress,
					'recipient'
				),
			}
		),
		$fromNetwork: fromNetwork,
		$toNetwork: toNetwork,
		// GMP search rows are cross-chain messages; token amounts stay transport-only (Across owns amountIn/Out).
		assetOutcome: BridgeAssetOutcome.MessageOnly,
		...(bridgeFeeUsd != null && {
			bridgeFeeUsd,
		}),
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
			&& axelarscanMessageLogIndex(candidate.call) === logIndex
		)
	))
	if (message == null)
		throw new Error(`Axelarscan_Rest: GMP message not found for ${transfer.transferId}`)

	return message
}

const axelarscanPaginationSkip = (
	context: ResolverContext
) => {
	const skip = context.providerContinuationToken == null ?
		context.pagination.offset ?? 0
	:
		Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('Axelarscan_Rest: invalid pagination offset')

	return skip
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
						const relayer = axelarscanRelayer(message)
						const fillGasFee = axelarscanFillGasFee(message)
						const fillGasFeeUsd = axelarscanFillGasFeeUsd(message)
						const sourceConfirmations = axelarscanSourceConfirmations(message)
						const error = axelarscanObservationError(message)

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
							...(sourceConfirmations != null && {
								sourceConfirmations,
							}),
							...(
								message.executed != null
								&& {
									completedAt: message.executed.block_timestamp * 1_000,
								}
							),
							...(fillGasFee != null && {
								fillGasFee,
							}),
							...(fillGasFeeUsd != null && {
								fillGasFeeUsd,
							}),
							...(error != null && {
								error,
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
			sourceConfirmations: (observation) => observation.sourceConfirmations,
			completedAt: (observation) => observation.completedAt,
			fillGasFee: (observation) => observation.fillGasFee,
			fillGasFeeUsd: (observation) => observation.fillGasFeeUsd,
			error: (observation) => observation.error,
		}),

		defineResolver({
			entityType: EntityType.EvmAccount,
			resolve: {
				Address: {
					resolve: async ({ address }, context) => {
						const skip = axelarscanPaginationSkip(context)
						const limit = Math.min(resolverContextRowLimit(context), 25)
						const { getGmpMessages } = await import('$/sources/Axelarscan/Rest/queries.ts')
						const page = await getGmpMessages({
							senderAddress: address,
							from: skip,
							size: limit,
						})

						return {
							skip,
							limit,
							total: page.total,
							rows: page.data.flatMap((message) => (
								axelarscanEvmChainIdByChainKey[message.call.chain.toLowerCase()] == null
								|| axelarscanEvmChainIdByChainKey[message.call.returnValues.destinationChain.toLowerCase()] == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											source: Source.Axelarscan_Rest,
											transferId: message.message_id,
										},
									}]
							)),
						}
					},
				},
				AddressInteropAddress: {
					resolve: async ({ address }, context) => {
						const skip = axelarscanPaginationSkip(context)
						const limit = Math.min(resolverContextRowLimit(context), 25)
						const { getGmpMessages } = await import('$/sources/Axelarscan/Rest/queries.ts')
						const page = await getGmpMessages({
							senderAddress: address,
							from: skip,
							size: limit,
						})

						return {
							skip,
							limit,
							total: page.total,
							rows: page.data.flatMap((message) => (
								axelarscanEvmChainIdByChainKey[message.call.chain.toLowerCase()] == null
								|| axelarscanEvmChainIdByChainKey[message.call.returnValues.destinationChain.toLowerCase()] == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											source: Source.Axelarscan_Rest,
											transferId: message.message_id,
										},
									}]
							)),
						}
					},
				},
			},
		})({
			$$bridgeTransfers: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.limit
					const terminal = nextSkip >= snapshot.total

					return {
						operation: 'account-bridge-transfers',
						target: 'axelarscan',
						terminal,
						...(!terminal && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
