import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SigstoreRekorJson } from '$/sources/SigstoreRekor/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<SigstoreRekorJson>(binding, path)
)
