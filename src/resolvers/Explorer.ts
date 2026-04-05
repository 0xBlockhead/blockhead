import {
	ethereumExecutionForkByChainIdAndForkId,
	ethereumExecutionForks,
} from '$/constants/EthereumExecutionForks.ts'
import { evmRpcNetworkByChainId } from '$/constants/EvmRpcNetwork.ts'
import {
	mapBlockSummary,
	mapLogsFromRpcReceipt,
	mapTransactionEntityFromTxWire,
	stubEvmTransactionEntitiesFromBlockTransactions,
} from '$/lib/evmEntityFromWire.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { EntityFieldResolver } from '$/resolvers/$EntityFieldResolver.ts'
import type { EntityResolver } from '$/resolvers/$EntityResolver.ts'
import { sliceRowsForResolverSubset } from '$/data/tanstackDb/resolverLoadSubset.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { chainlistRpcUrlForChainId } from '$/sources/Chainlist/Rest/queries.ts'
import {
	ethBlockNumber,
	ethGetBlockByNumber,
	ethGetTransactionByHash,
	ethGetTransactionReceipt,
} from '$/sources/Evm/JsonRpc/queries.ts'
import type { RpcReceiptWire } from '$/sources/Evm/JsonRpc/types.ts'
import { Source } from '$/sources/$Sources.ts'

const recentTxCap = 20

const evmExplorerRpcUrl = async (chainId: number): Promise<string | undefined> => {
	const rpcNet = evmRpcNetworkByChainId[String(chainId)]
	return (
		rpcNet?.rpcUrl ??
		(await chainlistRpcUrlForChainId(chainId))
	)
}

const explorerReceiptForEvmTx = async (
	entityId: EntityId<EntityType.EvmTransaction>,
): Promise<RpcReceiptWire | null | undefined> => {
	const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
	if (rpcUrl == null) return null
	return singleFlight(ethGetTransactionReceipt)({
		rpcUrl,
		txHash: entityId.txHash,
	})
}

const networkResolver: EntityResolver<EntityType.Network> = {
	entityType: EntityType.Network,
	resolve: async (entityId) => {
		const rpcNet = evmRpcNetworkByChainId[String(entityId.chainId)]
		const rpcUrlEffective = await evmExplorerRpcUrl(entityId.chainId)
		return {
			...(rpcNet != null ?
				{
					name: rpcNet.name,
					nativeSymbol: rpcNet.nativeSymbol,
					explorerOrigin: rpcNet.explorerOrigin,
					rpcUrl: rpcNet.rpcUrl,
				}
			:	rpcUrlEffective != null ?
				{ rpcUrl: rpcUrlEffective }
			:	{}),
			$$forks: ethereumExecutionForks
				.filter((row) => row.$id.$network.chainId === entityId.chainId)
				.map((row) => ({ ...row })),
		}
	},
}

const networkEvmBlocksField: EntityFieldResolver<EntityType.Network, '$$evmBlocks'> = {
	entityType: EntityType.Network,
	field: '$$evmBlocks',
	resolve: async (entityId) => {
		const rpcUrl = await evmExplorerRpcUrl(entityId.chainId)
		if (rpcUrl == null) return undefined
		const headHex = await singleFlight(ethBlockNumber)({ rpcUrl })
		const head = BigInt(headHex)
		const blockNumbers = (
			Array.from(
				{ length: 12 },
				(_, index) => head - BigInt(index),
			).filter((n) => n >= 0n)
		)
		const blockWires = await Promise.all(
			blockNumbers.map((blockNumber) =>
				singleFlight(ethGetBlockByNumber)({
					rpcUrl,
					blockNumber,
					txObjects: false,
				})
			),
		)
		const $$evmBlocks: Entity<EntityType.EvmBlock>[] = []
		for (let index = 0; index < blockWires.length; index++) {
			const wire = blockWires[index]
			const blockNumber = blockNumbers[index]
			if (wire == null || blockNumber == null) continue
			$$evmBlocks.push(
				mapBlockSummary({
					chainId: entityId.chainId,
					blockNumber,
					wire,
				}),
			)
		}
		return $$evmBlocks
	},
}

const networkEvmTransactionsField: EntityFieldResolver<EntityType.Network, '$$evmTransactions'> = {
	entityType: EntityType.Network,
	field: '$$evmTransactions',
	resolve: async (entityId) => {
		const rpcUrl = await evmExplorerRpcUrl(entityId.chainId)
		if (rpcUrl == null) return undefined
		const latestWire = await singleFlight(ethGetBlockByNumber)({
			rpcUrl,
			blockNumber: 'latest',
			txObjects: false,
		})
		if (latestWire == null) return undefined
		return stubEvmTransactionEntitiesFromBlockTransactions({
			chainId: entityId.chainId,
			transactions: latestWire.transactions as unknown[],
			cap: recentTxCap,
		})
	},
}

