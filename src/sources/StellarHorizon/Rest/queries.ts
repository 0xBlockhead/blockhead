import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { StellarHorizonJson } from '$/sources/StellarHorizon/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<StellarHorizonJson>(binding, path)
)
