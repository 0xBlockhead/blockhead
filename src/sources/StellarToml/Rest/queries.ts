import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { StellarTomlJson } from '$/sources/StellarToml/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<StellarTomlJson>(binding, path)
)
