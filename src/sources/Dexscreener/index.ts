// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Dexscreener/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Dexscreener,
	label: 'Dexscreener',
	sources: [
		{
			source: Source.Dexscreener_OpenApi,
			label: 'Dexscreener OpenAPI',
		},
	],
	bindings: [bindings[Source.Dexscreener_OpenApi]],
} satisfies SourceProviderDefinition
