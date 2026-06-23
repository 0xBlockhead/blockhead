import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { CardanoKoiosJson } from '$/sources/CardanoKoios/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<CardanoKoiosJson>(binding, path)
)

export const getTip = (binding: SourceBinding) => (
	query(binding, '/api/v1/tip')
)

export const getEpochInfo = (binding: SourceBinding) => (
	query(binding, '/api/v1/epoch_info')
)
