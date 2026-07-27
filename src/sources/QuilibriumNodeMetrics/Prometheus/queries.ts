import { getPrometheusText } from '$/sources/_shared/wire/Prometheus/client.ts'
import bindings from '$/sources/QuilibriumNodeMetrics/bindings.ts'
import { Source } from '$/sources/Source.ts'

export const getMetrics = () => (
	getPrometheusText(bindings[Source.QuilibriumNodeMetrics_Prometheus])
)
