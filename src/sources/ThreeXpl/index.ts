import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import ThreeXplRestSource from '$/sources/ThreeXpl/Rest/index.ts'
import { threeXplOrigins } from '$/sources/ThreeXpl/Rest/constants.ts'

export default {
	provider: SourceProvider.ThreeXpl,
	label: '3xpl',
	origins: threeXplOrigins,
	sources: [
		ThreeXplRestSource,
	],
} satisfies SourceProviderDefinition
