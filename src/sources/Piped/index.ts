import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { pipedApiOrigins } from '$/sources/Piped/Rest/constants.ts'
import PipedRestSource from '$/sources/Piped/Rest/index.ts'

export default {
	provider: SourceProvider.Piped,
	label: 'Piped',
	origins: pipedApiOrigins,
	sources: [
		PipedRestSource,
	],
} satisfies SourceProviderDefinition
