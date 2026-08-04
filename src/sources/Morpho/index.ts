// Generated from APP.ts.

import bindings from '$/sources/Morpho/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Morpho,
	label: 'Morpho',
	sources: {
		[Source.Morpho_Graphql]: {
			label: 'Morpho GraphQL API',
		},
		[Source.Morpho_Rest]: {
			label: 'Morpho Blue REST API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
