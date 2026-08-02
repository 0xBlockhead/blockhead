// Generated from APP.ts.

import bindings from '$/sources/Cohere/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Cohere,
	label: 'Cohere',
	sources: [
		{
			source: Source.Cohere_Rest,
			label: 'Cohere REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
