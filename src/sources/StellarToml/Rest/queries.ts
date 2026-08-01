import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<JsonValue>(binding, path)
)
