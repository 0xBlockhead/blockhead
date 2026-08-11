import { type } from 'arktype'

import { bridgeToolByKey } from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import type { CoinInstanceEntitySelector } from '$/resolvers/Coingecko/Rest/coinInstances.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	evmChainCatalogExplorerUrlEntities,
	evmChainCatalogUrlEntities,
} from '$/resolvers/evm.ts'
import { coinInstanceRefFromLifiToken } from '$/resolvers/Lifi/Rest/bridgeRouteSteps.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	parseEntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'
import type { LifiChain } from '$/sources/Lifi/Rest/types.ts'
import type {
	LifiStatusRequest,
	LifiStatusResponse,
} from '$/sources/Lifi/Rest/types.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'

const lifiEvmNetworkRef = (
	chainId: number,
	chains: LifiChain[]
) => (
	chains.find((chain) => chain.id === chainId)?.chainType === 'EVM' ?
		{
			[EntityMetaKey.Selector]: {
				caip2: {
					namespace: 'eip155' as const,
					reference: String(chainId),
				},
			},
		}
	:
		undefined
)

const lifiEvmChainId = (
	reference: string
) => {
	if (!/^[1-9][0-9]*$/.test(reference))
		throw new Error(`Lifi_Rest: invalid eip155 chain id ${reference}`)

	const chainId = Number(reference)
	if (!Number.isSafeInteger(chainId))
		throw new Error(`Lifi_Rest: invalid eip155 chain id ${reference}`)

	return chainId
}

const lifiCoinInstanceSelector = (
	entitySelector: EntitySelector<typeof schema, EntityType.EvmCoinInstance>
): CoinInstanceEntitySelector => {
	if (
		!('caip2' in entitySelector.$network)
		|| entitySelector.$network.caip2.namespace !== 'eip155'
	)
		throw new Error('Lifi_Rest: coin instance requires an EVM CAIP-2 network')

	if (entitySelector.type === CoinInstanceType.NativeCurrency)
		return {
			$network: entitySelector.$network,
			type: CoinInstanceType.NativeCurrency,
		}

	if (!('$contract' in entitySelector))
		throw new Error('Lifi_Rest: ERC-20 coin instance requires a contract selector')

	return {
		$network: entitySelector.$network,
		type: CoinInstanceType.Erc20Token,
		$contract: entitySelector.$contract,
	}
}

const lifiTransferStatusSnapshot = async (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
) => {
	const {
		fetchChains,
		fetchTransferStatus,
	} = await import('$/sources/Lifi/Rest/queries.ts')
	const status = await fetchTransferStatus(
		lifiTransferStatusRequestFromTransfer(transfer)
	)
	if (status.status === 'NOT_FOUND')
		throw new Error('Lifi_Rest: transfer not found')

	if (status.status === 'INVALID')
		throw new Error('Lifi_Rest: transfer status invalid')

	const transferId = lifiCanonicalTransferId(transfer, status)
	if (
		'$sourceTx' in transfer
		&& (
			hexLowerOfByteSize(status.sending.txHash, 32) !== transfer.$sourceTx.txHash
			|| String(status.sending.chainId) !== transfer.$sourceTx.$network.caip2.reference
		)
	)
		throw new Error('Lifi_Rest: transfer status does not match source transaction')

	const { chains } = await fetchChains()
	const fromNetwork = (
		lifiEvmNetworkRef(status.sending.chainId, chains)
	)
	const toNetwork = (
		status.receiving == null ?
			undefined
		:
			lifiEvmNetworkRef(status.receiving.chainId, chains)
	)
	if (fromNetwork == null)
		throw new Error('Lifi_Rest: source network is not an EVM LI.FI chain')

	if (status.receiving != null && toNetwork == null)
		throw new Error('Lifi_Rest: destination network is not an EVM LI.FI chain')

	if (hexLowerOfByteSize(status.sending.txHash, 32) == null)
		throw new Error('Lifi_Rest: invalid source transaction hash')

	if (
		status.receiving != null
		&& hexLowerOfByteSize(status.receiving.txHash, 32) == null
	)
		throw new Error('Lifi_Rest: invalid destination transaction hash')

	if (
		status.fromAddress != null
		&& hexLowerOfByteSize(status.fromAddress, 20) == null
	)
		throw new Error('Lifi_Rest: invalid sender address')

	if (
		status.toAddress != null
		&& hexLowerOfByteSize(status.toAddress, 20) == null
	)
		throw new Error('Lifi_Rest: invalid recipient address')

	return {
		status,
		transferId,
		observedAtMs: Date.now(),
		fromNetwork,
		toNetwork,
	}
}

