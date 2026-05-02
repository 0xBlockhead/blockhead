import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	demoOrigin,
	proOrigin,
} from '$/sources/Coingecko/Rest/constants.ts'
import CoingeckoRestSource from '$/sources/Coingecko/Rest/index.ts'

export default {
	provider: SourceProvider.Coingecko,
	label: 'Coingecko',
	env: arktype({
		PUBLIC_COINGECKO_DEMO_API_KEY: 'string > 0?',
		PUBLIC_COINGECKO_PRO_API_KEY: 'string > 0?',
	}),
	origins: [
		{
			origin: demoOrigin,
			corsEnabled: true,
		},
		{
			origin: proOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		CoingeckoRestSource,
	],
} satisfies SourceProviderDefinition
