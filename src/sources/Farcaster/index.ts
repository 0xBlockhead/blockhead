
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { clientOrigin } from '$/sources/Farcaster/Rest/constants.ts'
import FarcasterRestSource from '$/sources/Farcaster/Rest/index.ts'

export default {
	provider: SourceProvider.Farcaster,
	label: 'Farcaster',
	origins: [
		{
			origin: clientOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		FarcasterRestSource,
	],
} satisfies SourceProviderDefinition
