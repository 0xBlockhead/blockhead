import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getFinalizedHead = (binding: SourceBinding) => (
	request(binding, 'chain_getFinalizedHead')
)

export const getHeader = (
	binding: SourceBinding,
	blockHash?: string
) => (
	request(binding, 'chain_getHeader', blockHash == null ? [] : [blockHash])
)

export const getRuntimeVersion = (binding: SourceBinding) => (
	request(binding, 'state_getRuntimeVersion')
)
