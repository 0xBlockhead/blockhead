// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AtprotoBsky,
	label: 'ATProto (Bsky public appview)',
	sources: [
		{
			source: Source.Atproto_Xrpc,
			label: 'ATProto XRPC',
		},
	],
	bindings: [bindings[Source.Atproto_Xrpc]],
} satisfies SourceProviderDefinition
