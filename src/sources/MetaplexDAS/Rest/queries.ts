import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { MetaplexDASJson } from '$/sources/MetaplexDAS/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<MetaplexDASJson>(binding, path)
)
