import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	coinsOrigin,
	iconsOrigin,
	proOrigin,
} from '$/sources/Defillama/Rest/constants.ts'
import DefillamaOpenApiSource from '$/sources/Defillama/OpenApi/index.ts'
import DefillamaRestSource from '$/sources/Defillama/Rest/index.ts'

export default {
	provider: SourceProvider.Defillama,
	label: 'Defillama',
	env: arktype({
		PUBLIC_DEFILLAMA_PRO_API_KEY: 'string > 0?',
	}),
	origins: [
		{
			origin: coinsOrigin,
			corsEnabled: false,
		},
		{
			origin: iconsOrigin,
			corsEnabled: false,
		},
		{
			origin: proOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		DefillamaOpenApiSource,
		DefillamaRestSource,
	],
} satisfies SourceProviderDefinition
