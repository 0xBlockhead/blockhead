import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { TonCenterJson } from '$/sources/TonCenter/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<TonCenterJson>(binding, path)
)
