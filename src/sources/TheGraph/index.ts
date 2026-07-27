// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TheGraph/bindings.ts'

export default {
	provider: SourceProvider.TheGraph,
	label: 'The Graph',
	sources: [
		{
			source: Source.TheGraph_Graphql,
			label: 'The Graph GraphQL',
		},
	],
	bindings: [bindings[Source.TheGraph_Graphql]],
} satisfies SourceProviderDefinition
