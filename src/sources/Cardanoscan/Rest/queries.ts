import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { CardanoscanJson } from '$/sources/Cardanoscan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<CardanoscanJson>(binding, path)
)