const lifiTransferStatusRequestFromTransfer = (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
): LifiStatusRequest => {
	if (transfer.source !== Source.Lifi_Rest)
		throw new Error(`Lifi_Rest: unsupported bridge transfer source ${transfer.source}`)

	if ('$sourceTx' in transfer) {
		const fromChain = (
			transfer.$sourceTx.$network.caip2.namespace === 'eip155' ?
				transfer.$sourceTx.$network.caip2.reference
			:
				undefined
		)
		return {
			txHash: transfer.$sourceTx.txHash,
			...(fromChain != null && { fromChain }),
		}
	}

	return { txHash: transfer.transferId }
}

const lifiCanonicalTransferId = (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>,
	status: LifiStatusResponse
) => {
	if ('transferId' in transfer) {
		if (
			status.transactionId != null
			&& status.transactionId !== ''
			&& status.transactionId !== transfer.transferId
		)
			throw new Error('Lifi_Rest: transfer id does not match status')

		return transfer.transferId
	}

	if (status.transactionId == null || status.transactionId === '')
		throw new Error('Lifi_Rest: status missing transaction id')

	return status.transactionId
}

const lifiBridgeTransferSnapshot = async (
	transfer: EntitySelector<typeof schema, EntityType.BridgeTransfer>
) => {
	const {
		status,
		transferId,
		observedAtMs,
		fromNetwork,
		toNetwork,
	} = await lifiTransferStatusSnapshot(
		transfer
	)
	const sourceTxHash = (
		fromNetwork == null ?
			undefined
		:
			hexLowerOfByteSize(status.sending.txHash, 32)
	)
	const destinationTxHash = (
		status.receiving == null || toNetwork == null ?
			undefined
		:
			hexLowerOfByteSize(status.receiving.txHash, 32)
	)
	const sender = (
		fromNetwork == null || status.fromAddress == null ?
			undefined
		:
			hexLowerOfByteSize(status.fromAddress, 20)
	)
	const recipient = (
		toNetwork == null || status.toAddress == null ?
			undefined
		:
			hexLowerOfByteSize(status.toAddress, 20)
	)
	const bridgeTool = bridgeToolByKey[status.tool]
	const {
		lifiBridgeFeeUsdFromFeeCosts,
	} = await import('$/sources/Lifi/Rest/queries.ts')
	const bridgeFeeUsd = lifiBridgeFeeUsdFromFeeCosts(status.feeCosts)

	return {
		source: Source.Lifi_Rest,
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
			$fromToken: coinInstanceRefFromLifiToken(status.sending.token),
		}),
		...(toNetwork != null && status.receiving != null && {
			$toNetwork: toNetwork,
			$toToken: coinInstanceRefFromLifiToken(status.receiving.token),
		}),
		amountIn: BigInt(status.sending.amount),
		...(status.receiving != null && {
			amountOut: BigInt(status.receiving.amount),
		}),
		...(bridgeTool != null && {
			railId: bridgeTool.railId,
			settlementModel: bridgeTool.settlementModel,
			verificationModel: bridgeTool.verificationModel,
			assetOutcome: bridgeTool.assetOutcome,
		}),
		...(bridgeFeeUsd != null && {
			bridgeFeeUsd,
		}),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: observedAtMs,
				source: Source.Lifi_Rest,
			},
		}],
	}
}

