import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { EnsMetadataServiceJson } from '$/sources/EnsMetadataService/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<EnsMetadataServiceJson>(binding, path)
)
