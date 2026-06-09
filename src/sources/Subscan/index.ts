import { type as arktype } from 'arktype'

import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import SubscanRest from '$/sources/Subscan/Rest/index.ts'

export default {
	provider: SourceProvider.Subscan,
	label: 'Subscan',
	env: arktype({
		PUBLIC_SUBSCAN_API_KEY: 'string',
	}),
	origins: [
		{
			origin: 'https://polkadot.api.subscan.io',
			corsEnabled: false,
		},
	],
	sources: [
		SubscanRest,
	],
} as const satisfies SourceProviderDefinition
