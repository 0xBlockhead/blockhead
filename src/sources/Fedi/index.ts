import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { fediOrigins } from '$/sources/Fedi/Rest/constants.ts'
import FediRestSource from '$/sources/Fedi/Rest/index.ts'

export default {
	provider: SourceProvider.Fedi,
	label: 'Fedi',
	origins: fediOrigins,
	sources: [
		FediRestSource,
	],
} satisfies SourceProviderDefinition
