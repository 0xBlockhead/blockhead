// Generated from APP.ts.

import bindings from '$/sources/CosmosChainRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CosmosChainRegistry,
	label: 'Cosmos Chain Registry name',
	sources: [
		{
			source: Source.CosmosChainRegistry_Github,
			label: 'Cosmos Chain Registry name GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
