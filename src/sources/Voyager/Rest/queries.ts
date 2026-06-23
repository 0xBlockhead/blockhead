import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { VoyagerJson } from '$/sources/Voyager/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<VoyagerJson>(binding, path)
)
