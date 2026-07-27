// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AtprotoBskySocial/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AtprotoBskySocial,
	label: 'ATProto (Bsky social appview)',
	sources: [
		{
			source: Source.Atproto_BskySocial_Xrpc,
			label: 'ATProto Bsky Social XRPC',
		},
	],
	bindings: [bindings[Source.Atproto_BskySocial_Xrpc]],
} satisfies SourceProviderDefinition
