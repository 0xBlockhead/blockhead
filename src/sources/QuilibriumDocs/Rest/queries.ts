import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { QuilibriumDocsJson } from '$/sources/QuilibriumDocs/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<QuilibriumDocsJson>(binding, path)
)
