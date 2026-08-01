// Generated from APP.ts.

import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AtprotoBsky,
	label: 'ATProto (Bsky public appview)',
	sources: [
		{
			source: Source.Atproto_Xrpc,
			label: 'ATProto XRPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
