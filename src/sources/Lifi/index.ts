
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	origin,
	stagingOrigin,
} from '$/sources/Lifi/Rest/constants.ts'
import LifiRestSource from '$/sources/Lifi/Rest/index.ts'

export default {
	provider: SourceProvider.Lifi,
	label: 'Lifi',
	origins: [
		{
			origin,
			corsEnabled: false,
		},
		{
			origin: stagingOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		LifiRestSource,
	],
} satisfies SourceProviderDefinition
