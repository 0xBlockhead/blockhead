// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Cohere/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Cohere,
	label: 'Cohere',
	sources: [
		{
			source: Source.Cohere_Rest,
			label: 'Cohere REST',
		},
	],
	bindings: [bindings[Source.Cohere_Rest]],
} satisfies SourceProviderDefinition
