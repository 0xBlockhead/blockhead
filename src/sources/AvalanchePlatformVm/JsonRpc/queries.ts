import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getHeight = (binding: SourceBinding) => (
	request(binding, 'platform.getHeight')
)

export const getBlockchains = (binding: SourceBinding) => (
	request(binding, 'platform.getBlockchains')
)

export const getCurrentValidators = (
	binding: SourceBinding,
	params?: readonly JsonValue[]
) => (
	request(binding, 'platform.getCurrentValidators', params)
)
