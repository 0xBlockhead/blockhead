// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Coingecko/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Coingecko,
	label: 'Coingecko',
	sources: [
		{
			source: Source.Coingecko_OpenApi,
			label: 'Coingecko OpenAPI',
		},
		{
			source: Source.Coingecko_Rest,
			label: 'Coingecko REST',
		},
	],
	bindings: [
		...bindings[Source.Coingecko_OpenApi],
		...bindings[Source.Coingecko_Rest],
	],
} satisfies SourceProviderDefinition
