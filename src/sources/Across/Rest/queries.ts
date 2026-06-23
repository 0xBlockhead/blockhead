import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { AcrossJson } from '$/sources/Across/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<AcrossJson>(binding, path)
)
