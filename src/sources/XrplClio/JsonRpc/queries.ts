import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const request = (
	binding: SourceBinding,
	method: string,
	params?: readonly JsonValue[]
) => jsonRpc2<JsonValue>(binding, method, params)

export const getServerInfo = (binding: SourceBinding) => (
	request(binding, 'server_info')
)

export const getLedgerClosed = (binding: SourceBinding) => (
	request(binding, 'ledger_closed')
)
