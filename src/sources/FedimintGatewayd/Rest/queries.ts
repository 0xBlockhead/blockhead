import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/FedimintGatewayd/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { Source } from '$/sources/Source.ts'

export const query = (path: string) => (
	getJson<JsonValue>(bindings[Source.FedimintGatewayd_Rest], path)
)
