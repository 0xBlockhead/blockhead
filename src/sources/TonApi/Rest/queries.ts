import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { TonApiJson } from '$/sources/TonApi/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<TonApiJson>(binding, path)
)
