import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { nostrBandApiOrigins } from '$/sources/NostrBand/Rest/constants.ts'
import NostrBandRestSource from '$/sources/NostrBand/Rest/index.ts'

export default {
	provider: SourceProvider.NostrBand,
	label: 'NostrBand',
	origins: nostrBandApiOrigins,
	sources: [
		NostrBandRestSource,
	],
} satisfies SourceProviderDefinition