const networkSnapshotFromLifiChain = (lifiChain: LifiChain) => {
	const name = lifiChain.name.trim()
	if (name === '')
		throw new Error(`Lifi_Rest: chain display name missing for chain ${lifiChain.id}`)

	const metamaskRpcUrls = (
		(lifiChain.metamask?.rpcUrls ?? [])
			.map((u) => u.trim())
			.filter((u) => u.length > 0)
	)
	const iconUrl = resolveMediaUrlTransport(lifiChain.logoURI)?.url
	const nativeCoinInstance = coinInstanceRefFromLifiToken(lifiChain.nativeToken)
	return {
		[EntityMetaKey.Selector]: { caip2: {
			namespace: 'eip155' as const,
			reference: String(lifiChain.id),
		} },
		name,
		environment: (
			lifiChain.mainnet ?
				NetworkEnvironment.Mainnet
			:
				NetworkEnvironment.Testnet
		),
		...(iconUrl != null && {
			iconUrl,
		}),
		...((
			iconMedia
		) => (
			iconMedia != null && {
				$icon: iconMedia,
			}
		))(mediaFromUrl(iconUrl ?? lifiChain.logoURI, MediaType.Image)),
		$$rpcUrls: evmChainCatalogUrlEntities(metamaskRpcUrls),
		$$faucetUrls: evmChainCatalogUrlEntities(lifiChain.faucetUrls ?? []),
		...(nativeCoinInstance != null && {
			$nativeCoinInstance: nativeCoinInstance,
		}),
	}
}

const coinBridgeCapabilityRowsForCoin = async (
	{ coinId }: EntitySelector<typeof schema, EntityType.Coin>
) => {
	const { fetchTokens, fetchTools } = await import('$/sources/Lifi/Rest/queries.ts')
	const { coinBridgeCapabilityEntityRowsFromInstancesAndTools } = await import(
		'$/resolvers/Lifi/Rest/coinBridgeCapabilityEntityRows.ts'
	)
	return coinBridgeCapabilityEntityRowsFromInstancesAndTools(
		Object.values((await fetchTokens()).tokens)
			.flat()
			.filter((token) => token.coinKey === coinId)
			.flatMap((token) => {
				const coinInstance = coinInstanceRefFromLifiToken(token)
				if (coinInstance == null)
					return []

				const parsedSelector = parseEntitySelector(
					schema,
					entityDefinitionByType[EntityType.EvmCoinInstance],
					coinInstance[EntityMetaKey.Selector]
				)
				return parsedSelector instanceof type.errors ?
					[]
				:
						[{
							[EntityMetaKey.Selector]: lifiCoinInstanceSelector(parsedSelector),
						}]
			}),
		(await fetchTools()).bridges.map((tool) => ({
			key: tool.key,
			supportedChains: tool.supportedChains,
		}))
	)
}

const coinIdForBridgeInstanceSelector = async (
	entitySelector: EntitySelector<typeof schema, EntityType.EvmCoinInstance>,
	context: ResolverContext
) => {
	const lifiEntitySelector = lifiCoinInstanceSelector(entitySelector)
	if (
		lifiEntitySelector.type === CoinInstanceType.NativeCurrency
		&& lifiEntitySelector.$network.caip2.reference === '1'
	)
		return CoinId.ETH

	const { resolveCoinIdForCoinInstanceEntitySelector } = await import(
		'$/resolvers/Coingecko/Rest/coinInstances.ts'
	)
	const coinId = await resolveCoinIdForCoinInstanceEntitySelector(
		lifiEntitySelector,
		context.publicEnv
	)
	if (coinId == null)
		throw new Error('Lifi_Rest: coin instance not mapped to catalog coin')
	return coinId
}

const coinBridgeCapabilitiesForInstance = async (
	entitySelector: EntitySelector<typeof schema, EntityType.EvmCoinInstance>,
	context: ResolverContext,
	direction: 'inbound' | 'outbound'
) => {
	const { filterCoinBridgeCapabilityRowsForInstance } = await import(
		'$/resolvers/Lifi/Rest/coinBridgeCapabilities.ts'
	)
	return filterCoinBridgeCapabilityRowsForInstance(
		await coinBridgeCapabilityRowsForCoin({
			coinId: await coinIdForBridgeInstanceSelector(entitySelector, context),
		}),
		lifiCoinInstanceSelector(entitySelector),
		direction
	)
}

