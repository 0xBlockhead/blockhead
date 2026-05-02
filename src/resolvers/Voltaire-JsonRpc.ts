import { TransportType } from '$/constants/TransportType.ts'
import { executionEndpointsByChainId, getDefaultExecutionEndpoint } from '$/constants/ExecutionEndpoints.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
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
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export const jsonRpcUrlWithTransportForChain = async (
	chainId: number,
): Promise<{ rpcUrl: string; transportType: TransportType } | undefined> => {
	const { chainlistRpcUrlForChainId } = await import('$/sources/Chainlist/Rest/queries.ts')

	const defaultExecutionEndpoint = getDefaultExecutionEndpoint(chainId)
	if (defaultExecutionEndpoint != null) {
		return {
			rpcUrl: defaultExecutionEndpoint.url,
			transportType: defaultExecutionEndpoint.transportType,
		}
	}
	const chainlistFallbackUrl = await chainlistRpcUrlForChainId(chainId)
	if (chainlistFallbackUrl == null) return undefined
	return {
		rpcUrl: chainlistFallbackUrl,
		transportType: TransportType.Http,
	}
}

const jsonRpcTransportsForChain = async (
	chainId: number,
): Promise<{ rpcUrl: string; transportType: TransportType }[]> => {
	const endpointCandidates = [
		...(
			executionEndpointsByChainId[chainId as keyof typeof executionEndpointsByChainId]
			?? []
		),
	]
	const jsonRpcFallback = await jsonRpcUrlWithTransportForChain(chainId)
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

const evmBlockTransactionRefsFromChainAndHashes = (
	chainId: number,
	transactionHashes: readonly `0x${string}`[] | undefined,
	transactionRowCap: number,
) => (
	(transactionHashes ?? [])
		.filter((hash) => Hex.isHex(hash) && Hex.size(hash) === 32)
		.slice(0, transactionRowCap)
		.map((transactionHashHex) => ({
			[EntityMetaKey.Id]: {
				$network: { chainId },
				txHash: transactionHashHex.toLowerCase() as `0x${string}`,
			},
		}))
)

export default {
	source: Source.Voltaire_JsonRpc,
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmBlock,
			resolve: async (entityId, context) => {
				const transactionRowCap = resolverLoadSubsetRowLimit(context) ?? 0
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
					typeof blockHeader.hash === 'string' && Hex.isHex(blockHeader.hash) && Hex.size(blockHeader.hash) === 32 ?
						blockHeader.hash.toLowerCase() as `0x${string}`
					:
						undefined
				)
				const miner = (
					typeof blockHeader.miner === 'string' && Hex.isHex(blockHeader.miner) && Hex.size(blockHeader.miner) === 20 ?
						blockHeader.miner.toLowerCase() as `0x${string}`
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
						...(blockHash != null ?
							{ hash: blockHash }
						:	{}),
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
					transactionCount: (blockHeader.transactions ?? []).length,
				}

				const $$evmTransactions = evmBlockTransactionRefsFromChainAndHashes(
					entityId.$network.chainId,
					(blockHeader.transactions ?? []) as readonly `0x${string}`[] | undefined,
					transactionRowCap,
				)

				return {
					...evmBlockEntityBase,
					$$evmTransactions,
					...(parentBlockNumber != null ?
						{
							$parent: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									blockNumber: parentBlockNumber,
								},
								number: parentBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}
					:	{}),
					...(miner != null ?
						{
							$miner: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: miner,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
				}
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
					...(Object.keys(resolution.textRecords).length > 0 ?
						{ textRecords: resolution.textRecords }
					:	{}),
					...(resolution.contentHash != null ?
						{ contentHash: resolution.contentHash }
					:	{}),
					...(Object.keys(resolution.coinAddresses).length > 0 ?
						{ coinAddresses: resolution.coinAddresses }
					:	{}),
					...(resolution.address != null ?
						{
							$resolvedActor: {
								[EntityMetaKey.Id]: {
									$network: { chainId: ensEthereumChainId },
									address: resolution.address,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					...(resolution.owner != null ?
						{
							$ownerActor: {
								[EntityMetaKey.Id]: {
									$network: { chainId: ensEthereumChainId },
									address: resolution.owner,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					...(resolution.resolver != null ?
						{
							$resolverContract: {
								[EntityMetaKey.Id]: {
									$network: { chainId: ensEthereumChainId },
									address: resolution.resolver,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					:	{}),
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
					typeof jsonRpcTransaction.hash === 'string' && Hex.isHex(jsonRpcTransaction.hash) && Hex.size(jsonRpcTransaction.hash) === 32 ?
						jsonRpcTransaction.hash.toLowerCase() as `0x${string}`
					:
						entityId.txHash
				)
				const from = (
					typeof jsonRpcTransaction.from === 'string' && Hex.isHex(jsonRpcTransaction.from) && Hex.size(jsonRpcTransaction.from) === 20 ?
						jsonRpcTransaction.from.toLowerCase() as `0x${string}`
					:
						undefined
				)
				const to = (
					typeof jsonRpcTransaction.to === 'string' && Hex.isHex(jsonRpcTransaction.to) && Hex.size(jsonRpcTransaction.to) === 20 ?
						jsonRpcTransaction.to.toLowerCase() as `0x${string}`
					:
						undefined
				)
				const evmTransactionEntityBase = {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						txHash,
					},
					...(containingBlockNumber != null ?
						{
							$block: {
								[EntityMetaKey.Id]: {
									$network: { chainId },
									blockNumber: containingBlockNumber,
								},
								number: containingBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}
					:	{}),
					...(from != null ?
						{
							$from: {
								[EntityMetaKey.Id]: {
									$network: { chainId },
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					...(to != null ?
						{
							$to: {
								[EntityMetaKey.Id]: {
									$network: { chainId },
									address: to,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
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
					...(jsonRpcTransaction.input != null ? { input: jsonRpcTransaction.input } : {}),
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
				const voltaireReceiptWire = await singleFlight(getTransactionReceiptForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				const receiptWire = voltaireReceiptWire == null ? null : voltaireReceiptWireAsRpcReceipt(voltaireReceiptWire)
				return {
					...evmTransactionEntityBase,
					...(typeof receiptWire?.status === 'string' ? ((parsed) => (
						Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
							{ status: parsed }
						:
							{}
					))(Number(receiptWire.status)) : {}),
					...(typeof receiptWire?.gasUsed === 'string' ? ((value) => (
						value == null || value < 0n ? {} : { gasUsed: value }
					))((() => {
						try {
							return BigInt(receiptWire.gasUsed)
						} catch {
							return undefined
						}
					})()) : {}),
					...(typeof receiptWire?.effectiveGasPrice === 'string' ? ((value) => (
						value == null || value < 0n ? {} : { effectiveGasPrice: value }
					))((() => {
						try {
							return BigInt(receiptWire.effectiveGasPrice)
						} catch {
							return undefined
						}
					})()) : {}),
					logs: (
						receiptWire != null && receiptWire.logs != null ?
							receiptWire.logs.map((log) => ({
								...(typeof log.address === 'string' && Hex.isHex(log.address) && Hex.size(log.address) === 20 ? { address: log.address.toLowerCase() as `0x${string}` } : {}),
								...(log.topics != null ? { topics: log.topics } : {}),
								...(log.data != null ? { data: log.data } : {}),
								...(log.blockNumber != null ? { blockNumber: log.blockNumber } : {}),
								...(typeof log.transactionHash === 'string' && Hex.isHex(log.transactionHash) && Hex.size(log.transactionHash) === 32 ?
									{ transactionHash: log.transactionHash.toLowerCase() as `0x${string}` }
								:	{}),
								...(log.logIndex != null ? { logIndex: log.logIndex } : {}),
							}))
						:	[]
					),
					...(typeof receiptWire?.contractAddress === 'string' && Hex.isHex(receiptWire.contractAddress) && Hex.size(receiptWire.contractAddress) === 20 ?
						{
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: receiptWire.contractAddress.toLowerCase() as `0x${string}`,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					:	{}),
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
						'$$evmBlocks',
					] as const
					const activityFields = [
						'$$evmTransactions',
						'$$evmContracts',
					] as const
					const beaconFields = [
						'$$beaconEpochs',
						'$$beaconSlots',
					] as const
					const allLiveFieldNames = [
						'blockHeight',
						...blockFields,
						...activityFields,
						...beaconFields,
					] as const
					const intervalBackstopFields = [
						'blockHeight',
						'$$evmBlocks',
						'$$evmTransactions',
						'$$evmContracts',
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
					const candidateTransports = await jsonRpcTransportsForChain(parentEntityId.chainId)
					if (candidateTransports.length === 0) {
						clear()
						return
					}
					const {
						evmBlockNetworkFieldValueFromVoltaireWire,
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
							console.info('[Voltaire] block stream watch start', {
								chainId: parentEntityId.chainId,
								rpcUrl: jsonRpcTransport.rpcUrl,
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
										const evmBlockRows = (
											event.blocks
												.map((block) => {
													const wire = streamBlockToVoltaireBlockRpcWire(block)
													const value = evmBlockNetworkFieldValueFromVoltaireWire({
														chainId: parentEntityId.chainId,
														wire,
													})
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
											writeEntityFieldUpserts('$$evmBlocks', evmBlockRows)
										}
									}

									if (
										event.blocks.some((block) => (
											block.body.transactions.length > 0
										))
									) {
										await invalidate(activityFields)
									}
								}
							} catch (error) {
								if (signal.aborted) return
								console.error('Voltaire: block stream ended', {
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
				if (jsonRpcTransport == null) return undefined
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
				const jsonRpcTransports = await jsonRpcTransportsForChain(entityId.chainId)
				if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				for (const jsonRpcTransport of jsonRpcTransports) {
					try {
						return await singleFlight(getChainHeadNumberForRpcUrl)(jsonRpcTransport)
					} catch {
						continue
					}
				}
				throw new Error('Voltaire_JsonRpc: all JSON-RPC endpoints failed for blockHeight')
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$evmBlocks',
			resolve: async (entityId, context) => {
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				if (subsetRowLimit == null) return []
				const {
					evmBlockNetworkFieldValueFromVoltaireWire,
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
								const blockNumber = blockNumbers[index]!
								const value = evmBlockNetworkFieldValueFromVoltaireWire({
									chainId: entityId.chainId,
									wire: { ...wire, number: String(Hex.fromBigInt(blockNumber)) },
								})
								return value == null ? [] : [value]
							})()
						))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.EvmBlock,
			fieldName: '$$evmTransactions',
			resolve: async (entityId, context) => {
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				if (subsetRowLimit == null) return []
				const {
					getBlockByNumberForRpcUrl,
					voltaireBlockWireAsRpcHeader,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(entityId.$network.chainId)
				if (jsonRpcTransport == null) return undefined
				const voltaireBlockWire = await singleFlight(getBlockByNumberForRpcUrl)({
					...jsonRpcTransport,
					blockNumber: entityId.blockNumber,
					fullTransactions: false,
				})
				if (voltaireBlockWire == null) return undefined
				const blockHeader = voltaireBlockWireAsRpcHeader(voltaireBlockWire)
				return evmBlockTransactionRefsFromChainAndHashes(
					entityId.$network.chainId,
					(blockHeader.transactions ?? []) as readonly `0x${string}`[] | undefined,
					subsetRowLimit,
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: 'avatarUrl',
			resolve: async (entityId) => {
				const {
					normalizeEnsName,
					resolveEnsForwardForRpcUrl,
					resolveEnsReverseForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const { ensEthereumChainId, ensTextRecordKeys } = await import('$/constants/Ens.ts')
				const chainId = ensEthereumChainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) return undefined
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
				return textRecords.avatar != null && textRecords.avatar.length > 0 ?
						textRecords.avatar
					: undefined
			},
		}),
	],
}
