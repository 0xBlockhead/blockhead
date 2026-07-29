// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Coinpaprika/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Coinpaprika,
	label: 'Coinpaprika',
	env: arktype({
		'PUBLIC_COINPAPRIKA_API_KEY': 'string > 0?',
	}),
	sources: [
		{
			source: Source.Coinpaprika_OpenApi,
			label: 'Coinpaprika OpenAPI',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
