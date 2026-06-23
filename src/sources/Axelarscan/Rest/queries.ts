import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { AxelarscanJson } from '$/sources/Axelarscan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<AxelarscanJson>(binding, path)
)
