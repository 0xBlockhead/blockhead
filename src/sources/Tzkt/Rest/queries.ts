import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { TzktJson } from '$/sources/Tzkt/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<TzktJson>(binding, path)
)
