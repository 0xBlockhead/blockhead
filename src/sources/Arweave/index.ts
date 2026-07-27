// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Arweave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
	bindings: [
		bindings[Source.Arweave_Rest],
		bindings[Source.Arweave_Graphql],
	],
} satisfies SourceProviderDefinition
