import { evmRpcNetworkByChainId } from '$/constants/EvmRpcNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { getDefaultExecutionEndpoint } from '$/lib/execution-endpoints.ts'
import {
	mapBlockSummary,
	mapLogsFromRpcReceipt,
	mapTransactionEntityFromTxWire,
	stubEvmTransactionEntitiesFromBlockTransactions,
} from '$/lib/evmEntityFromWire.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { EntityFieldResolver } from '$/resolvers/$EntityFieldResolver.ts'
import type { EntityResolver } from '$/resolvers/$EntityResolver.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { chainlistRpcUrlForChainId } from '$/sources/Chainlist/Rest/queries.ts'
import {
	getBlockByNumberForRpcUrl,
	getTransactionByHashForRpcUrl,
	getTransactionReceiptForRpcUrl,
	voltaireBlockWireAsRpcHeader,
	voltaireReceiptWireAsRpcReceipt,
	voltaireTxWireAsRpcTx,
} from '$/sources/Voltaire/JsonRpc/queries.ts'
import type { VoltaireReceiptRpc } from '$/sources/Voltaire/JsonRpc/types.ts'
import { Source } from '$/sources/$Sources.ts'

const recentTxCap = 20

const voltaireRpcContextForChainId = async (chainId: number) => {
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
	entityId: EntityId<EntityType.EvmTransaction>,
): Promise<VoltaireReceiptRpc | null | undefined> => {
	const ctx = await voltaireRpcContextForChainId(entityId.$network.chainId)
	if (ctx == null) return null
	return singleFlight(getTransactionReceiptForRpcUrl)({
		...ctx,
		txHash: entityId.txHash,
	})
}

const evmBlockResolver: EntityResolver<EntityType.EvmBlock> = {
	entityType: EntityType.EvmBlock,
	resolve: async (entityId) => {
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
		const ctx = await voltaireRpcContextForChainId(entityId.$network.chainId)
		if (ctx == null) return {}
		const tx = await singleFlight(getTransactionByHashForRpcUrl)({
			...ctx,
			txHash: entityId.txHash,
		})
		if (tx == null) return {}
		return mapTransactionEntityFromTxWire({
			chainId: entityId.$network.chainId,
			txHash: entityId.txHash,
			tx: voltaireTxWireAsRpcTx(tx, entityId.txHash),
		})
	},
}

const evmTransactionStatusField: EntityFieldResolver<EntityType.EvmTransaction, 'status'> = {
	entityType: EntityType.EvmTransaction,
	field: 'status',
	resolve: async (entityId) => {
		const receipt = await voltaireReceiptForEvmTx(entityId)
		const rpc = receipt == null ? null : voltaireReceiptWireAsRpcReceipt(receipt)
		if (rpc?.status == null) return undefined
		return Number.parseInt(rpc.status, 16)
	},
}

const evmTransactionGasUsedField: EntityFieldResolver<EntityType.EvmTransaction, 'gasUsed'> = {
	entityType: EntityType.EvmTransaction,
	field: 'gasUsed',
	resolve: async (entityId) => {
		const receipt = await voltaireReceiptForEvmTx(entityId)
		const rpc = receipt == null ? null : voltaireReceiptWireAsRpcReceipt(receipt)
		if (rpc?.gasUsed == null) return undefined
		return BigInt(rpc.gasUsed)
	},
}

const evmTransactionEffectiveGasPriceField: EntityFieldResolver<
	EntityType.EvmTransaction,
	'effectiveGasPrice'
> = {
	entityType: EntityType.EvmTransaction,
	field: 'effectiveGasPrice',
	resolve: async (entityId) => {
		const receipt = await voltaireReceiptForEvmTx(entityId)
		const rpc = receipt == null ? null : voltaireReceiptWireAsRpcReceipt(receipt)
		if (rpc?.effectiveGasPrice == null) return undefined
		return BigInt(rpc.effectiveGasPrice)
	},
}

const evmTransactionLogsField: EntityFieldResolver<EntityType.EvmTransaction, 'logs'> = {
	entityType: EntityType.EvmTransaction,
	field: 'logs',
	resolve: async (entityId) => {
		const receipt = await voltaireReceiptForEvmTx(entityId)
		const rpc = receipt == null ? null : voltaireReceiptWireAsRpcReceipt(receipt)
		if (rpc == null) return []
		return mapLogsFromRpcReceipt(rpc.logs)
	},
}

const evmTransactionContractField: EntityFieldResolver<EntityType.EvmTransaction, '$contract'> = {
	entityType: EntityType.EvmTransaction,
	field: '$contract',
	resolve: async (entityId) => {
		const receipt = await voltaireReceiptForEvmTx(entityId)
		const rpc = receipt == null ? null : voltaireReceiptWireAsRpcReceipt(receipt)
		if (rpc?.contractAddress == null || rpc.contractAddress === '') return undefined
		return {
			$id: {
				$network: entityId.$network,
				address: rpc.contractAddress as `0x${string}`,
			},
		} as Entity<EntityType.EvmContract>
	},
}

export default {
	source: Source.Voltaire,
	entityResolvers: [evmBlockResolver, evmTransactionResolver],
	entityFieldResolvers: [
		evmTransactionStatusField,
		evmTransactionGasUsedField,
		evmTransactionEffectiveGasPriceField,
		evmTransactionLogsField,
		evmTransactionContractField,
	],
} satisfies {
	source: Source
	entityResolvers: readonly [typeof evmBlockResolver, typeof evmTransactionResolver]
	entityFieldResolvers: readonly [
		typeof evmTransactionStatusField,
		typeof evmTransactionGasUsedField,
		typeof evmTransactionEffectiveGasPriceField,
		typeof evmTransactionLogsField,
		typeof evmTransactionContractField,
	]
}
