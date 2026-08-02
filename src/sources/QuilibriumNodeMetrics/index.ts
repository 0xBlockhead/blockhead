// Generated from APP.ts.

import bindings from '$/sources/QuilibriumNodeMetrics/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.QuilibriumNodeMetrics,
	label: 'Quilibrium node metrics',
	sources: [
		{
			source: Source.QuilibriumNodeMetrics_Prometheus,
			label: 'Quilibrium node Prometheus',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
