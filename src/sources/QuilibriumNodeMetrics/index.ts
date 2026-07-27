// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/QuilibriumNodeMetrics/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.QuilibriumNodeMetrics,
	label: 'Quilibrium node metrics',
	sources: [
		{
			source: Source.QuilibriumNodeMetrics_Prometheus,
			label: 'Quilibrium node Prometheus',
		},
	],
	bindings: [bindings[Source.QuilibriumNodeMetrics_Prometheus]],
} satisfies SourceProviderDefinition
