import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const getLedgerTip = (binding: SourceBinding) => (
	jsonRpc2<JsonValue>(binding, 'queryLedgerState/tip')
)
