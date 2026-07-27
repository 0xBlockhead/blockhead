// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/L2Beat/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.L2Beat,
	label: 'L2Beat',
	sources: [
		{
			source: Source.L2Beat_Rest,
			label: 'L2Beat REST',
		},
	],
	bindings: [bindings[Source.L2Beat_Rest]],
} satisfies SourceProviderDefinition