const evmBlockResolver: EntityResolver<EntityType.EvmBlock> = {
	entityType: EntityType.EvmBlock,
	resolve: async (entityId) => {
		const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
		if (rpcUrl == null) return {}

		const wire = await singleFlight(ethGetBlockByNumber)({
			rpcUrl,
			blockNumber: entityId.blockNumber,
			txObjects: false,
		})
		if (wire == null) return {}

		const number = entityId.blockNumber
		const parentNumber = number > 0n ? number - 1n : undefined
		const minerAddr = wire.miner as `0x${string}` | undefined

		const base = mapBlockSummary({
			chainId: entityId.$network.chainId,
			blockNumber: number,
			wire,
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
						$id: {
							$network: entityId.$network,
							blockNumber: parentNumber,
						},
						number: parentNumber,
					} as Entity<EntityType.EvmBlock>,
				}
			:	{}),
			...(minerAddr != null ?
				{
					$miner: {
						$id: {
							$network: entityId.$network,
							address: minerAddr,
						},
					} as Entity<EntityType.Actor>,
				}
			:	{}),
		}
	},
}

const evmTransactionResolver: EntityResolver<EntityType.EvmTransaction> = {
	entityType: EntityType.EvmTransaction,
	resolve: async (entityId) => {
		const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
		if (rpcUrl == null) return {}

		const tx = await singleFlight(ethGetTransactionByHash)({
			rpcUrl,
			txHash: entityId.txHash,
		})
		if (tx == null) return {}

		return mapTransactionEntityFromTxWire({
			chainId: entityId.$network.chainId,
			txHash: entityId.txHash,
			tx,
		})
	},
}

const evmTransactionStatusField: EntityFieldResolver<EntityType.EvmTransaction, 'status'> = {
	entityType: EntityType.EvmTransaction,
	field: 'status',
	resolve: async (entityId) => {
		const receipt = await explorerReceiptForEvmTx(entityId)
		if (receipt?.status == null) return undefined
		return Number.parseInt(receipt.status, 16)
	},
}

const evmTransactionGasUsedField: EntityFieldResolver<EntityType.EvmTransaction, 'gasUsed'> = {
	entityType: EntityType.EvmTransaction,
	field: 'gasUsed',
	resolve: async (entityId) => {
		const receipt = await explorerReceiptForEvmTx(entityId)
		if (receipt?.gasUsed == null) return undefined
		return BigInt(receipt.gasUsed)
	},
}

const evmTransactionEffectiveGasPriceField: EntityFieldResolver<
	EntityType.EvmTransaction,
	'effectiveGasPrice'
> = {
	entityType: EntityType.EvmTransaction,
	field: 'effectiveGasPrice',
	resolve: async (entityId) => {
		const receipt = await explorerReceiptForEvmTx(entityId)
		if (receipt?.effectiveGasPrice == null) return undefined
		return BigInt(receipt.effectiveGasPrice)
	},
}

const evmTransactionLogsField: EntityFieldResolver<EntityType.EvmTransaction, 'logs'> = {
	entityType: EntityType.EvmTransaction,
	field: 'logs',
	resolve: async (entityId) => {
		const receipt = await explorerReceiptForEvmTx(entityId)
		if (receipt == null) return []
		return mapLogsFromRpcReceipt(receipt.logs)
	},
}

const evmTransactionContractField: EntityFieldResolver<EntityType.EvmTransaction, '$contract'> = {
	entityType: EntityType.EvmTransaction,
	field: '$contract',
	resolve: async (entityId) => {
		const receipt = await explorerReceiptForEvmTx(entityId)
		if (receipt?.contractAddress == null || receipt.contractAddress === '') return undefined
		return {
			$id: {
				$network: entityId.$network,
				address: receipt.contractAddress as `0x${string}`,
			},
		} as Entity<EntityType.EvmContract>
	},
}

const networkForkResolver: EntityResolver<EntityType.NetworkFork> = {
	entityType: EntityType.NetworkFork,
	resolve: async (entityId) => {
		const hit = ethereumExecutionForkByChainIdAndForkId[
			`${entityId.$network.chainId}:${entityId.forkId}`
		]
		return hit != null ? { ...hit } : {}
	},
}

const globalNetworkForksField: EntityFieldResolver<EntityType._Global, '$$networkForks'> = {
	entityType: EntityType._Global,
	field: '$$networkForks',
	resolve: async (_entityId, context) => (
		sliceRowsForResolverSubset(
			[...ethereumExecutionForks].map((row) => ({ ...row })),
			context?.loadSubset,
		)
	),
}

export default {
	source: Source.Explorer,
	entityResolvers: [
		networkResolver,
		evmBlockResolver,
		evmTransactionResolver,
		networkForkResolver,
	],
	entityFieldResolvers: [
		globalNetworkForksField,
		networkEvmBlocksField,
		networkEvmTransactionsField,
		evmTransactionStatusField,
		evmTransactionGasUsedField,
		evmTransactionEffectiveGasPriceField,
		evmTransactionLogsField,
		evmTransactionContractField,
	],
} satisfies {
	source: Source
	entityResolvers: readonly [
		typeof networkResolver,
		typeof evmBlockResolver,
		typeof evmTransactionResolver,
		typeof networkForkResolver,
	]
	entityFieldResolvers: readonly [
		typeof globalNetworkForksField,
		typeof networkEvmBlocksField,
		typeof networkEvmTransactionsField,
		typeof evmTransactionStatusField,
		typeof evmTransactionGasUsedField,
		typeof evmTransactionEffectiveGasPriceField,
		typeof evmTransactionLogsField,
		typeof evmTransactionContractField,
	]
}
