// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CosmosAdrs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CosmosAdrs,
	label: 'Cosmos ADRs',
	sources: [
		{
			source: Source.CosmosAdrs_Github,
			label: 'Cosmos ADRs GitHub',
		},
	],
	bindings: [bindings[Source.CosmosAdrs_Github]],
} satisfies SourceProviderDefinition
