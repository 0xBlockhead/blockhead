import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { gatewayOrigin } from '$/sources/TheGraph/Graphql/constants.ts'
import TheGraphGraphqlSource from '$/sources/TheGraph/Graphql/index.ts'

export default {
	provider: SourceProvider.TheGraph,
	label: 'The Graph',
	env: arktype({
		PUBLIC_THEGRAPH_API_KEY: 'string > 0?',
	}),
	origins: [
		{
			origin: gatewayOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		TheGraphGraphqlSource,
	],
} satisfies SourceProviderDefinition
