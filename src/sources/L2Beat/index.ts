// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/L2Beat/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.L2Beat,
	label: 'L2Beat',
	sources: [
		{
			source: Source.L2Beat_Rest,
			label: 'L2Beat REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
