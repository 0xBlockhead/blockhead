import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { StellarExpertJson } from '$/sources/StellarExpert/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<StellarExpertJson>(binding, path)
)
