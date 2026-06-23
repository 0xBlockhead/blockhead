import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { quilibriumNodeMetricsBindings } from '$/sources/QuilibriumNodeMetrics/bindings.ts'

export default {
	provider: SourceProvider.QuilibriumNodeMetrics,
	label: 'Quilibrium node metrics',
	sources: [
		{
			provider: SourceProvider.QuilibriumNodeMetrics,
			source: Source.QuilibriumNodeMetrics_Prometheus,
			label: 'Quilibrium node Prometheus metrics',
		},
	],
	bindings: quilibriumNodeMetricsBindings,
} satisfies SourceProviderDefinition
