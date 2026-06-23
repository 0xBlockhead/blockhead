import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { MintscanJson } from '$/sources/Mintscan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<MintscanJson>(binding, path)
)
