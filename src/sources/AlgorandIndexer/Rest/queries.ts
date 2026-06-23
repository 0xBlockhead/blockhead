import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { AlgorandIndexerJson } from '$/sources/AlgorandIndexer/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<AlgorandIndexerJson>(binding, path)
)
