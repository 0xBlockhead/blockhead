import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getNetworkId = (binding: SourceBinding) => (
	request(binding, 'info.getNetworkID')
)

export const getNetworkName = (binding: SourceBinding) => (
	request(binding, 'info.getNetworkName')
)

export const getNodeId = (binding: SourceBinding) => (
	request(binding, 'info.getNodeID')
)

export const getNodeVersion = (binding: SourceBinding) => (
	request(binding, 'info.getNodeVersion')
)
