import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getAccounts = (
	binding: SourceBinding,
	params?: readonly JsonValue[]
) => (
	request(binding, 'get_accounts', params)
)

export const getBalance = (
	binding: SourceBinding,
	params?: readonly JsonValue[]
) => (
	request(binding, 'get_balance', params)
)

export const getAddress = (
	binding: SourceBinding,
	params?: readonly JsonValue[]
) => (
	request(binding, 'get_address', params)
)
