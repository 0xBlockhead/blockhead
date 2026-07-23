import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	StarknetBlockHashAndNumber,
	StarknetBlockId,
	StarknetEventsChunk,
	StarknetEventsFilter,
	StarknetFelt,
	StarknetSyncStatus,
} from '$/sources/Starknet/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly unknown[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getBlockNumber = (binding: SourceBinding) => (
	jsonRpc2<number>(binding, 'starknet_blockNumber')
)

export const getChainId = (binding: SourceBinding) => (
	jsonRpc2<StarknetFelt>(binding, 'starknet_chainId')
)

export const getSyncing = (binding: SourceBinding) => (
	jsonRpc2<StarknetSyncStatus>(binding, 'starknet_syncing')
)

export const getBlockHashAndNumber = (binding: SourceBinding) => (
	jsonRpc2<StarknetBlockHashAndNumber>(binding, 'starknet_blockHashAndNumber')
)

export const getNonce = (
	binding: SourceBinding,
	blockId: StarknetBlockId,
	contractAddress: string
) => jsonRpc2<StarknetFelt>(binding, 'starknet_getNonce', [
	blockId,
	contractAddress,
])

export const getClassHashAt = (
	binding: SourceBinding,
	blockId: StarknetBlockId,
	contractAddress: string
) => jsonRpc2<StarknetFelt>(binding, 'starknet_getClassHashAt', [
	blockId,
	contractAddress,
])

export const getEvents = (
	binding: SourceBinding,
	filter: StarknetEventsFilter
) => jsonRpc2<StarknetEventsChunk>(binding, 'starknet_getEvents', [filter])
