import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	freeOrigin,
	proOrigin,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'
import CoinpaprikaOpenApiSource from '$/sources/Coinpaprika/OpenApi/index.ts'

export default {
	provider: SourceProvider.Coinpaprika,
	label: 'Coinpaprika',
	env: arktype({
		PUBLIC_COINPAPRIKA_API_KEY: 'string > 0?',
	}),
	origins: [
		{
			origin: freeOrigin,
			corsEnabled: false,
		},
		{
			origin: proOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		CoinpaprikaOpenApiSource,
	],
} satisfies SourceProviderDefinition
