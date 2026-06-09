import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { atprotoBskySocialOrigins } from '$/sources/AtprotoBskySocial/Rest/constants.ts'
import AtprotoBskySocialRestSource from '$/sources/AtprotoBskySocial/Rest/index.ts'

export default {
	provider: SourceProvider.AtprotoBskySocial,
	label: 'ATProto (Bsky social appview)',
	origins: atprotoBskySocialOrigins,
	sources: [
		AtprotoBskySocialRestSource,
	],
} satisfies SourceProviderDefinition
