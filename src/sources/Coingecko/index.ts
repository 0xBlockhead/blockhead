import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	demoOrigin,
	proOrigin,
} from '$/sources/Coingecko/Rest/constants.ts'
import CoingeckoOpenApiSource from '$/sources/Coingecko/OpenApi/index.ts'
import CoingeckoRestSource from '$/sources/Coingecko/Rest/index.ts'

export default {
	provider: SourceProvider.Coingecko,
	label: 'Coingecko',
	origins: [
		{
			origin: demoOrigin,
			corsEnabled: false,
		},
		{
			origin: proOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		CoingeckoRestSource,
		CoingeckoOpenApiSource,
	],
} satisfies SourceProviderDefinition
