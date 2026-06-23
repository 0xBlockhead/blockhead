import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getPrometheusText } from '$/sources/_shared/wire/Prometheus/client.ts'

export const getMetrics = (binding: SourceBinding) => (
	getPrometheusText(binding)
)
