import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import {
	type Entity,
	type EntityId,
	schema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { VoltaireReceiptRpc } from '$/sources/Voltaire/JsonRpc/types.ts'
import { Source } from '$/sources/$Sources.ts'

const recentTxCap = 20
const ethereumEnsChainId = 1

const voltaireRpcContextForChainId = async (chainId: number) => {
	const { evmRpcNetworkByChainId } = await import('$/constants/EvmRpcNetwork.ts')
	const { TransportType } = await import('$/constants/TransportType.ts')
	const { getDefaultExecutionEndpoint } = await import('$/lib/execution-endpoints.ts')
	const { chainlistRpcUrlForChainId } = await import('$/sources/Chainlist/Rest/queries.ts')
	const ep = getDefaultExecutionEndpoint(chainId)
	if (ep != null)
		return { rpcUrl: ep.url, transportType: ep.transportType }
	const rpcNet = evmRpcNetworkByChainId[String(chainId)]
	if (rpcNet?.rpcUrl != null)
		return { rpcUrl: rpcNet.rpcUrl, transportType: TransportType.Http }
	const rpcUrl = await chainlistRpcUrlForChainId(chainId)
	if (rpcUrl == null) return undefined
	return { rpcUrl, transportType: TransportType.Http }
}

const voltaireReceiptForEvmTx = async (
	entityId: EntityId<typeof schema, EntityType.EvmTransaction>,
): Promise<VoltaireReceiptRpc | null | undefined> => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getTransactionReceiptForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
	const ctx = await voltaireRpcContextForChainId(entityId.$network.chainId)
	if (ctx == null) return null
	return singleFlight(getTransactionReceiptForRpcUrl)({
		...ctx,
		txHash: entityId.txHash,
	})
}

