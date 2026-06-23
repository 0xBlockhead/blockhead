import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { EigenExplorerJson } from '$/sources/EigenExplorer/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<EigenExplorerJson>(binding, path)
)
