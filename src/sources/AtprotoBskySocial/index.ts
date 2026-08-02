// Generated from APP.ts.

import bindings from '$/sources/AtprotoBskySocial/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AtprotoBskySocial,
	label: 'ATProto (Bsky social appview)',
	sources: [
		{
			source: Source.Atproto_BskySocial_Xrpc,
			label: 'ATProto Bsky Social XRPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
