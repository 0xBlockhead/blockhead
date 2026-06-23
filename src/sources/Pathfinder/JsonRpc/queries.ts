import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getBlockNumber = (binding: SourceBinding) => (
	request(binding, 'starknet_blockNumber')
)

export const getChainId = (binding: SourceBinding) => (
	request(binding, 'starknet_chainId')
)

export const getSyncing = (binding: SourceBinding) => (
	request(binding, 'starknet_syncing')
)
