import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/RadicleNode/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { Source } from '$/sources/Source.ts'

export const query = (path: string) => (
	getJson<JsonValue>(Object.fromEntries(bindings[Source.RadicleNode_Control].map((binding) => [binding.target.key, binding]))['radicle-node'], path)
)
