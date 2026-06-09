import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { atprotoBskyOrigins } from '$/sources/AtprotoBsky/Rest/constants.ts'
import AtprotoBskyRestSource from '$/sources/AtprotoBsky/Rest/index.ts'

export default {
	provider: SourceProvider.AtprotoBsky,
	label: 'ATProto (Bsky public appview)',
	origins: atprotoBskyOrigins,
	sources: [
		AtprotoBskyRestSource,
	],
} satisfies SourceProviderDefinition
