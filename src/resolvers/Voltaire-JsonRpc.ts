import { TransportType } from '$/constants/TransportType.ts'
import {
	executionEndpointsForChainId,
	getDefaultExecutionEndpoint,
} from '$/constants/ExecutionEndpoints.ts'
import {
	evmContractBytecodeHashFromGetCodeHex,
	evmContractRuntimeCodeFromGetCodeHex,
	evmContractStorageSlotReadsFromEthGetStorageAt,
} from '$/resolvers/_evmContractRpc.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	evmLogEntityFromIdAndWire,
	evmLogEntityIdFromWire,
	findReceiptLogWireForEvmLogId,
} from '$/resolvers/_evmLog.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { StreamBlock } from '@tevm/voltaire/block'
import { stringify } from 'devalue'
import { Hex } from '@tevm/voltaire/Hex'
import {
	defineEntityLiveResolver,
	defineEntityFieldResolver,
	defineEntityResolver,
	type ResolveLiveContext,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import {
	type Entity,
	type EntityId,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'
import { rawCallTraceToTraceRoot } from '$/lib/evm-trace.ts'
import {
	networkGasEstimateTimestampFieldsFromObservation,
	weiToGweiNumber,
} from '$/resolvers/_networkGasEstimateTimestamp.ts'
import type { VoltaireBlockRpc, VoltaireTxRpc } from '$/sources/Voltaire/JsonRpc/types.ts'

const ensTextRecordAvatarHttpUrl = (value: string | null | undefined) => {
	const raw = value?.trim() ?? ''
	if (raw.length === 0) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export const jsonRpcUrlWithTransportForChain = async (
	chainId: number,
	chainlistRpcs?: ChainlistRpcsJsonChain[],
): Promise<{ rpcUrl: string; transportType: TransportType } | undefined> => {
	const defaultExecutionEndpoint = getDefaultExecutionEndpoint(chainId)
	if (defaultExecutionEndpoint != null) {
		return {
			rpcUrl: defaultExecutionEndpoint.url,
			transportType: defaultExecutionEndpoint.transportType,
		}
	}
	const chains = (
		chainlistRpcs
		?? await (await import('$/sources/Chainlist/Rest/queries.ts')).fetchRpcsJson()
	)
	const chain = chains.find((candidate) => candidate.chainId === chainId)
	const chainlistFallbackUrl = (
		(chain?.rpc ?? [])
			.filter((entry) => (
				typeof entry === 'string'
				|| (entry.tracking !== 'yes' && entry.tracking !== 'limited')
			))
			.map((entry) => (
				(entry != null ? entry : entry.url)?.trim()
			))
			.filter((url): url is string => Boolean(url))
			.find((url) => (
				!url.includes('${')
				&& (() => {
					try {
						const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
						return ![
							/api[_-]?key=/i,
							/apikey=/i,
							/key=[a-zA-Z0-9_-]{20,}/i,
							/getblock\.io\/[a-f0-9]+/i,
							/nodereal\.io\/v1\/[a-f0-9]+/i,
							/ankr\.com\/[^/]+\/[a-f0-9]+/i,
						].some((re) => re.test(`${parsed.origin}${parsed.pathname}${parsed.search}`))
					} catch {
						return false
					}
				})()
			))
	)
	if (chainlistFallbackUrl == null) {
		return undefined
	}
	return {
		rpcUrl: chainlistFallbackUrl,
		transportType: TransportType.Http,
	}
}

const dedupedJsonRpcTransportCandidatesForExecutionChain = async (
	chainId: number,
	chainlistRpcs?: ChainlistRpcsJsonChain[],
): Promise<{ rpcUrl: string; transportType: TransportType }[]> => {
	const endpointCandidates = [...executionEndpointsForChainId(chainId)]
	const jsonRpcFallback = await jsonRpcUrlWithTransportForChain(chainId, chainlistRpcs)
	return (
		[
			...endpointCandidates.map((endpoint) => ({
				rpcUrl: endpoint.url,
				transportType: endpoint.transportType,
			})),
			...(jsonRpcFallback == null ? [] : [jsonRpcFallback]),
		]
			.filter((candidate, index, candidates) => (
				candidates.findIndex((other) => (
					other.rpcUrl === candidate.rpcUrl
					&& other.transportType === candidate.transportType
				)) === index
			))
	)
}

const errorMessage = (error: unknown) => (
	error instanceof Error ?
		error.message
	: (() => {
		try {
			return stringify(error)
		} catch {
			return String(error)
		}
	})()
)

const allJsonRpcEndpointsFailedError = (
	chainId: number,
	fieldName: string,
	errors: readonly string[],
) => (
	new Error(`Voltaire_JsonRpc: all JSON-RPC endpoints failed for Network.${fieldName} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
)

const txHashFromBlockTransactionWire = (
	entry: string | VoltaireTxRpc,
): string | undefined => (
	entry != null ?
		entry
	: entry.hash != null ?
		entry.hash
	:
		undefined
)

const evmTransactionRefsForTxHashes = (
	chainId: number,
	transactions: readonly (string | VoltaireTxRpc)[] | undefined,
) => (
	(transactions ?? [])
		.map((entry) => txHashFromBlockTransactionWire(entry))
		.filter((hash): hash is string => hash != null && hash.length > 0)
		.map((hash) => hexLowerOfByteSize(hash, 32))
		.filter((hash): hash is `0x${string}` => hash != null)
		.map((txHash) => ({
			[EntityMetaKey.Id]: {
				$network: { chainId },
				txHash,
			},
		}))
)

const nonNegativeBigIntFromHex = (value: string | undefined) => (
	value == null ?
		undefined
	:	((parsed) => (
			parsed == null || parsed < 0n ?
				undefined
			:	parsed
		))((() => {
			try {
				return BigInt(value)
			} catch {
				return undefined
			}
		})())
)

const txpoolCountFromHex = (label: string, hex: string | undefined): number => {
	if (hex == null) throw new Error(`Voltaire_JsonRpc: txpool ${label} missing`)
	try {
		const n = Number(BigInt(hex))
		if (!Number.isFinite(n) || n < 0) throw new Error('txpool count out of range')
		return n
	} catch {
		throw new Error(`Voltaire_JsonRpc: txpool ${label} not a hex quantity`)
	}
}

const gasUsedRatioAtFromFeeHistory = (
	feeHistory: { gasUsedRatio: readonly unknown[] },
	index: number,
) => {
	const raw = feeHistory.gasUsedRatio.at(index)
	if (raw == null) return undefined
	if (typeof raw === 'number') return raw
	if (typeof raw === 'string') {
		const parsed = Number.parseFloat(raw)
		return Number.isFinite(parsed) ? parsed : undefined
	}
	return undefined
}

const baseFeeAtFromFeeHistory = (
	feeHistory: { baseFeePerGas: readonly string[] },
	index: number,
) => (
	nonNegativeBigIntFromHex(feeHistory.baseFeePerGas.at(index))
)

const priorityRewardAt50thFromFeeHistoryAt = (
	feeHistory: { reward?: string[][] },
	index: number,
) => (
	nonNegativeBigIntFromHex(feeHistory.reward?.at(index)?.at(0))
)

const networkGasFeeBlockRefsFromFeeHistory = (
	networkEntityId: EntityId<typeof schema, EntityType.Network>,
	feeHistory: {
		oldestBlock: string
		gasUsedRatio: readonly unknown[]
	},
) => {
	const oldestBlock = nonNegativeBigIntFromHex(feeHistory.oldestBlock)
	if (oldestBlock == null || feeHistory.gasUsedRatio.length === 0) return []
	return (
		Array.from(
			{ length: feeHistory.gasUsedRatio.length },
			(_entry, index) => ({
				[EntityMetaKey.Id]: {
					$network: networkEntityId,
					blockNumber: oldestBlock + BigInt(index),
				},
			}),
		)
	)
}

const evmBlobEntitiesFromVoltaireBlockWire = (
	chainId: number,
	blockNumber: bigint,
	wire: VoltaireBlockRpc,
): Entity<typeof schema, EntityType.EvmBlob>[] => {
	const txs = wire.transactions ?? []
	const out: Entity<typeof schema, EntityType.EvmBlob>[] = []
	for (const entry of txs) {
		if (typeof entry === 'string') continue
		const txHash = hexLowerOfByteSize(entry.hash ?? '', 32)
		if (txHash == null) continue
		const bvh = entry.blobVersionedHashes
		if (bvh == null) continue
		for (let blobIndex = 0; blobIndex < bvh.length; blobIndex += 1) {
			const h = bvh[blobIndex]
			if (typeof h !== 'string') continue
			const versionedHash = hexLowerOfByteSize(h, 32)
			if (versionedHash == null) continue
			out.push({
				[EntityMetaKey.Id]: {
					$network: { chainId },
					txHash,
					blobIndex,
				},
				$block: {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						blockNumber,
					},
					number: blockNumber,
				} satisfies Entity<typeof schema, EntityType.EvmBlock>,
				$transaction: {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						txHash,
					},
				} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
				versionedHash,
			})
		}
	}
	return out
}

const networkScopedEvmBlockFieldsFromVoltaireBlockRpc = (
	chainId: number,
	wire: VoltaireBlockRpc,
) => {
	const blockHash = (
		wire.hash != null ?
			hexLowerOfByteSize(wire.hash, 32)
		:
			undefined
	)
	const blockNumber = (() => {
		try {
			return BigInt(wire.number)
		} catch {
			return undefined
		}
	})()
	if (blockNumber == null) {
		return null
	}
	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			blockNumber,
			...(blockHash != null && { hash: blockHash }),
		},
		number: blockNumber,
		timestamp: (
			wire.timestamp != null ?
				((parsed) => (
					Number.isFinite(parsed) ? parsed * 1000 : undefined
				))(Number(wire.timestamp))
			:	typeof wire.timestamp === 'number' ?
				wire.timestamp * 1000
			:
				undefined
		),
		gasUsed: nonNegativeBigIntFromHex(wire.gasUsed),
		gasLimit: nonNegativeBigIntFromHex(wire.gasLimit),
		baseFeePerGas: nonNegativeBigIntFromHex(wire.baseFeePerGas),
		blobGasUsed: nonNegativeBigIntFromHex(wire.blobGasUsed),
		excessBlobGas: nonNegativeBigIntFromHex(wire.excessBlobGas),
		transactionCount: (wire.transactions ?? []).length,
	}
}

export default {
	source: Source.Voltaire_JsonRpc,
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmBlock,
			resolve: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
					voltaireBlockWireAsRpcHeader,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')

				const voltaireBlockWire = await singleFlight(getBlockByNumberForRpcUrl)({
					...jsonRpcTransport,
					blockNumber: entityId.blockNumber,
					fullTransactions: false,
				})
				if (voltaireBlockWire == null) throw new Error('Voltaire_JsonRpc: block not returned from RPC')

				const blockHeader = voltaireBlockWireAsRpcHeader(voltaireBlockWire)
				const blockNumber = entityId.blockNumber
				const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
				const blockHash = (
					blockHeader.hash != null ?
						hexLowerOfByteSize(blockHeader.hash, 32)
					:
						undefined
				)
				const miner = (
					blockHeader.miner != null ?
						hexLowerOfByteSize(blockHeader.miner, 20)
					:
						undefined
				)
				const timestampSeconds = (
					blockHeader.timestamp != null ? ((parsed) => (
						Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
							parsed
						:
							NaN
					))(Number(blockHeader.timestamp)) : NaN
				)

				const evmBlockEntityBase = {
					[EntityMetaKey.Id]: {
						$network: { chainId: entityId.$network.chainId },
						blockNumber,
						...(blockHash != null && { hash: blockHash }),
					},
					number: blockNumber,
					timestamp: ((timestampSeconds) => (
						Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
					))(timestampSeconds),
					gasUsed: (
						blockHeader.gasUsed != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.gasUsed)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					gasLimit: (
						blockHeader.gasLimit != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.gasLimit)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					baseFeePerGas: (
						blockHeader.baseFeePerGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.baseFeePerGas)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					blobGasUsed: (
						blockHeader.blobGasUsed != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.blobGasUsed)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					excessBlobGas: (
						blockHeader.excessBlobGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.excessBlobGas)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					transactionCount: (blockHeader.transactions ?? []).length,
				}

				const $$transactions = evmTransactionRefsForTxHashes(
					entityId.$network.chainId,
					blockHeader.transactions,
				)

				return {
					...evmBlockEntityBase,
					$$transactions,
					...(parentBlockNumber != null && {
							$parent: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									blockNumber: parentBlockNumber,
								},
								number: parentBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}),
					...(miner != null && {
							$miner: {
								[EntityMetaKey.Id]: {
									address: miner,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmBlob,
			resolve: async (entityId) => {
				const { getTransactionByHashForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const tx = await singleFlight(getTransactionByHashForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				if (tx == null) throw new Error('Voltaire_JsonRpc: blob transaction not found')
				const bvh = tx.blobVersionedHashes
				if (!Array.isArray(bvh) || typeof bvh[entityId.blobIndex] !== 'string') {
					throw new Error('Voltaire_JsonRpc: blob index missing on transaction')
				}
				const versionedHash = hexLowerOfByteSize(bvh[entityId.blobIndex], 32)
				if (versionedHash == null) throw new Error('Voltaire_JsonRpc: invalid blob versioned hash')
				const blockNumber = (() => {
					try {
						return tx.blockNumber != null ? BigInt(tx.blockNumber) : undefined
					} catch {
						return undefined
					}
				})()
				if (blockNumber == null) throw new Error('Voltaire_JsonRpc: blob transaction missing block')
				return {
					[EntityMetaKey.Id]: entityId,
					versionedHash,
					$transaction: {
						[EntityMetaKey.Id]: {
							$network: { chainId },
							txHash: entityId.txHash,
						},
					} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
					$block: {
						[EntityMetaKey.Id]: {
							$network: { chainId },
							blockNumber,
						},
						number: blockNumber,
					} satisfies Entity<typeof schema, EntityType.EvmBlock>,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Network_GasFee_Block,
			resolve: async (entityId) => {
				const {
					ethBlockNumber,
					ethFeeHistory,
					ethGasPrice,
					ethMaxPriorityFeePerGas,
				} = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for Network_GasFee_Block')
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const feeHistory = await singleFlight(ethFeeHistory)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							blockCount: 1,
							newestBlock: entityId.blockNumber,
							rewardPercentiles: [50],
						})
						const headBlockNumber = nonNegativeBigIntFromHex(
							await singleFlight(ethBlockNumber)({
								rpcUrl: jsonRpcTransport.rpcUrl,
							}),
						)
						const isHeadBlock = (
							headBlockNumber != null
							&& headBlockNumber === entityId.blockNumber
						)
						let legacyGasPrice: bigint | undefined
						let maxPriorityFeePerGas: bigint | undefined
						if (isHeadBlock) {
							legacyGasPrice = nonNegativeBigIntFromHex(
								await singleFlight(ethGasPrice)({
									rpcUrl: jsonRpcTransport.rpcUrl,
								}),
							)
							try {
								maxPriorityFeePerGas = nonNegativeBigIntFromHex(
									await singleFlight(ethMaxPriorityFeePerGas)({
										rpcUrl: jsonRpcTransport.rpcUrl,
									}),
								)
							} catch {
								maxPriorityFeePerGas = undefined
							}
						}
						return {
							[EntityMetaKey.Id]: entityId,
							baseFeePerGas: baseFeeAtFromFeeHistory(feeHistory, 0),
							legacyGasPrice,
							maxPriorityFeePerGas,
							gasUsedRatio: gasUsedRatioAtFromFeeHistory(feeHistory, 0),
							priorityFeeRewardAt50thPercentile: priorityRewardAt50thFromFeeHistoryAt(feeHistory, 0),
						}
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'Network_GasFee_Block', errors)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Network_Txpool_Timestamp,
			resolve: async (entityId) => {
				const { txpoolStatus } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for Network_Txpool_Timestamp')
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const status = await singleFlight(txpoolStatus)({
							rpcUrl: jsonRpcTransport.rpcUrl,
						})
						return {
							[EntityMetaKey.Id]: entityId,
							pendingCount: txpoolCountFromHex('pending', status.pending),
							queuedCount: txpoolCountFromHex('queued', status.queued),
						}
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'Network_Txpool_Timestamp', errors)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Network_GasEstimate_Timestamp,
			resolve: async (entityId) => {
				const { ethGasPrice, ethMaxPriorityFeePerGas } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const {
					getBlockByNumberForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) {
					throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for Network_GasEstimate_Timestamp')
				}
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const legacyGasPriceWei = nonNegativeBigIntFromHex(
							await singleFlight(ethGasPrice)({
								rpcUrl: jsonRpcTransport.rpcUrl,
							}),
						)
						let maxPriorityFeePerGasWei: bigint | undefined
						try {
							maxPriorityFeePerGasWei = nonNegativeBigIntFromHex(
								await singleFlight(ethMaxPriorityFeePerGas)({
									rpcUrl: jsonRpcTransport.rpcUrl,
								}),
							)
						} catch {
							maxPriorityFeePerGasWei = undefined
						}
						const baseFeePerGasWei = nonNegativeBigIntFromHex(
							(await singleFlight(getBlockByNumberForRpcUrl)({
								...jsonRpcTransport,
								blockNumber: 'latest',
								fullTransactions: false,
							}))?.baseFeePerGas,
						)
						if (legacyGasPriceWei == null) {
							errors.push(`${jsonRpcTransport.rpcUrl}: eth_gasPrice returned a non-hex value`)
							continue
						}
						return networkGasEstimateTimestampFieldsFromObservation({
							timestampMs: entityId.timestampMs,
							averageGwei: weiToGweiNumber(legacyGasPriceWei),
							legacyGasPriceWei,
							...(maxPriorityFeePerGasWei != null && { maxPriorityFeePerGasWei }),
							...(baseFeePerGasWei != null && { baseFeePerGasWei }),
							transport: 'voltaire-json-rpc',
						})
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'Network_GasEstimate_Timestamp', errors)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EnsName,
			resolve: async (entityId) => {
				const {
					normalizeEnsName,
					resolveEnsForwardForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const { ensEthereumChainId, ensTextRecordKeys } = await import('$/constants/Ens.ts')
				const chainId = ensEthereumChainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const normalizedName = normalizeEnsName(entityId.name)
				const resolution = await singleFlight(resolveEnsForwardForRpcUrl)({
					...jsonRpcTransport,
					name: normalizedName,
					textKeys: [...ensTextRecordKeys],
				})
				return {
					...(Object.keys(resolution.textRecords).length > 0 && { textRecords: resolution.textRecords }),
					...(resolution.contentHash != null && { contentHash: resolution.contentHash }),
					...(resolution.resolverAbiJson != null && { resolverAbiJson: resolution.resolverAbiJson }),
					...(Object.keys(resolution.coinAddresses).length > 0 && { coinAddresses: resolution.coinAddresses }),
					...(resolution.address != null && {
							$resolvedActor: {
								[EntityMetaKey.Id]: {
									address: resolution.address,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					...(resolution.owner != null && {
							$ownerActor: {
								[EntityMetaKey.Id]: {
									address: resolution.owner,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					...(resolution.resolver != null && {
							$resolverContract: {
								[EntityMetaKey.Id]: {
									$network: { chainId: ensEthereumChainId },
									address: resolution.resolver,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActorCoinAllowance,
			resolve: async (entityId) => {
				const { ethCall } = await import('$/sources/Evm/JsonRpc/queries.ts')
				if (entityId.$actorCoin.$coinInstance.type !== CoinInstanceType.Erc20Token) {
					throw new Error('Voltaire_JsonRpc: ActorCoinAllowance only supports ERC-20 coin instances')
				}
				const chainId = entityId.$actorCoin.$coinInstance.$network.chainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const tokenContract = entityId.$actorCoin.$coinInstance.$contract.address
				const owner = hexLowerOfByteSize(entityId.$actorCoin.$actor.address, 20)
				const spender = hexLowerOfByteSize(entityId.$spender.address, 20)
				if (owner == null || spender == null) {
					throw new Error('Voltaire_JsonRpc: ActorCoinAllowance owner or spender address not normalized')
				}
				const allowanceCallData = (
					`0xdd62ed3e${`${'0'.repeat(24)}${owner.slice(2).toLowerCase()}`}${`${'0'.repeat(24)}${spender.slice(2).toLowerCase()}`}` as `0x${string}`
				)
				const raw = await ethCall({
					rpcUrl: jsonRpcTransport.rpcUrl,
					to: tokenContract,
					data: allowanceCallData,
				})
				const allowance = (
					raw.startsWith('0x') ?
						BigInt(raw)
					:
						(() => {
							throw new Error('Voltaire_JsonRpc: eth_call allowance returned non-hex')
						})()
				)
				return {
					allowance,
					lastChecked: Date.now(),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTransaction,
			resolve: async (entityId) => {
				const {
					debugTraceTransactionForRpcUrl,
					getTransactionByHashForRpcUrl,
					getTransactionReceiptForRpcUrl,
					voltaireReceiptWireAsRpcReceipt,
					voltaireTxWireAsRpcTx,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const voltaireTransactionWire = await singleFlight(getTransactionByHashForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				if (voltaireTransactionWire == null) throw new Error('Voltaire_JsonRpc: transaction not returned from RPC')
				const jsonRpcTransaction = voltaireTxWireAsRpcTx(voltaireTransactionWire, entityId.txHash)
				const containingBlockNumber = (
					jsonRpcTransaction.blockNumber != null ? ((value) => (
						value == null || value < 0n ? undefined : value
					))((() => {
						try {
							return BigInt(jsonRpcTransaction.blockNumber)
						} catch {
							return undefined
						}
					})()) : undefined
				)
				const txHash = (
					jsonRpcTransaction.hash != null ?
						(hexLowerOfByteSize(jsonRpcTransaction.hash, 32) ?? entityId.txHash)
					:
						entityId.txHash
				)
				const from = (
					jsonRpcTransaction.from != null ?
						hexLowerOfByteSize(jsonRpcTransaction.from, 20)
					:
						undefined
				)
				const to = (
					jsonRpcTransaction.to != null ?
						hexLowerOfByteSize(jsonRpcTransaction.to, 20)
					:
						undefined
				)
				const evmTransactionEntityBase = {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						txHash,
					},
					...(containingBlockNumber != null && {
							$block: {
								[EntityMetaKey.Id]: {
									$network: { chainId },
									blockNumber: containingBlockNumber,
								},
								number: containingBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}),
					...(from != null && {
							$from: {
								[EntityMetaKey.Id]: {
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					...(to != null && {
							$to: {
								[EntityMetaKey.Id]: {
									address: to,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					transactionIndex: (
						jsonRpcTransaction.transactionIndex != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.transactionIndex)) : undefined
					),
					value: (
						jsonRpcTransaction.value != null ? ((value) => (
							value == null || value < 0n ? 0n : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.value)
							} catch {
								return undefined
							}
						})()) : 0n
					),
					nonce: (
						jsonRpcTransaction.nonce != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.nonce)) : undefined
					),
					...(jsonRpcTransaction.input != null && { input: jsonRpcTransaction.input }),
					gas: (
						jsonRpcTransaction.gas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.gas)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					gasPrice: (
						jsonRpcTransaction.gasPrice != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.gasPrice)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					maxFeePerGas: (
						jsonRpcTransaction.maxFeePerGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.maxFeePerGas)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					maxPriorityFeePerGas: (
						jsonRpcTransaction.maxPriorityFeePerGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.maxPriorityFeePerGas)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					type: (
						jsonRpcTransaction.type != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.type)) : undefined
					),
				}
				const receiptWire = (
					await singleFlight(getTransactionReceiptForRpcUrl)({
						...jsonRpcTransport,
						txHash: entityId.txHash,
					})
				)
				const receipt = receiptWire == null ? null : voltaireReceiptWireAsRpcReceipt(receiptWire)
				const rawCallTrace = await singleFlight(debugTraceTransactionForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				return {
					...evmTransactionEntityBase,
					...(receipt?.status != null && ((parsed) => (
						Number.isFinite(parsed)
						&& Number.isInteger(parsed)
						&& parsed >= 0
						&& { status: parsed }
					))(Number(receipt.status))),
					...(receipt?.gasUsed != null && ((value) => (
						value != null
						&& !(value < 0n)
						&& { gasUsed: value }
					))((() => {
						try {
							return BigInt(receipt.gasUsed)
						} catch {
							return undefined
						}
					})())),
					...(receipt?.cumulativeGasUsed != null && ((value) => (
						value != null
						&& !(value < 0n)
						&& { cumulativeGasUsed: value }
					))((() => {
						try {
							return BigInt(receipt.cumulativeGasUsed)
						} catch {
							return undefined
						}
					})())),
					...(receipt?.effectiveGasPrice != null && ((value) => (
						value != null
						&& !(value < 0n)
						&& { effectiveGasPrice: value }
					))((() => {
						try {
							return BigInt(receipt.effectiveGasPrice)
						} catch {
							return undefined
						}
					})())),
					...(receipt?.contractAddress != null && ((address) => (
						address != null && {
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					))(hexLowerOfByteSize(receipt.contractAddress, 20))),
					...(rawCallTrace != null ?
						{
							traceRoot: rawCallTraceToTraceRoot(rawCallTrace),
						}
					:	{
							traceUnavailable: true,
						}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmLog,
			resolve: async (entityId) => {
				const {
					getTransactionReceiptForRpcUrl,
					voltaireReceiptWireAsRpcReceipt,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const receiptWire = await singleFlight(getTransactionReceiptForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				const receipt = receiptWire == null ? null : voltaireReceiptWireAsRpcReceipt(receiptWire)
				const log = findReceiptLogWireForEvmLogId(receipt?.logs, entityId.logIndex)
				if (log == null) {
					throw new Error('Voltaire_JsonRpc: receipt log not found for EvmLog')
				}
				return evmLogEntityFromIdAndWire(entityId, log)
			},
		}),
	],
	entityLiveResolvers: [
		defineEntityLiveResolver({
			entityType: EntityType.Network,
			resolveLive: (ctx: ResolveLiveContext<typeof schema, EntityType.Network>) => {
				void (async () => {
					const {
						deleteEntityFieldRows,
						invalidate,
						parentEntityId,
						signal,
						writeEntityFieldUpserts,
					} = ctx
					const blockFields = [
						'$$blocks',
					] as const
					const activityFields = [
						'$$transactions',
						'$$contracts',
						'$$blobs',
					] as const
					const beaconFields = [
						'$$beaconEpochs',
						'$$beaconSlots',
					] as const
					const allLiveFieldNames = [
						'blockHeight',
						'gasPrice',
						'baseFeePerGas',
						'gasUsedRatio',
						...blockFields,
						...activityFields,
						...beaconFields,
					] as const
					const intervalBackstopFields = [
						'blockHeight',
						'gasPrice',
						'baseFeePerGas',
						'gasUsedRatio',
						'$$blocks',
						'$$transactions',
						'$$contracts',
						'$$blobs',
						'$$beaconEpochs',
						'$$beaconSlots',
					] as const
					const backstop = setInterval(
						() => { void invalidate(intervalBackstopFields) },
						30_000,
					)
					const clear = () => {
						clearInterval(backstop)
					}
					signal.addEventListener('abort', clear, { once: true })
					const candidateTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(
						parentEntityId.chainId,
					)
					if (candidateTransports.length === 0) {
						clear()
						return
					}
					const {
						getChainHeadNumberForRpcUrl,
						getVoltaireProviderForExecutionUrl,
						iterateBlockStreamEvents,
						streamBlockToVoltaireBlockRpcWire,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const waitBeforeRetry = (ms: number) => (
						new Promise<void>((resolve) => {
							const timeout = setTimeout(resolve, ms)
							signal.addEventListener(
								'abort',
								() => {
									clearTimeout(timeout)
									resolve()
								},
								{ once: true },
							)
						})
					)
					const writeRecentBlocksForTransport = async (
						jsonRpcTransport: (typeof candidateTransports)[number],
						recentBlockDepth = 16,
					) => {
						const { getRecentVoltaireBlockWiresForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const { wires } = await getRecentVoltaireBlockWiresForRpcUrl({
							...jsonRpcTransport,
							recentBlockDepth,
						})
						const evmBlockRows = (
							wires
								.flatMap((wire) => (
									wire == null ?
										[]
									: (() => {
										const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
											parentEntityId.chainId,
											wire,
										)
										return (
											value == null ?
												[]
											:	[{
												source: Source.Voltaire_JsonRpc,
												value,
											}]
										)
									})()
								))
						)
						if (evmBlockRows.length > 0) {
							writeEntityFieldUpserts('$$blocks', evmBlockRows)
						}
					}
					while (!signal.aborted) {
						for (const jsonRpcTransport of candidateTransports) {
							if (signal.aborted) break
							const provider = getVoltaireProviderForExecutionUrl({
								url: jsonRpcTransport.rpcUrl,
								transportType: jsonRpcTransport.transportType,
							})
							try {
								const currentHead = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
								deleteEntityFieldRows('blockHeight', { sources: [Source.Voltaire_JsonRpc] })
								writeEntityFieldUpserts('blockHeight', [{
									source: Source.Voltaire_JsonRpc,
									value: currentHead,
								}])
								await writeRecentBlocksForTransport(jsonRpcTransport)
								for await (const event of iterateBlockStreamEvents({
									provider,
									include: 'header',
									signal,
									chainId: parentEntityId.chainId,
									fromBlock: currentHead + 1n,
									maxQueuedBlocks: 16,
									pollingInterval: 1_000,
									retry: {
										initialDelay: 1_000,
										maxDelay: 10_000,
										maxRetries: 5,
									},
								})) {
									if (event.type === 'reorg') {
										await invalidate(allLiveFieldNames)
										try {
											const chainHead = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
											deleteEntityFieldRows('blockHeight', { sources: [Source.Voltaire_JsonRpc] })
											writeEntityFieldUpserts('blockHeight', [{
												source: Source.Voltaire_JsonRpc,
												value: chainHead,
											}])
										} catch {
											// invalidate scheduled refetch
										}
										continue
									}

									deleteEntityFieldRows('blockHeight', { sources: [Source.Voltaire_JsonRpc] })
									writeEntityFieldUpserts('blockHeight', [{
										source: Source.Voltaire_JsonRpc,
										value: event.metadata.chainHead,
									}])
									await invalidate(['$$blocks'])

									if (event.blocks.length > 0) {
										const latestBlock = event.blocks[event.blocks.length - 1]
										const latestBlockFields = (
											latestBlock?.header == null ?
												null
											:	networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
													parentEntityId.chainId,
													streamBlockToVoltaireBlockRpcWire(latestBlock as StreamBlock<'header'>),
												)
										)
										if (latestBlockFields != null) {
											const baseFeePerGas = latestBlockFields.baseFeePerGas
											const gasUsed = latestBlockFields.gasUsed
											const gasLimit = latestBlockFields.gasLimit
											if (baseFeePerGas != null) {
												deleteEntityFieldRows('baseFeePerGas', { sources: [Source.Voltaire_JsonRpc] })
												writeEntityFieldUpserts('baseFeePerGas', [{
													source: Source.Voltaire_JsonRpc,
													value: baseFeePerGas,
												}])
											}
											if (gasUsed != null && gasLimit != null && gasLimit !== 0n) {
												deleteEntityFieldRows('gasUsedRatio', { sources: [Source.Voltaire_JsonRpc] })
												writeEntityFieldUpserts('gasUsedRatio', [{
													source: Source.Voltaire_JsonRpc,
													value: Number(gasUsed) / Number(gasLimit),
												}])
											}
										}
										const evmBlockRows = (
											event.blocks
												.map((block) => {
													if (block.header == null) return null
													const wire = streamBlockToVoltaireBlockRpcWire(block as StreamBlock<'header'>)
													const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(parentEntityId.chainId, wire)
													return (
														value == null ?
															null
														:	{
															source: Source.Voltaire_JsonRpc,
															value,
														}
													)
												})
												.filter((row): row is NonNullable<typeof row> => row != null)
										)
										if (evmBlockRows.length > 0) {
											writeEntityFieldUpserts('$$blocks', evmBlockRows)
										} else {
											await writeRecentBlocksForTransport(jsonRpcTransport, 1)
										}
									} else {
										await writeRecentBlocksForTransport(jsonRpcTransport, 1)
									}

									if (
										event.blocks.some((block) => (
											(block.body?.transactions?.length ?? 0) > 0
										))
									) {
										await invalidate(activityFields)
									}
								}
							} catch (error) {
								if (signal.aborted) return
								console.warn('Voltaire: block stream ended', {
									error,
									rpcUrl: jsonRpcTransport.rpcUrl,
									transportType: jsonRpcTransport.transportType,
								})
								await waitBeforeRetry(1_000)
							}
						}
					}
				})()
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: '$primaryName',
			resolve: async (entityId) => {
				const {
					normalizeEnsName,
					resolveEnsReverseForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const { ensEthereumChainId } = await import('$/constants/Ens.ts')
				const chainId = ensEthereumChainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const ensNameFromReverseLookup = await singleFlight(resolveEnsReverseForRpcUrl)({
					...jsonRpcTransport,
					address: entityId.address,
				})
				if (ensNameFromReverseLookup == null) return undefined
				const normalizedPrimaryName = normalizeEnsName(ensNameFromReverseLookup)
				return {
					[EntityMetaKey.Id]: {
						name: normalizedPrimaryName,
					},
				} satisfies Entity<typeof schema, EntityType.EnsName>
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'blockHeight',
			resolve: async (entityId) => {
				const { getChainHeadNumberForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(
					entityId.chainId,
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.blockHeight on chain ${String(entityId.chainId)}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					try {
						return await singleFlight(getChainHeadNumberForRpcUrl)(jsonRpcTransport)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						continue
					}
				}
				throw allJsonRpcEndpointsFailedError(entityId.chainId, 'blockHeight', errors)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'gasPrice',
			resolve: async (entityId) => {
				const { ethGasPrice } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(
					entityId.chainId,
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.gasPrice on chain ${String(entityId.chainId)}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const value = nonNegativeBigIntFromHex(
							await singleFlight(ethGasPrice)({
								rpcUrl: jsonRpcTransport.rpcUrl,
							}),
						)
						if (value != null) return value
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): eth_gasPrice returned a non-hex value`)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						continue
					}
				}
				throw allJsonRpcEndpointsFailedError(entityId.chainId, 'gasPrice', errors)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'baseFeePerGas',
			resolve: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(
					entityId.chainId,
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.baseFeePerGas on chain ${String(entityId.chainId)}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					try {
						const baseFeePerGas = nonNegativeBigIntFromHex(
							(await singleFlight(getBlockByNumberForRpcUrl)({
								...jsonRpcTransport,
								blockNumber: 'latest',
								fullTransactions: false,
							}))?.baseFeePerGas,
						)
						if (baseFeePerGas != null) return baseFeePerGas
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): latest block missing baseFeePerGas`)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(entityId.chainId, 'baseFeePerGas', errors)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'gasUsedRatio',
			resolve: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(
					entityId.chainId,
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.gasUsedRatio on chain ${String(entityId.chainId)}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					try {
						const block = await singleFlight(getBlockByNumberForRpcUrl)({
							...jsonRpcTransport,
							blockNumber: 'latest',
							fullTransactions: false,
						})
						const gasUsed = nonNegativeBigIntFromHex(block?.gasUsed)
						const gasLimit = nonNegativeBigIntFromHex(block?.gasLimit)
						if (gasUsed != null && gasLimit != null && gasLimit !== 0n) return Number(gasUsed) / Number(gasLimit)
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): latest block missing gas usage`)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(entityId.chainId, 'gasUsedRatio', errors)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$gasFeeBlocks',
			resolve: async (entityId, context) => {
				const { ethFeeHistory } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const blockCount = Math.min(
					32,
					Math.max(1, resolverLoadSubsetRowLimit(context)),
				)
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(entityId.chainId)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$gasFeeBlocks on chain ${String(entityId.chainId)}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const feeHistory = await singleFlight(ethFeeHistory)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							blockCount,
							newestBlock: 'latest',
							rewardPercentiles: [50],
						})
						return networkGasFeeBlockRefsFromFeeHistory(entityId, feeHistory)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(entityId.chainId, '$$gasFeeBlocks', errors)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$txpoolTimestamps',
			resolve: async (entityId) => (
				[
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$gasEstimateTimestamps',
			resolve: async (entityId) => (
				[
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const {
					getRecentVoltaireBlockWiresForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(entityId.chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const { blockNumbers, wires } = await getRecentVoltaireBlockWiresForRpcUrl({
					...jsonRpcTransport,
					recentBlockDepth: subsetRowLimit,
				})
				return (
					wires
						.flatMap((wire, index) => (
							wire == null ?
								[]
							: (() => {
								const blockNumber = blockNumbers[index]
								const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
									entityId.chainId,
									{ ...wire, number: String(Hex.fromBigInt(blockNumber)) },
								)
								return value == null ? [] : [value]
							})()
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blobs',
			resolve: async (entityId, context) => {
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const {
					getBlockByNumberForRpcUrl,
					getChainHeadNumberForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(entityId.chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const head = await singleFlight(getChainHeadNumberForRpcUrl)(jsonRpcTransport)
				const depth = Math.min(Math.max(1, subsetRowLimit), 8)
				const blockNumbers = (
					Array.from({ length: depth }, (_, i) => head - BigInt(i))
						.filter((n) => n >= 0n)
				)
				const wires = await Promise.all(
					blockNumbers.map((blockNumber) => (
						singleFlight(getBlockByNumberForRpcUrl)({
							...jsonRpcTransport,
							blockNumber,
							fullTransactions: true,
						})
					)),
				)
				const byKey = new Map<string, Entity<typeof schema, EntityType.EvmBlob>>()
				for (let i = 0; i < wires.length; i += 1) {
					const w = wires[i]
					if (w == null) continue
					const bn = blockNumbers[i]
					if (bn == null) continue
					for (const row of evmBlobEntitiesFromVoltaireBlockWire(entityId.chainId, bn, w)) {
						byKey.set(stringify(row[EntityMetaKey.Id]), row)
					}
				}
				return [...byKey.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmTransaction,
			fieldName: '$$logs',
			resolve: async (entityId) => {
				const {
					getTransactionReceiptForRpcUrl,
					voltaireReceiptWireAsRpcReceipt,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(entityId.$network.chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const receiptWire = await singleFlight(getTransactionReceiptForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				const receipt = receiptWire == null ? null : voltaireReceiptWireAsRpcReceipt(receiptWire)
				const entities = (
					(receipt?.logs ?? [])
						.flatMap((log) => {
							const id = evmLogEntityIdFromWire({
								$network: entityId.$network,
								txHash: entityId.txHash,
								log,
							})
							return id == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: id,
									}]
						})
						.sort((
							left,
							right,
						) => (
							left[EntityMetaKey.Id].logIndex - right[EntityMetaKey.Id].logIndex
						))
				)
				if (entities.length === 0) {
					throw new Error('Voltaire_JsonRpc: EvmTransaction $$logs returned no log entities')
				}
				return entities
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
					voltaireBlockWireAsRpcHeader,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(entityId.$network.chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const voltaireBlockWire = await singleFlight(getBlockByNumberForRpcUrl)({
					...jsonRpcTransport,
					blockNumber: entityId.blockNumber,
					fullTransactions: false,
				})
				if (voltaireBlockWire == null) throw new Error('Voltaire_JsonRpc: block not returned from RPC')
				const blockHeader = voltaireBlockWireAsRpcHeader(voltaireBlockWire)
				return evmTransactionRefsForTxHashes(
					entityId.$network.chainId,
					blockHeader.transactions,
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: '$icon',
			resolve: async (entityId) => {
				const {
					normalizeEnsName,
					resolveEnsForwardForRpcUrl,
					resolveEnsReverseForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const { ensEthereumChainId, ensTextRecordKeys } = await import('$/constants/Ens.ts')
				const chainId = ensEthereumChainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const ensNameFromReverseLookup = await singleFlight(resolveEnsReverseForRpcUrl)({
					...jsonRpcTransport,
					address: entityId.address,
				})
				if (ensNameFromReverseLookup == null) return undefined
				const normalizedPrimaryName = normalizeEnsName(ensNameFromReverseLookup)
				const { textRecords } = await singleFlight(resolveEnsForwardForRpcUrl)({
					...jsonRpcTransport,
					name: normalizedPrimaryName,
					textKeys: [...ensTextRecordKeys],
				})
				return ((
					t,
				) => (
					t == null ?
						undefined
					:	t
				))(
					mediaFromUrl(ensTextRecordAvatarHttpUrl(
						textRecords.avatar != null ? String(textRecords.avatar) : undefined,
					), MediaType.Image),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'storageSlotReads',
			resolve: async (entityId, context) => {
				const { ethGetStorageAt } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) {
					throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.storageSlotReads on chain ${String(chainId)}`)
				}
				const depth = Math.min(32, Math.max(1, resolverLoadSubsetRowLimit(context)))
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						return await evmContractStorageSlotReadsFromEthGetStorageAt({
							address: entityId.address,
							depth,
							getStorageAt: (slotQuantityHex) => (
								singleFlight(ethGetStorageAt)({
									rpcUrl: jsonRpcTransport.rpcUrl,
									address: entityId.address,
									slotQuantityHex,
									blockTag: 'latest',
								})
							),
						})
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.storageSlotReads', errors)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'code',
			resolve: async (entityId) => {
				const { ethGetCode } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) {
					throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.code on chain ${String(chainId)}`)
				}
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const codeHex = await singleFlight(ethGetCode)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							address: entityId.address,
							blockTag: 'latest',
						})
						return evmContractRuntimeCodeFromGetCodeHex(codeHex)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.code', errors)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'bytecodeHash',
			resolve: async (entityId) => {
				const { ethGetCode } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = entityId.$network.chainId
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) {
					throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.bytecodeHash on chain ${String(chainId)}`)
				}
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const codeHex = await singleFlight(ethGetCode)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							address: entityId.address,
							blockTag: 'latest',
						})
						return evmContractBytecodeHashFromGetCodeHex(codeHex)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.bytecodeHash', errors)
			},
		}),
	],
}
