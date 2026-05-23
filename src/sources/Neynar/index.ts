import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { origin } from '$/sources/Neynar/Rest/constants.ts'
import NeynarRestSource from '$/sources/Neynar/Rest/index.ts'

export default {
	provider: SourceProvider.Neynar,
	label: 'Neynar',
	env: arktype({
		PUBLIC_NEYNAR_API_KEY: 'string > 0?',
	}),
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		NeynarRestSource,
	],
} satisfies SourceProviderDefinition
