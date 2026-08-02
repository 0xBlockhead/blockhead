// Generated from APP.ts.

import bindings from '$/sources/RedditPublic/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.RedditPublic,
	label: 'Reddit public JSON',
	sources: {
		[Source.Reddit_PublicJson]: {
			label: 'Reddit public JSON',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
