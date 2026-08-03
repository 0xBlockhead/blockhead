import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Ogmios/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Ogmios_JsonRpc][0]

export const getLedgerTip = () => (
	jsonRpc2<JsonValue>(binding, 'queryLedgerState/tip')
)
