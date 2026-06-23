import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { WakuNodeJson } from '$/sources/WakuNode/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<WakuNodeJson>(binding, path)
)

export const getDebugInfo = (binding: SourceBinding) => (
	query(binding, '/debug/v1/info')
)

export const getHealth = (binding: SourceBinding) => (
	query(binding, '/health')
)
