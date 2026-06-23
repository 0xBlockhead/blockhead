import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { BithompJson } from '$/sources/Bithomp/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<BithompJson>(binding, path)
)
