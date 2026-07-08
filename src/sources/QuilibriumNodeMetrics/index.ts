import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { quilibriumNodeMetricsBindings } from '$/sources/QuilibriumNodeMetrics/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const quilibriumNodeMetricsOrigins = sourceOriginsFromBindings(quilibriumNodeMetricsBindings)

const quilibriumNodeMetricsSourceProviderDefinition = {
	provider: SourceProvider.QuilibriumNodeMetrics,
	label: 'Quilibrium node metrics',
	sources: [
		{
			provider: SourceProvider.QuilibriumNodeMetrics,
			source: Source.QuilibriumNodeMetrics_Prometheus,
			label: 'Quilibrium node Prometheus',
		},
	],
	bindings: quilibriumNodeMetricsBindings,
	origins: quilibriumNodeMetricsOrigins,
} satisfies SourceProviderDefinition

export default quilibriumNodeMetricsSourceProviderDefinition
