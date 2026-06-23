import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { DydxJson } from '$/sources/Dydx/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<DydxJson>(binding, path)
)
