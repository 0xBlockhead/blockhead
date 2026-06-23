import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { TezosNodeJson } from '$/sources/TezosNode/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<TezosNodeJson>(binding, path)
)
