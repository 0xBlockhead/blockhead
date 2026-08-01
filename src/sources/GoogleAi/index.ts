// Generated from APP.ts.

import bindings from '$/sources/GoogleAi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.GoogleAi,
	label: 'Google AI',
	sources: [
		{
			source: Source.GoogleAi_Rest,
			label: 'Google AI REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
