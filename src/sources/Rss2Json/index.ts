// Generated from APP.ts.

import bindings from '$/sources/Rss2Json/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Rss2Json,
	label: 'RSS2JSON',
	sources: [
		{
			source: Source.Rss2Json_Rest,
			label: 'RSS2JSON API',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
