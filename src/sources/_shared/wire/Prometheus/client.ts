import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'

export const getPrometheusText = (
	binding: SourceBinding
) => (
	getText(binding)
)
