import {
	getEpochInfo as getCardanoKoiosEpochInfo,
	getTip as getCardanoKoiosTip,
	query as cardanoKoiosQuery,
} from '$/sources/CardanoKoios/Rest/queries.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	cardanoKoiosQuery(binding, path)
)

export const getTip = (
	binding: SourceBinding
) => (
	getCardanoKoiosTip(binding)
)

export const getEpochInfo = (
	binding: SourceBinding
) => (
	getCardanoKoiosEpochInfo(binding)
)
