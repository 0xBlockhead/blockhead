import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => {
	return sourceGetJson<JsonValue>(binding, httpUrl(binding, path))
}
