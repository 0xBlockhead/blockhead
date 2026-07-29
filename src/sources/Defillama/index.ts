// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Defillama/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Defillama,
	label: 'Defillama',
	env: arktype({
		'PUBLIC_DEFILLAMA_PRO_API_KEY': 'string > 0?',
	}),
	sources: [
		{
			source: Source.Defillama_OpenApi,
			label: 'Defillama OpenAPI',
		},
		{
			source: Source.Defillama_Rest,
			label: 'Defillama REST',
			env: arktype({
				'PUBLIC_DEFILLAMA_PRO_API_KEY': 'string > 0?',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
