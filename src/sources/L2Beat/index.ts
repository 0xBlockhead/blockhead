import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	origin,
} from '$/sources/L2Beat/Rest/constants.ts'
import L2BeatRestSource from '$/sources/L2Beat/Rest/index.ts'

export default {
	provider: SourceProvider.L2Beat,
	label: 'L2Beat',
	origins: [
		{
			origin,
			corsEnabled: true,
		},
	],
	sources: [
		L2BeatRestSource,
	],
} satisfies SourceProviderDefinition
