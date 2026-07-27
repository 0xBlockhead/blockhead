import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import type { CardanoscanJson } from '$/sources/Cardanoscan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => {
	return sourceGetJson<CardanoscanJson>(binding, httpUrl(binding, path))
}
