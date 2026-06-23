import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { CronosExplorerJson } from '$/sources/CronosExplorer/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<CronosExplorerJson>(binding, path)
)
