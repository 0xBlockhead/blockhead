// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.Tally_Graphql]],
} satisfies SourceProviderDefinition
