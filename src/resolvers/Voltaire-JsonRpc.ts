import { TransportType } from '$/constants/TransportType.ts'
import {
	executionEndpointsForChainId,
	getDefaultExecutionEndpoint,
} from '$/constants/ExecutionEndpoints.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
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
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'
import type { VoltaireBlockRpc, VoltaireTxRpc } from '$/sources/Voltaire/JsonRpc/types.ts'

const ensTextRecordAvatarHttpUrl = (value: string | null | undefined) => {
	const raw = typeof value === 'string' ? value.trim() : ''
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
				(typeof entry === 'string' ? entry : entry.url)?.trim()
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
	typeof entry === 'string' ?
		entry
	: typeof entry.hash === 'string' ?
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
		.filter((hash): hash is string => typeof hash === 'string' && hash.length > 0)
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
	typeof value !== 'string' ?
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
	if (typeof hex !== 'string') throw new Error(`Voltaire_JsonRpc: txpool ${label} missing`)
	try {
		const n = Number(BigInt(hex))
		if (!Number.isFinite(n) || n < 0) throw new Error('txpool count out of range')
		return n
	} catch {
		throw new Error(`Voltaire_JsonRpc: txpool ${label} not a hex quantity`)
	}
}

const gasUsedRatioLastFromFeeHistory = (feeHistory: { gasUsedRatio: readonly unknown[] }) => {
	const raw = feeHistory.gasUsedRatio.at(-1)
	if (raw == null) return undefined
	if (typeof raw === 'number') return raw
	if (typeof raw === 'string') {
		const n = Number.parseFloat(raw)
		return Number.isFinite(n) ? n : undefined
	}
	return undefined
}

const priorityRewardAt50thFromFeeHistory = (feeHistory: { reward?: string[][] }) => {
	const cell = feeHistory.reward?.at(-1)?.at(0)
	return nonNegativeBigIntFromHex(cell)
}

