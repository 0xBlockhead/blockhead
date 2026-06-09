import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Helius,
	label: 'Helius',
	env: arktype({
		PUBLIC_HELIUS_API_KEY: 'string',
	}),
	origins: [
		{
			origin: 'https://api-mainnet.helius-rpc.com',
			corsEnabled: true,
		},
	],
	sources: [
		{
			provider: SourceProvider.Helius,
			source: Source.Helius_Rest,
			label: 'Helius REST',
		},
	],
} as const satisfies SourceProviderDefinition
