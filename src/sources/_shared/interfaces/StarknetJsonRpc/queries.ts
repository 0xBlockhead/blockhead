import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	BlockHashAndNumber,
	BlockId,
	EventsChunk,
	EventsFilter,
	Felt,
	SyncStatus,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

export const starknetJsonRpc = (binding: SourceBinding) => ({
	getBlockNumber: () => jsonRpc2<number>(binding, 'starknet_blockNumber'),
	getChainId: () => jsonRpc2<Felt>(binding, 'starknet_chainId'),
	getSyncing: () => jsonRpc2<SyncStatus>(binding, 'starknet_syncing'),
	getBlockHashAndNumber: () => (
		jsonRpc2<BlockHashAndNumber>(binding, 'starknet_blockHashAndNumber')
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
	getEvents: (
		filter: EventsFilter
	) => jsonRpc2<EventsChunk>(binding, 'starknet_getEvents', [filter]),
})