/** Base fee of the newest block in an `eth_feeHistory` window (`baseFeePerGas` has one extra tail cell for the following block). */
const baseFeeForFeeHistoryNewestBlock = (feeHistory: {
	baseFeePerGas: readonly string[]
	gasUsedRatio: readonly unknown[]
}) => {
	const blockCount = feeHistory.gasUsedRatio.length
	if (blockCount === 0 || feeHistory.baseFeePerGas.length < blockCount) return undefined
	return nonNegativeBigIntFromHex(feeHistory.baseFeePerGas[blockCount - 1])
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
		typeof wire.hash === 'string' ?
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
			typeof wire.timestamp === 'string' ?
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
					typeof blockHeader.hash === 'string' ?
						hexLowerOfByteSize(blockHeader.hash, 32)
					:
						undefined
				)
				const miner = (
					typeof blockHeader.miner === 'string' ?
						hexLowerOfByteSize(blockHeader.miner, 20)
					:
						undefined
				)
				const timestampSeconds = (
					typeof blockHeader.timestamp === 'string' ? ((parsed) => (
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
						typeof blockHeader.gasUsed === 'string' ? ((value) => (
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
						typeof blockHeader.gasLimit === 'string' ? ((value) => (
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
						typeof blockHeader.baseFeePerGas === 'string' ? ((value) => (
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
						typeof blockHeader.blobGasUsed === 'string' ? ((value) => (
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
						typeof blockHeader.excessBlobGas === 'string' ? ((value) => (
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
							blockCount: 5,
							newestBlock: entityId.blockNumber,
							rewardPercentiles: [50],
						})
						const legacyGas = await singleFlight(ethGasPrice)({
							rpcUrl: jsonRpcTransport.rpcUrl,
						})
						let maxPriority: string | undefined
						try {
							maxPriority = await singleFlight(ethMaxPriorityFeePerGas)({
								rpcUrl: jsonRpcTransport.rpcUrl,
							})
						} catch {
							maxPriority = undefined
						}
						return {
							[EntityMetaKey.Id]: entityId,
							baseFeePerGas: baseFeeForFeeHistoryNewestBlock(feeHistory),
							legacyGasPrice: nonNegativeBigIntFromHex(legacyGas),
							maxPriorityFeePerGas: nonNegativeBigIntFromHex(maxPriority),
							gasUsedRatio: gasUsedRatioLastFromFeeHistory(feeHistory),
							priorityFeeRewardAt50thPercentile: priorityRewardAt50thFromFeeHistory(feeHistory),
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
			entityType: EntityType.EvmTransaction,
			resolve: async (entityId) => {
				const {
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
					typeof jsonRpcTransaction.blockNumber === 'string' ? ((value) => (
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
					typeof jsonRpcTransaction.hash === 'string' ?
						(hexLowerOfByteSize(jsonRpcTransaction.hash, 32) ?? entityId.txHash)
					:
						entityId.txHash
				)
				const from = (
					typeof jsonRpcTransaction.from === 'string' ?
						hexLowerOfByteSize(jsonRpcTransaction.from, 20)
					:
						undefined
				)
				const to = (
					typeof jsonRpcTransaction.to === 'string' ?
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
						typeof jsonRpcTransaction.transactionIndex === 'string' ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.transactionIndex)) : undefined
					),
					value: (
						typeof jsonRpcTransaction.value === 'string' ? ((value) => (
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
						typeof jsonRpcTransaction.nonce === 'string' ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.nonce)) : undefined
					),
					...(jsonRpcTransaction.input != null && { input: jsonRpcTransaction.input }),
					gas: (
						typeof jsonRpcTransaction.gas === 'string' ? ((value) => (
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
						typeof jsonRpcTransaction.gasPrice === 'string' ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.gasPrice)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					type: (
						typeof jsonRpcTransaction.type === 'string' ? ((parsed) => (
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
				return {
					...evmTransactionEntityBase,
					...(typeof receipt?.status === 'string' && ((parsed) => (
						Number.isFinite(parsed)
						&& Number.isInteger(parsed)
						&& parsed >= 0
						&& { status: parsed }
					))(Number(receipt.status))),
					...(typeof receipt?.gasUsed === 'string' && ((value) => (
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
					...(typeof receipt?.effectiveGasPrice === 'string' && ((value) => (
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
					logs: (
						receipt?.logs?.map((log) => {
							const logAddress = (
								typeof log.address === 'string' ?
									hexLowerOfByteSize(log.address, 20)
								:
									undefined
							)
							const logTxHash = (
								typeof log.transactionHash === 'string' ?
									hexLowerOfByteSize(log.transactionHash, 32)
								:
									undefined
							)
							return {
								...(logAddress != null && { address: logAddress }),
								...(log.topics != null && { topics: log.topics }),
								...(log.data != null && { data: log.data }),
								...(log.blockNumber != null && { blockNumber: log.blockNumber }),
								...(logTxHash != null && { transactionHash: logTxHash }),
								...(log.logIndex != null && { logIndex: log.logIndex }),
							}
						})
						?? []
					),
					...(typeof receipt?.contractAddress === 'string' && ((address) => (
						address != null && {
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					))(hexLowerOfByteSize(receipt.contractAddress, 20))),
				}
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
					while (!signal.aborted) {
						for (const jsonRpcTransport of candidateTransports) {
							if (signal.aborted) break
							const provider = getVoltaireProviderForExecutionUrl({
								url: jsonRpcTransport.rpcUrl,
								transportType: jsonRpcTransport.transportType,
							})
							try {
								const currentHead = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
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
										continue
									}

									deleteEntityFieldRows('blockHeight', { sources: [Source.Voltaire_JsonRpc] })
									writeEntityFieldUpserts('blockHeight', [{
										source: Source.Voltaire_JsonRpc,
										value: event.metadata.chainHead,
									}])

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
										}
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
			resolve: async (entityId) => {
				const { ethBlockNumber } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const jsonRpcTransports = await dedupedJsonRpcTransportCandidatesForExecutionChain(entityId.chainId)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$gasFeeBlocks on chain ${String(entityId.chainId)}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const hex = await singleFlight(ethBlockNumber)({
							rpcUrl: jsonRpcTransport.rpcUrl,
						})
						const blockNumber = nonNegativeBigIntFromHex(hex)
						if (blockNumber == null) {
							errors.push(`${jsonRpcTransport.rpcUrl}: eth_blockNumber missing`)
							continue
						}
						return (
							[
								{
									[EntityMetaKey.Id]: {
										$network: entityId,
										blockNumber,
									},
								},
							]
						)
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
							timestampNs: BigInt(Date.now()) * 1_000_000n,
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
						const rowsUncertain = await Promise.all(
							Array.from({ length: depth }, async (_, slotIndex) => {
								const slotQuantityHex = (
									`0x${BigInt(slotIndex).toString(16).padStart(64, '0')}`
								) as `0x${string}`
								const valueHex = await singleFlight(ethGetStorageAt)({
									rpcUrl: jsonRpcTransport.rpcUrl,
									address: entityId.address,
									slotQuantityHex,
									blockTag: 'latest',
								})
								const slotNormalized = hexLowerOfByteSize(slotQuantityHex, 32)
								const value = hexLowerOfByteSize(valueHex, 32)
								if (slotNormalized == null || value == null) return undefined
								return { slot: slotNormalized, value }
							}),
						)
						return rowsUncertain.flatMap((row) => row == null ? [] : [row])
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.storageSlotReads', errors)
			},
		}),
	],
}
