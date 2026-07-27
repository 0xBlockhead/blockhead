// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/RedditPublic/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.RedditPublic,
	label: 'Reddit public JSON',
	sources: [
		{
			source: Source.Reddit_PublicJson,
			label: 'Reddit public JSON',
		},
	],
	bindings: [bindings[Source.Reddit_PublicJson]],
} satisfies SourceProviderDefinition
