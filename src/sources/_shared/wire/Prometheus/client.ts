import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { PrometheusText } from '$/sources/_shared/wire/Prometheus/types.ts'

export const getPrometheusText = (
	binding: SourceBinding
): Promise<PrometheusText> => (
	getText(binding)
)
