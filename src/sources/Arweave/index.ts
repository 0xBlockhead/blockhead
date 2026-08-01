// Generated from APP.ts.

import bindings from '$/sources/Arweave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Arweave,
	label: 'Arweave',
	sources: [
		{
			source: Source.Arweave_Rest,
			label: 'Arweave Gateway',
		},
		{
			source: Source.Arweave_Graphql,
			label: 'Arweave GraphQL',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
