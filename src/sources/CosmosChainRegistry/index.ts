// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CosmosChainRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CosmosChainRegistry,
	label: 'Cosmos Chain Registry name',
	sources: [
		{
			source: Source.CosmosChainRegistry_Github,
			label: 'Cosmos Chain Registry name GitHub',
		},
	],
	bindings: [bindings[Source.CosmosChainRegistry_Github]],
} satisfies SourceProviderDefinition
