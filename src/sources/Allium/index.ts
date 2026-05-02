import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { origin } from '$/sources/Allium/Rest/constants.ts'
import AlliumRestSource from '$/sources/Allium/Rest/index.ts'

export default {
	provider: SourceProvider.Allium,
	label: 'Allium',
	env: arktype({
		PUBLIC_ALLIUM_API_KEY: 'string > 0',
	}),
	origins: [
		{
			origin,
			corsEnabled: true,
		},
	],
	sources: [
		AlliumRestSource,
	],
} satisfies SourceProviderDefinition
