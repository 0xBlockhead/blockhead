// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Tally/bindings.ts'

export default {
	provider: SourceProvider.Tally,
	label: 'Tally',
	sources: [
		{
			source: Source.Tally_Graphql,
			label: 'Tally GraphQL',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
