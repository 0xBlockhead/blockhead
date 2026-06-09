import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { fxEmbedApiOrigins } from '$/sources/FxEmbed/Rest/constants.ts'
import FxEmbedRestSource from '$/sources/FxEmbed/Rest/index.ts'

export default {
	provider: SourceProvider.FxEmbed,
	label: 'FxEmbed',
	origins: fxEmbedApiOrigins,
	sources: [
		FxEmbedRestSource,
	],
} satisfies SourceProviderDefinition
