import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { TonVerifierJson } from '$/sources/TonVerifier/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => {
	return sourceGetJson<TonVerifierJson>(binding, httpUrl(binding, path))
}
