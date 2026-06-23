import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { AlgodJson } from '$/sources/Algod/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<AlgodJson>(binding, path)
)
