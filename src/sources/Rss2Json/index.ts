// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Rss2Json/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Rss2Json,
	label: 'RSS2JSON',
	sources: [
		{
			source: Source.Rss2Json_Rest,
			label: 'RSS2JSON API',
		},
	],
	bindings: [bindings[Source.Rss2Json_Rest]],
} satisfies SourceProviderDefinition
