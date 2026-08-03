import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Cardanoscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Cardanoscan_Rest][0]

export const query = (path: string) => {
	return sourceGetJson<JsonValue>(binding, httpUrl(binding, path))
}
