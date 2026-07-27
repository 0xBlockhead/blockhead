// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/GoogleAi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.GoogleAi,
	label: 'Google AI',
	sources: [
		{
			source: Source.GoogleAi_Rest,
			label: 'Google AI REST',
		},
	],
	bindings: [bindings[Source.GoogleAi_Rest]],
} satisfies SourceProviderDefinition
