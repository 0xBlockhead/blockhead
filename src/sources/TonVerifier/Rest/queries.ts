import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { TonVerifierJson } from '$/sources/TonVerifier/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<TonVerifierJson>(binding, path)
)
