
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { farcasterApiOrigins } from '$/sources/Farcaster/Rest/constants.ts'
import FarcasterRestSource from '$/sources/Farcaster/Rest/index.ts'

export default {
	provider: SourceProvider.Farcaster,
	label: 'Farcaster',
	origins: farcasterApiOrigins,
	sources: [
		FarcasterRestSource,
	],
} satisfies SourceProviderDefinition
