import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { NodelyJson } from '$/sources/Nodely/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<NodelyJson>(binding, path)
)

export const getAlgodStatus = (binding: SourceBinding) => (
	query(binding, '/v2/status')
)

export const getIndexerHealth = (binding: SourceBinding) => (
	query(binding, '/health')
)
