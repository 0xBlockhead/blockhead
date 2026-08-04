import bindings from '$/sources/Pathfinder/bindings.ts'
import type {
	BlockId,
	BlockWithTxHashes,
	Felt,
	TransactionReceiptWithBlockInfo,
	TransactionWithHash,
} from '$/sources/Pathfinder/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { starknetJsonRpc } from '$/sources/_shared/interfaces/StarknetJsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

const binding = bindings[Source.Pathfinder][0]
const shared = starknetJsonRpc(binding)

export default {
	...shared,

	getSpecVersion: () => (
		jsonRpc2<string>(binding, 'starknet_specVersion')
	),

	getBlockWithTxHashes: (
		blockId: BlockId
	) => (
		jsonRpc2<BlockWithTxHashes>(binding, 'starknet_getBlockWithTxHashes', [blockId])
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

	getTransactionReceipt: (
		transactionHash: Felt
	) => (
		jsonRpc2<TransactionReceiptWithBlockInfo>(binding, 'starknet_getTransactionReceipt', {
			transaction_hash: transactionHash,
		})
	),
}