const actorEnsProfileForAddress = async (address: `0x${string}`) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const {
		normalizeEnsName,
		resolveEnsForwardForRpcUrl,
		resolveEnsReverseForRpcUrl,
	} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
	const ctx = await voltaireRpcContextForChainId(ethereumEnsChainId)
	if (ctx == null) return {}
	const primaryNameRaw = await singleFlight(resolveEnsReverseForRpcUrl)({
		...ctx,
		address,
	})
	if (primaryNameRaw == null) return {}
	const primaryName = (() => {
		try {
			return normalizeEnsName(primaryNameRaw)
		} catch {
			return primaryNameRaw
		}
	})()
	const avatarUrl = (
		await singleFlight(resolveEnsForwardForRpcUrl)({
			...ctx,
			name: primaryName,
			textKeys: ['avatar'],
		})
	).textRecords.avatar
	return {
		$primaryName: {
			[EntityMetaKey.Id]: {
				name: primaryName,
			},
		} as Entity<typeof schema, EntityType.EnsName>,
		avatarUrl: typeof avatarUrl === 'string' && avatarUrl.length > 0 ?
				avatarUrl
			: undefined,
	}
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmBlock,
			source: Source.Voltaire,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					mapBlockSummary,
					stubEvmTransactionEntitiesFromBlockTransactions,
				} = await import('$/lib/evmEntityFromWire.ts')
				const {
					getBlockByNumberForRpcUrl,
					voltaireBlockWireAsRpcHeader,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const ctx = await voltaireRpcContextForChainId(entityId.$network.chainId)
				if (ctx == null) return {}

				const wire = await singleFlight(getBlockByNumberForRpcUrl)({
					...ctx,
					blockNumber: entityId.blockNumber,
					fullTransactions: false,
				})
				if (wire == null) return {}

				const header = voltaireBlockWireAsRpcHeader(wire)
				const number = entityId.blockNumber
				const parentNumber = number > 0n ? number - 1n : undefined
				const minerAddr = header.miner as `0x${string}` | undefined

				const base = mapBlockSummary({
					chainId: entityId.$network.chainId,
					blockNumber: number,
					wire: header,
				})

				const $$evmTransactions = stubEvmTransactionEntitiesFromBlockTransactions({
					chainId: entityId.$network.chainId,
					transactions: wire.transactions as unknown[],
					cap: recentTxCap,
				})

				return {
					...base,
					$$evmTransactions,
					...(parentNumber != null ?
						{
							$parent: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									blockNumber: parentNumber,
								},
								number: parentNumber,
							} as Entity<typeof schema, EntityType.EvmBlock>,
						}
					:	{}),
					...(minerAddr != null ?
						{
							$miner: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: minerAddr,
								},
							} as Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EnsName,
			source: Source.Voltaire,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					normalizeEnsName,
					resolveEnsForwardForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const ctx = await voltaireRpcContextForChainId(ethereumEnsChainId)
				if (ctx == null) return {}
				const name = (() => {
					try {
						return normalizeEnsName(entityId.name)
					} catch {
						return entityId.name
					}
				})()
				const resolution = await singleFlight(resolveEnsForwardForRpcUrl)({
					...ctx,
					name,
					textKeys: ['avatar'],
				})
				return {
					textRecords: resolution.textRecords,
					...(resolution.address != null ?
						{
							$resolvedActor: {
								[EntityMetaKey.Id]: {
									$network: { chainId: ethereumEnsChainId },
									address: resolution.address,
								},
							} as Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					...(resolution.owner != null ?
						{
							$ownerActor: {
								[EntityMetaKey.Id]: {
									$network: { chainId: ethereumEnsChainId },
									address: resolution.owner,
								},
							} as Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					...(resolution.resolver != null ?
						{
							$resolverContract: {
								[EntityMetaKey.Id]: {
									$network: { chainId: ethereumEnsChainId },
									address: resolution.resolver,
								},
							} as Entity<typeof schema, EntityType.EvmContract>,
						}
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EvmTransaction,
			source: Source.Voltaire,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					mapLogsFromRpcReceipt,
					mapTransactionEntityFromTxWire,
				} = await import('$/lib/evmEntityFromWire.ts')
				const {
					getTransactionByHashForRpcUrl,
					voltaireReceiptWireAsRpcReceipt,
					voltaireTxWireAsRpcTx,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const ctx = await voltaireRpcContextForChainId(entityId.$network.chainId)
				if (ctx == null) return {}
				const tx = await singleFlight(getTransactionByHashForRpcUrl)({
					...ctx,
					txHash: entityId.txHash,
				})
				if (tx == null) return {}
				const base = mapTransactionEntityFromTxWire({
					chainId: entityId.$network.chainId,
					txHash: entityId.txHash,
					tx: voltaireTxWireAsRpcTx(tx, entityId.txHash),
				})
				const receipt = await voltaireReceiptForEvmTx(entityId)
				const rpcReceipt = receipt == null ? null : voltaireReceiptWireAsRpcReceipt(receipt)
				return {
					...base,
					...(rpcReceipt?.status != null ?
						{ status: Number.parseInt(rpcReceipt.status, 16) }
					:	{}),
					...(rpcReceipt?.gasUsed != null ? { gasUsed: BigInt(rpcReceipt.gasUsed) } : {}),
					...(rpcReceipt?.effectiveGasPrice != null ?
						{ effectiveGasPrice: BigInt(rpcReceipt.effectiveGasPrice) }
					:	{}),
					logs: rpcReceipt != null ? mapLogsFromRpcReceipt(rpcReceipt.logs) : [],
					...(rpcReceipt?.contractAddress != null && rpcReceipt.contractAddress !== '' ?
						{
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: rpcReceipt.contractAddress as `0x${string}`,
								},
							} as Entity<typeof schema, EntityType.EvmContract>,
						}
					:	{}),
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: '$primaryName',
			source: Source.Voltaire,
			resolve: async (entityId) => (
				(await actorEnsProfileForAddress(entityId.address)).$primaryName
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: 'avatarUrl',
			source: Source.Voltaire,
			resolve: async (entityId) => (
				(await actorEnsProfileForAddress(entityId.address)).avatarUrl
			),
		}),
	],
}
