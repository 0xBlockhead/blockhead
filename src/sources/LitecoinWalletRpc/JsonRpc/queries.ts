import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getWalletInfo = (binding: SourceBinding) => (
	request(binding, 'getwalletinfo')
)

export const listTransactions = (
	binding: SourceBinding,
	params?: readonly JsonValue[]
) => (
	request(binding, 'listtransactions', params)
)

export const getNewAddress = (
	binding: SourceBinding,
	params?: readonly JsonValue[]
) => (
	request(binding, 'getnewaddress', params)
)

export const signMessage = (
	binding: SourceBinding,
	params: readonly JsonValue[]
) => (
	request(binding, 'signmessage', params)
)
