import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { CeleniumJson } from '$/sources/Celenium/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<CeleniumJson>(binding, path)
)
