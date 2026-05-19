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
