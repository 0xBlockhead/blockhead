// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TheGraph/bindings.ts'

export default {
	provider: SourceProvider.TheGraph,
	label: 'The Graph',
	sources: {
		[Source.TheGraph_Graphql]: {
			label: 'The Graph GraphQL',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
