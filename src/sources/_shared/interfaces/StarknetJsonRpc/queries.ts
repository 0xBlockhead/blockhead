import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	BlockHashAndNumber,
	BlockId,
	BlockWithTxHashes,
	EventsChunk,
	EventsFilter,
	Felt,
	StarknetClassDefinition,
	SyncStatus,
	TransactionReceiptWithBlockInfo,
	TransactionWithHash,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

export const starknetJsonRpc = (binding: SourceBinding) => ({
	getSpecVersion: () => (
		jsonRpc2<string>(binding, 'starknet_specVersion')
	),
	getBlockNumber: () => jsonRpc2<number>(binding, 'starknet_blockNumber'),
	getChainId: () => jsonRpc2<Felt>(binding, 'starknet_chainId'),
	getSyncing: () => jsonRpc2<SyncStatus>(binding, 'starknet_syncing'),
	getBlockHashAndNumber: () => (
		jsonRpc2<BlockHashAndNumber>(binding, 'starknet_blockHashAndNumber')
	),
	getBlockWithTxHashes: (
		blockId: BlockId
	) => (
		jsonRpc2<BlockWithTxHashes>(binding, 'starknet_getBlockWithTxHashes', [blockId])
	),
	getBlockTransactionCount: (
		blockId: BlockId
	) => (
		jsonRpc2<number>(binding, 'starknet_getBlockTransactionCount', [blockId])
	),
	getNonce: (
		blockId: BlockId,
		contractAddress: Felt
	) => jsonRpc2<Felt>(binding, 'starknet_getNonce', [
		blockId,
		contractAddress,
	]),
	getClassHashAt: (
		blockId: BlockId,
		contractAddress: Felt
	) => jsonRpc2<Felt>(binding, 'starknet_getClassHashAt', [
		blockId,
		contractAddress,
	]),
	getClass: (
		blockId: BlockId,
		classHash: Felt
	) => (
		jsonRpc2<StarknetClassDefinition>(binding, 'starknet_getClass', [
			blockId,
			classHash,
		])
	),
	getClassAt: (
		blockId: BlockId,
		contractAddress: Felt
	) => (
		jsonRpc2<StarknetClassDefinition>(binding, 'starknet_getClassAt', [
			blockId,
			contractAddress,
		])
	),
	getStorageAt: (
		contractAddress: Felt,
		storageKey: Felt,
		blockId: BlockId
	) => (
		jsonRpc2<Felt>(binding, 'starknet_getStorageAt', [
			contractAddress,
			storageKey,
			blockId,
		])
	),
	getTransactionByHash: (
		transactionHash: Felt
	) => (
		jsonRpc2<TransactionWithHash>(binding, 'starknet_getTransactionByHash', {
			transaction_hash: transactionHash,
		})
	),
	getTransactionByBlockIdAndIndex: (
		blockId: BlockId,
		index: number
	) => (
		jsonRpc2<TransactionWithHash>(binding, 'starknet_getTransactionByBlockIdAndIndex', [
			blockId,
			index,
		])
	),
	getTransactionReceipt: (
		transactionHash: Felt
	) => (
		jsonRpc2<TransactionReceiptWithBlockInfo>(binding, 'starknet_getTransactionReceipt', {
			transaction_hash: transactionHash,
		})
	),
	getEvents: (
		filter: EventsFilter
	) => jsonRpc2<EventsChunk>(binding, 'starknet_getEvents', [filter]),
})