export default {
	source: Source.Lifi_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [{
						caip2: {
							namespace: 'eip155',
						},
					}],
					resolve: async ({ caip2 }) => {
						if (caip2.namespace !== 'eip155')
							throw new Error('Lifi_Rest: only eip155 networks are supported')

						const chainId = lifiEvmChainId(caip2.reference)
						const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
						const lifiChain = (await fetchChains()).chains.find((chain) => chain.id === chainId)
						if (lifiChain == null)
							throw new Error('Lifi_Rest: chain not in LI.FI catalog')

						return networkSnapshotFromLifiChain(lifiChain)
					},
				}
			},
		})({
				name: (network) => network.name,
				environment: (network) => network.environment,
				iconUrl: (network) => network.iconUrl,
				$icon: (network) => network.$icon,
				$$faucetUrls: (network) => network.$$faucetUrls,
				Evm: {
					$$rpcUrls: (network) => network.$$rpcUrls,
					$nativeCoinInstance: (network) => network.$nativeCoinInstance,
				},
			}),

		defineResolver({
			entityType: EntityType.CoinBridgeCapability,
			resolve: {
				EvmCoinInstanceEvmCoinInstanceToolKey: {
					resolve: async ({ toolKey }) => {
						const coinBridgeCapabilityFields = bridgeToolByKey[toolKey]
						if (coinBridgeCapabilityFields == null)
							throw new Error(`Lifi_Rest: unknown LI.FI tool key ${toolKey}`)
						return {
							toolKey: coinBridgeCapabilityFields.key,
							...coinBridgeCapabilityFields,
						}
					},
				}
			},
		})({
				toolKey: (capability) => capability.toolKey,
				railId: (capability) => capability.railId,
				settlementModel: (capability) => capability.settlementModel,
				verificationModel: (capability) => capability.verificationModel,
				assetOutcome: (capability) => capability.assetOutcome,
			}),

		defineResolver({
			entityType: EntityType.BridgeRoute,
			resolve: {
				Quote: {
					resolve: async (entitySelector) => {
						const { fetchBridgeRouteBundleForQuoteId } = await import(
							'$/resolvers/Lifi/Rest/routes.ts'
						)
						const bundle = await fetchBridgeRouteBundleForQuoteId(
							entitySelector
						)
						return {
							...bundle.routeFields,
							$$steps: bundle.steps,
						}
					},
				}
			},
		})({
				$$steps: {
					select: (route) => route.$$steps.map((step) => ({
						[EntityMetaKey.Selector]: step[EntityMetaKey.Selector],
					})),
					resolveCount: (route) => route.$$steps.length,
				},
				$fromNetwork: (route) => route.$fromNetwork,
				$toNetwork: (route) => route.$toNetwork,
				fromAmount: (route) => route.fromAmount,
				toAmount: (route) => route.toAmount,
				toAmountMin: (route) => route.toAmountMin,
				estimatedCostUsd: (route) => route.estimatedCostUsd,
				estimatedDurationSeconds: (route) => route.estimatedDurationSeconds,
				tags: (route) => route.tags,
			}),

		defineResolver({
			entityType: EntityType.BridgeRouteStep,
			resolve: {
				RouteIndexInRoute: {
					resolve: async ({ $route, indexInRoute }) => {
						const { fetchBridgeRouteBundleForQuoteId } = await import(
							'$/resolvers/Lifi/Rest/routes.ts'
						)
						const bundle = await fetchBridgeRouteBundleForQuoteId(
							$route
						)
						const step = bundle.steps.at(indexInRoute)
						if (step == null)
							throw new Error('Lifi_Rest: route step index out of range')

						const { [EntityMetaKey.Selector]: _id, ...fields } = step
						return fields
					},
				}
			},
		})({
				stepType: (step) => step.stepType,
				tool: (step) => step.tool,
				$fromNetwork: (step) => step.$fromNetwork,
				$toNetwork: (step) => step.$toNetwork,
				$fromToken: (step) => step.$fromToken,
				$toToken: (step) => step.$toToken,
				railId: (step) => step.railId,
				settlementModel: (step) => step.settlementModel,
				verificationModel: (step) => step.verificationModel,
				assetOutcome: (step) => step.assetOutcome,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
						return (await fetchChains()).chains.map((lifiChain) => ({
							[EntityMetaKey.Selector]: networkSnapshotFromLifiChain(lifiChain)[EntityMetaKey.Selector],
						}))
					},
				}
			},
		})({
				$$evmNetworks: (networks) => networks,
			}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async (entitySelector) => {
						return coinBridgeCapabilityRowsForCoin(entitySelector)
					},
				}
			},
		})({
				$$bridgeCapabilities: (capabilities) => capabilities,
			}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkType: {
					resolve: (entitySelector, context) => (
						coinBridgeCapabilitiesForInstance(entitySelector, context, 'outbound')
					),
				},
				NetworkTypeContract: {
					resolve: (entitySelector, context) => (
						coinBridgeCapabilitiesForInstance(entitySelector, context, 'outbound')
					),
				},
			},
		})({
				NativeCurrency: {
					$$outboundBridgeCapabilities: (capabilities) => capabilities,
				},
				Erc20Token: {
					$$outboundBridgeCapabilities: (capabilities) => capabilities,
				},
			}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkType: {
					resolve: (entitySelector, context) => (
						coinBridgeCapabilitiesForInstance(entitySelector, context, 'inbound')
					),
				},
				NetworkTypeContract: {
					resolve: (entitySelector, context) => (
						coinBridgeCapabilitiesForInstance(entitySelector, context, 'inbound')
					),
				},
			},
		})({
				NativeCurrency: {
					$$inboundBridgeCapabilities: (capabilities) => capabilities,
				},
				Erc20Token: {
					$$inboundBridgeCapabilities: (capabilities) => capabilities,
				},
			}),

		defineResolver({
			entityType: EntityType.BridgeTransfer,
			resolve: {
				SourceTransferId: {
					resolve: lifiBridgeTransferSnapshot,
				},
				SourceTxSourceLogIndex: {
					resolve: lifiBridgeTransferSnapshot,
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
			$toToken: (transfer) => transfer.$toToken,
			amountIn: (transfer) => transfer.amountIn,
			amountOut: (transfer) => transfer.amountOut,
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
					resolve: async ({ $transfer, timestampMs, source }) => {
						if (source !== Source.Lifi_Rest)
							throw new Error(`Lifi_Rest: unsupported bridge transfer timestamp source ${source}`)

						const {
							status,
							toNetwork,
						} = await lifiTransferStatusSnapshot(
							$transfer
						)
						const destinationTxHash = (
							status.receiving == null || toNetwork == null ?
								undefined
							:
								hexLowerOfByteSize(status.receiving.txHash, 32)
						)
						const fillGasFee = (
							status.receiving?.gasAmount != null ?
								BigInt(status.receiving.gasAmount)
							:
								undefined
						)
						const fillGasFeeUsd = status.receiving?.gasAmountUSD

						return {
							$transfer: {
								[EntityMetaKey.Selector]: $transfer,
							},
							timestampMs,
							source,
							status: status.status,
							...(status.substatus != null && { substatus: status.substatus }),
							...(destinationTxHash != null && { destinationTxHash }),
							...(status.status === 'DONE' && status.receiving?.timestamp != null && {
								completedAt: status.receiving.timestamp * 1_000,
							}),
							...(fillGasFee != null && { fillGasFee }),
							...(fillGasFeeUsd != null && { fillGasFeeUsd }),
							...((status.status === 'FAILED' || status.status === 'INVALID') && status.substatusMessage != null && {
								error: status.substatusMessage,
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
			completedAt: (observation) => observation.completedAt,
			fillGasFee: (observation) => observation.fillGasFee,
			fillGasFeeUsd: (observation) => observation.fillGasFeeUsd,
			error: (observation) => observation.error,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [{
						caip2: {
							namespace: 'eip155',
						},
					}],
					resolve: async ({ caip2 }) => {
						if (caip2.namespace !== 'eip155')
							throw new Error('Lifi_Rest: only eip155 networks are supported')

						const chainId = lifiEvmChainId(caip2.reference)
						const { fetchChains } = await import('$/sources/Lifi/Rest/queries.ts')
						const lifiChain = (await fetchChains()).chains.find((chain) => chain.id === chainId)
						if (lifiChain == null)
							throw new Error('Lifi_Rest: chain not in LI.FI catalog')

						return evmChainCatalogExplorerUrlEntities({
							explorers: (
								(lifiChain.metamask?.blockExplorerUrls ?? [])
									.map((url) => ({ url }))
							),
						})
					},
				}
			},
		})({
				$$blockExplorerUrls: (urls) => urls,
			}),
	],
} satisfies RegisteredSourceResolverModule
