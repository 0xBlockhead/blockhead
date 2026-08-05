import {
	BridgeAssetOutcome,
	BridgeRailId,
	BridgeSettlementModel,
	BridgeVerificationModel,
} from '$/constants/Bridge.ts'
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
import { acrossChainByChainId } from '$/sources/Across/Rest/constants.ts'
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
		originChainIdText == null
		|| depositId == null
		|| rest.length > 0
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
	if (acrossChainByChainId[chainId] == null)
		throw new Error(`Across_Rest: unsupported chain id ${chainId}`)

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
	address: string,
	role: string
) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error(`Across_Rest: invalid ${role} address`)

	return {
		[EntityMetaKey.Selector]: {
			address: normalized,
		},
	}
}

const acrossEvmTxHash = (
	value: string,
	role: string
) => {
	const normalized = hexLowerOfByteSize(value, 32)
	if (normalized == null)
		throw new Error(`Across_Rest: invalid ${role}`)

	return normalized
}

const acrossObservationMs = (
	deposit: AcrossDeposit
) => {
	const timestamp = (
		deposit.fillBlockTimestamp
		?? deposit.depositBlockTimestamp
	)
	const timestampMs = Date.parse(timestamp)
	if (!Number.isFinite(timestampMs))
		throw new Error('Across_Rest: invalid deposit observation timestamp')

	return timestampMs
}

const acrossCoinInstanceRef = (
	chainId: number,
	tokenAddress: string,
	role: string
) => {
	const address = hexLowerOfByteSize(tokenAddress, 20)
	if (address == null)
		throw new Error(`Across_Rest: invalid ${role} token`)

	return {
		[EntityMetaKey.Selector]: {
			$network: acrossEvmNetworkRef(chainId)[EntityMetaKey.Selector],
			address,
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
	const sourceTxHash = acrossEvmTxHash(deposit.depositTxnRef, 'deposit transaction hash')
	const destinationTxHash = (
		deposit.fillTxnRef == null ?
			undefined
		:
			acrossEvmTxHash(deposit.fillTxnRef, 'fill transaction hash')
	)
	const timestampMs = acrossObservationMs(deposit)

	return {
		source: Source.Across_Rest,
		transferId,
		originChainId: deposit.originChainId,
		depositId: Number(deposit.depositId),
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
		$sender: acrossEvmAddressRef(deposit.depositor, 'depositor'),
		$recipient: acrossEvmAddressRef(deposit.recipient, 'recipient'),
		$fromNetwork: fromNetwork,
		$toNetwork: toNetwork,
		$fromToken: acrossCoinInstanceRef(deposit.originChainId, deposit.inputToken, 'input'),
		$toToken: acrossCoinInstanceRef(deposit.destinationChainId, deposit.outputToken, 'output'),
		amountIn: BigInt(deposit.inputAmount),
		amountOut: BigInt(deposit.outputAmount),
		railId: BridgeRailId.Across,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.Optimistic,
		assetOutcome: BridgeAssetOutcome.SameNative,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs,
				source: Source.Across_Rest,
			},
		}],
	}
}

const loadAcrossDeposit = async (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
) => {
	if (transfer.source !== Source.Across_Rest)
		throw new Error(`Across_Rest: unsupported bridge transfer source ${transfer.source}`)

	const { originChainId, depositId } = acrossTransferIdParts(transfer.transferId)
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
						if (source !== Source.Across_Rest)
							throw new Error(`Across_Rest: unsupported bridge transfer timestamp source ${source}`)

						const deposit = await loadAcrossDeposit($transfer)
						const observedAtMs = acrossObservationMs(deposit)
						if (observedAtMs !== timestampMs)
							throw new Error('Across_Rest: observation clock mismatch')

						const destinationTxHash = (
							deposit.fillTxnRef == null ?
								undefined
							:
								acrossEvmTxHash(deposit.fillTxnRef, 'fill transaction hash')
						)
						const refundTxHash = (
							deposit.depositRefundTxnRef == null ?
								undefined
							:
								acrossEvmTxHash(deposit.depositRefundTxnRef, 'refund transaction hash')
						)
						const relayer = (
							deposit.relayer == null ?
								undefined
							:
								hexLowerOfByteSize(deposit.relayer, 20)
						)
						if (deposit.relayer != null && relayer == null)
							throw new Error('Across_Rest: invalid relayer address')

						return {
							$transfer: {
								[EntityMetaKey.Selector]: $transfer,
							},
							timestampMs,
							source,
							status: deposit.status,
							...(destinationTxHash != null && {
								destinationTxHash,
							}),
							...(relayer != null && {
								relayer,
							}),
							...(refundTxHash != null && {
								refundTxHash,
							}),
							...(
								deposit.fillBlockTimestamp != null
								&& {
									completedAt: Date.parse(deposit.fillBlockTimestamp),
								}
							),
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
			completedAt: (observation) => observation.completedAt,
		}),

		defineResolver({
			entityType: EntityType.EvmAccount,
			resolve: {
				AddressInteropAddress: {
					resolve: async ({ address }) => {
						const { getDeposits } = await import('$/sources/Across/Rest/queries.ts')
						return (await getDeposits({
							depositor: address,
						})).map((deposit) => {
							if (deposit.depositId == null)
								throw new Error('Across_Rest: deposit missing deposit id')

							return {
								[EntityMetaKey.Selector]: {
									source: Source.Across_Rest,
									transferId: `${deposit.originChainId}/${deposit.depositId}`,
								},
							}
						})
					},
				},
			},
		})({
			$$bridgeTransfers: (bridgeTransfers) => bridgeTransfers,
		}),
	],
} satisfies RegisteredSourceResolverModule
