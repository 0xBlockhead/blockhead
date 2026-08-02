// Generated from APP.ts.

import bindings from '$/sources/Arweave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Arweave,
	label: 'Arweave',
	sources: {
		[Source.Arweave_Rest]: {
			label: 'Arweave Gateway',
		},
		[Source.Arweave_Graphql]: {
			label: 'Arweave GraphQL',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
