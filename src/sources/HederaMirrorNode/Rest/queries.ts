import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { HederaMirrorNodeJson } from '$/sources/HederaMirrorNode/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<HederaMirrorNodeJson>(binding, path)
)
