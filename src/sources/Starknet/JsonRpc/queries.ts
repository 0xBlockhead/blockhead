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
import bindings from '$/sources/Starknet/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Starknet_JsonRpc]

export const request = (
	method: string,
	params?: readonly unknown[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getBlockNumber = () => (
	jsonRpc2<number>(binding, 'starknet_blockNumber')
)

export const getChainId = () => (
	jsonRpc2<StarknetFelt>(binding, 'starknet_chainId')
)

export const getSyncing = () => (
	jsonRpc2<StarknetSyncStatus>(binding, 'starknet_syncing')
)

export const getBlockHashAndNumber = () => (
	jsonRpc2<StarknetBlockHashAndNumber>(binding, 'starknet_blockHashAndNumber')
)

export const getNonce = (
	blockId: StarknetBlockId,
	contractAddress: string
) => jsonRpc2<StarknetFelt>(binding, 'starknet_getNonce', [
	blockId,
	contractAddress,
])

export const getClassHashAt = (
	blockId: StarknetBlockId,
	contractAddress: string
) => jsonRpc2<StarknetFelt>(binding, 'starknet_getClassHashAt', [
	blockId,
	contractAddress,
])

export const getEvents = (
	filter: StarknetEventsFilter
) => jsonRpc2<StarknetEventsChunk>(binding, 'starknet_getEvents', [filter])
